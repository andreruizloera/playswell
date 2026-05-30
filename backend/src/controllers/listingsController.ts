import { Request, Response } from 'express'
import { z } from 'zod'
import { pool } from '../config/database'

const listingSchema = z.object({
  card_id:      z.string().optional(),
  card_name:    z.string().min(1),
  set_name:     z.string().default(''),
  card_number:  z.string().optional(),
  category:     z.string().min(1),
  image_url:    z.string().url().optional().or(z.literal('')),
  price:        z.number().positive(),
  condition:    z.string().min(1),
  seller_name:  z.string().min(1),
  seller_email: z.string().email(),
  description:  z.string().optional(),
  tags:         z.array(z.string()).default([]),
})

export async function getListings(req: Request, res: Response) {
  try {
    const {
      category, q, minPrice, maxPrice,
      sort = 'listed_at', order = 'desc',
      page = '1', pageSize = '40',
    } = req.query as Record<string,string>

    const p  = Math.max(1, parseInt(page))
    const ps = Math.min(100, parseInt(pageSize))
    const offset = (p - 1) * ps

    const conditions: string[] = ["status = 'active'"]
    const params: any[] = []
    let i = 1

    if (category) { conditions.push(`category = $${i++}`); params.push(category) }
    if (q)        { conditions.push(`(LOWER(card_name) LIKE LOWER($${i++}) OR LOWER(set_name) LIKE LOWER($${i-1}))`); params.push(`%${q}%`) }
    if (minPrice) { conditions.push(`price >= $${i++}`); params.push(parseFloat(minPrice)) }
    if (maxPrice) { conditions.push(`price <= $${i++}`); params.push(parseFloat(maxPrice)) }

    const where = conditions.join(' AND ')
    const allowedSorts: Record<string,string> = {
      listed_at: 'listed_at', price: 'price', card_name: 'card_name'
    }
    const sortCol = allowedSorts[sort] || 'listed_at'
    const sortDir = order === 'asc' ? 'ASC' : 'DESC'

    const { rows } = await pool.query(`
      SELECT * FROM listings WHERE ${where}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT $${i++} OFFSET $${i}
    `, [...params, ps, offset])

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as total FROM listings WHERE ${where}`,
      params
    )

    res.json({
      data:  rows,
      total: parseInt(countRows[0].total),
      page:  p,
      pageSize: ps,
    })
  } catch (err: any) {
    console.error('listings/get error:', err.message)
    res.status(500).json({ error: 'Failed to fetch listings' })
  }
}

export async function getListing(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM listings WHERE id = $1 AND status = 'active'",
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Listing not found' })
    res.json({ data: rows[0] })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch listing' })
  }
}

export async function createListing(req: Request, res: Response) {
  try {
    const data = listingSchema.parse(req.body)
    const { rows } = await pool.query(`
      INSERT INTO listings
        (card_id, card_name, set_name, card_number, category, image_url,
         price, condition, seller_name, seller_email, description, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      data.card_id || null, data.card_name, data.set_name, data.card_number || null,
      data.category, data.image_url || null, data.price, data.condition,
      data.seller_name, data.seller_email, data.description || null, data.tags,
    ])
    res.status(201).json({ data: rows[0] })
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: 'Failed to create listing' })
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='active') AS active_listings,
        COUNT(*) FILTER (WHERE status='sold')   AS total_sold,
        COALESCE(SUM(price) FILTER (WHERE status='active'), 0) AS active_value,
        COALESCE(AVG(price) FILTER (WHERE status='active'), 0) AS avg_price,
        COUNT(DISTINCT category) AS categories
      FROM listings
    `)
    const { rows: catRows } = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM listings WHERE status='active'
      GROUP BY category ORDER BY count DESC
    `)
    const { rows: feeRows } = await pool.query(`
      SELECT
        COALESCE(SUM(cause_amount),0) AS total_to_ben,
        COALESCE(SUM(platform_fee),0) AS total_fees
      FROM fee_log
    `)
    res.json({
      ...rows[0],
      by_category: catRows,
      ...feeRows[0],
    })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}
