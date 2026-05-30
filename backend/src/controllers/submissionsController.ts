import { Request, Response } from 'express'
import { z } from 'zod'
import { pool } from '../config/database'
import { calcFee } from '../services/cardService'

const submitSchema = z.object({
  card_name:    z.string().min(1),
  set_name:     z.string().optional().default(''),
  card_number:  z.string().optional(),
  category:     z.string().min(1),
  condition:    z.string().min(1),
  asking_price: z.number().positive(),
  description:  z.string().optional(),
  seller_name:  z.string().min(1),
  seller_email: z.string().email(),
  paypal_email: z.string().email().optional().or(z.literal('')),
  image_urls:   z.array(z.string()).default([]),
})

export async function createSubmission(req: Request, res: Response) {
  try {
    const data = submitSchema.parse(req.body)
    const fee  = calcFee(data.asking_price)

    const { rows } = await pool.query(`
      INSERT INTO submissions
        (card_name, set_name, card_number, category, condition,
         asking_price, description, seller_name, seller_email, paypal_email, image_urls)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [
      data.card_name, data.set_name, data.card_number || null,
      data.category, data.condition, data.asking_price, data.description || null,
      data.seller_name, data.seller_email, data.paypal_email || null, data.image_urls,
    ])

    res.status(201).json({
      data: rows[0],
      feeBreakdown: fee,
      message: `Submission received. You'll hear back at ${data.seller_email} within 24 hours.`,
    })
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    console.error('submission error:', err.message)
    res.status(500).json({ error: 'Failed to create submission' })
  }
}

export async function getSubmissions(req: Request, res: Response) {
  try {
    const { status = 'pending', page = '1' } = req.query as Record<string,string>
    const p = Math.max(1, parseInt(page))
    const { rows } = await pool.query(`
      SELECT * FROM submissions WHERE status = $1
      ORDER BY submitted_at DESC LIMIT 50 OFFSET $2
    `, [status, (p-1)*50])
    res.json({ data: rows })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
}

export async function approveSubmission(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { reviewer_note } = req.body

    // Get submission
    const { rows: sub } = await pool.query('SELECT * FROM submissions WHERE id=$1', [id])
    if (!sub[0]) return res.status(404).json({ error: 'Submission not found' })
    const s = sub[0]

    // Create listing from approved submission
    const { rows: listing } = await pool.query(`
      INSERT INTO listings
        (card_name, set_name, card_number, category, price, condition,
         seller_name, seller_email, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `, [s.card_name, s.set_name, s.card_number, s.category,
        s.asking_price, s.condition, s.seller_name, s.seller_email, s.description])

    // Mark submission approved
    await pool.query(`
      UPDATE submissions SET status='approved', reviewer_note=$1, reviewed_at=NOW()
      WHERE id=$2
    `, [reviewer_note || null, id])

    res.json({ data: listing[0], message: 'Approved and listed.' })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to approve submission' })
  }
}

export async function rejectSubmission(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { reviewer_note } = req.body
    await pool.query(`
      UPDATE submissions SET status='rejected', reviewer_note=$1, reviewed_at=NOW()
      WHERE id=$2
    `, [reviewer_note || '', id])
    res.json({ message: 'Submission rejected.' })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reject submission' })
  }
}
