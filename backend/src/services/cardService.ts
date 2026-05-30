import { pool } from '../config/database'
import { config } from 'dotenv'

config()

const POKE_BASE = process.env.POKEMON_TCG_BASE || 'https://api.pokemontcg.io/v2'
const POKE_KEY  = process.env.POKEMON_TCG_KEY  || ''
const BRICK_BASE = process.env.REBRICKABLE_BASE || 'https://rebrickable.com/api/v3'
const BRICK_KEY  = process.env.REBRICKABLE_KEY  || ''

// ── helpers ────────────────────────────────────────────────────────────────

function pokeHeaders() {
  const h: Record<string,string> = { 'Content-Type': 'application/json' }
  if (POKE_KEY) h['X-Api-Key'] = POKE_KEY
  return h
}

async function fetchJSON(url: string, headers: Record<string,string> = {}) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.json()
}

// ── cache layer ────────────────────────────────────────────────────────────

async function cacheGet(id: string) {
  const { rows } = await pool.query('SELECT * FROM card_cache WHERE id = $1', [id])
  return rows[0] || null
}

async function cacheSet(row: {
  id: string; category: string; card_name: string; set_name: string;
  card_number?: string; rarity?: string; image_url?: string; extra?: object
}) {
  await pool.query(`
    INSERT INTO card_cache (id, category, card_name, set_name, card_number, rarity, image_url, extra, fetched_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
    ON CONFLICT (id) DO UPDATE SET
      card_name=$3, set_name=$4, card_number=$5, rarity=$6, image_url=$7, extra=$8, fetched_at=NOW()
  `, [row.id, row.category, row.card_name, row.set_name,
      row.card_number || null, row.rarity || null, row.image_url || null,
      JSON.stringify(row.extra || {})])
}

// ── Pokemon TCG ────────────────────────────────────────────────────────────

export async function searchPokemonCards(query: string, page = 1, pageSize = 20) {
  // First check our cache
  const cached = await pool.query(`
    SELECT * FROM card_cache
    WHERE category = 'pokemon'
      AND (LOWER(card_name) LIKE LOWER($1) OR LOWER(set_name) LIKE LOWER($1))
    ORDER BY card_name
    LIMIT $2 OFFSET $3
  `, [`%${query}%`, pageSize, (page - 1) * pageSize])

  if (cached.rows.length > 0) return { data: cached.rows, fromCache: true }

  // Hit the API
  const encoded = encodeURIComponent(`name:${query}*`)
  const url = `${POKE_BASE}/cards?q=${encoded}&pageSize=${pageSize}&page=${page}&orderBy=name`
  const json: any = await fetchJSON(url, pokeHeaders())

  const cards = (json.data || []).map((c: any) => ({
    id:          c.id,
    category:    'pokemon',
    card_name:   c.name,
    set_name:    c.set?.name || '',
    card_number: c.number,
    rarity:      c.rarity,
    image_url:   c.images?.small || c.images?.large || null,
    extra:        { supertype: c.supertype, subtypes: c.subtypes, hp: c.hp, types: c.types },
  }))

  // Cache results in background
  Promise.all(cards.map(cacheSet)).catch(console.error)

  return { data: cards, fromCache: false, total: json.totalCount }
}

export async function getPokemonCard(id: string) {
  const cached = await cacheGet(id)
  if (cached) return cached

  const url = `${POKE_BASE}/cards/${id}`
  const json: any = await fetchJSON(url, pokeHeaders())
  const c = json.data
  if (!c) return null

  const row = {
    id:          c.id,
    category:    'pokemon',
    card_name:   c.name,
    set_name:    c.set?.name || '',
    card_number: c.number,
    rarity:      c.rarity,
    image_url:   c.images?.small || null,
    extra:        { supertype: c.supertype, subtypes: c.subtypes, hp: c.hp, types: c.types },
  }
  await cacheSet(row)
  return row
}

export async function getPokemonSet(setId: string) {
  // Fetch all cards in a set, cache them all
  const { rows: existing } = await pool.query(`
    SELECT COUNT(*) as cnt FROM card_cache
    WHERE category='pokemon' AND extra->>'setId' = $1
  `, [setId])

  if (parseInt(existing[0].cnt) > 0) {
    const { rows } = await pool.query(`
      SELECT * FROM card_cache WHERE category='pokemon' AND extra->>'setId'=$1 ORDER BY card_name
    `, [setId])
    return { data: rows, fromCache: true }
  }

  let page = 1, all: any[] = []
  while (true) {
    const url = `${POKE_BASE}/cards?q=set.id:${setId}&pageSize=250&page=${page}&orderBy=number`
    const json: any = await fetchJSON(url, pokeHeaders())
    const cards = json.data || []
    all = all.concat(cards)
    if (all.length >= json.totalCount || cards.length === 0) break
    page++
  }

  const rows = all.map((c: any) => ({
    id:          c.id,
    category:    'pokemon',
    card_name:   c.name,
    set_name:    c.set?.name || '',
    card_number: c.number,
    rarity:      c.rarity,
    image_url:   c.images?.small || null,
    extra:        { setId, supertype: c.supertype, subtypes: c.subtypes, types: c.types },
  }))

  await Promise.all(rows.map(cacheSet))
  return { data: rows, fromCache: false }
}

// ── Rebrickable / LEGO ─────────────────────────────────────────────────────

export async function searchLegoSets(query: string, page = 1, pageSize = 20) {
  const cached = await pool.query(`
    SELECT * FROM card_cache
    WHERE category = 'lego'
      AND (LOWER(card_name) LIKE LOWER($1) OR card_number LIKE $1)
    ORDER BY card_name LIMIT $2 OFFSET $3
  `, [`%${query}%`, pageSize, (page - 1) * pageSize])

  if (cached.rows.length > 0) return { data: cached.rows, fromCache: true }

  if (!BRICK_KEY) {
    return { data: [], fromCache: false, error: 'No Rebrickable API key configured' }
  }

  const url = `${BRICK_BASE}/lego/sets/?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&key=${BRICK_KEY}`
  const json: any = await fetchJSON(url)
  const rows = (json.results || []).map((s: any) => ({
    id:          `lego-${s.set_num}`,
    category:    'lego',
    card_name:   s.name,
    set_name:    s.theme_id ? `Theme ${s.theme_id}` : 'LEGO',
    card_number: s.set_num,
    rarity:      `${s.num_parts} parts`,
    image_url:   s.set_img_url || null,
    extra:        { year: s.year, num_parts: s.num_parts, set_url: s.set_url },
  }))

  await Promise.all(rows.map(cacheSet))
  return { data: rows, fromCache: false, total: json.count }
}

export async function getLegoSet(setNum: string) {
  const id = `lego-${setNum}`
  const cached = await cacheGet(id)
  if (cached) return cached

  if (!BRICK_KEY) return null

  const url = `${BRICK_BASE}/lego/sets/${setNum}/?key=${BRICK_KEY}`
  const s: any = await fetchJSON(url)
  const row = {
    id,
    category:    'lego',
    card_name:   s.name,
    set_name:    'LEGO',
    card_number: s.set_num,
    rarity:      `${s.num_parts} parts`,
    image_url:   s.set_img_url || null,
    extra:        { year: s.year, num_parts: s.num_parts },
  }
  await cacheSet(row)
  return row
}

// ── Generic cache search (for already-cached items) ────────────────────────

export async function searchCached(query: string, category?: string, page = 1, pageSize = 20) {
  const catFilter = category ? 'AND category = $3' : ''
  const params: any[] = [`%${query}%`, pageSize, ...(category ? [category] : []), (page - 1) * pageSize]

  const { rows } = await pool.query(`
    SELECT * FROM card_cache
    WHERE (LOWER(card_name) LIKE LOWER($1) OR LOWER(set_name) LIKE LOWER($1))
    ${catFilter}
    ORDER BY card_name
    LIMIT $2 OFFSET ${category ? '$4' : '$3'}
  `, params)

  const { rows: countRows } = await pool.query(`
    SELECT COUNT(*) as total FROM card_cache
    WHERE (LOWER(card_name) LIKE LOWER($1) OR LOWER(set_name) LIKE LOWER($1))
    ${catFilter}
  `, category ? [`%${query}%`, category] : [`%${query}%`])

  return { data: rows, total: parseInt(countRows[0].total), page, pageSize }
}

// ── Fee calculator ─────────────────────────────────────────────────────────

export function calcFee(price: number) {
  const feePercent = parseFloat(process.env.FEE_PERCENT || '0.04')
  const feeFixed   = parseFloat(process.env.FEE_FIXED   || '0.50')
  const causeSplit = parseFloat(process.env.CAUSE_SPLIT  || '0.60')

  const fee        = price * feePercent + feeFixed
  const causeAmt   = fee * causeSplit
  const opsAmt     = fee * (1 - causeSplit)
  const sellerGets = price - fee

  return {
    salePrice:   price,
    platformFee: parseFloat(fee.toFixed(2)),
    causeAmount: parseFloat(causeAmt.toFixed(2)),
    opsAmount:   parseFloat(opsAmt.toFixed(2)),
    sellerPayout: parseFloat(sellerGets.toFixed(2)),
  }
}
