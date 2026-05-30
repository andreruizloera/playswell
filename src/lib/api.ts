const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

async function get<T>(path: string, params?: Record<string,string|number>): Promise<T> {
  const url = new URL(`${BASE}${path}`)
  if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

// ── Listings ──────────────────────────────────────────────────────────────

export interface Listing {
  id: number
  card_id: string | null
  card_name: string
  set_name: string
  card_number: string | null
  category: string
  image_url: string | null
  price: number
  condition: string
  seller_name: string
  description: string | null
  tags: string[]
  status: string
  listed_at: string
}

export interface ListingsResponse {
  data: Listing[]
  total: number
  page: number
  pageSize: number
}

export function getListings(params?: {
  category?: string; q?: string; minPrice?: number; maxPrice?: number;
  sort?: string; order?: string; page?: number; pageSize?: number
}): Promise<ListingsResponse> {
  return get('/listings', params as any)
}

export function getListing(id: number): Promise<{ data: Listing }> {
  return get(`/listings/${id}`)
}

export function getStats(): Promise<Record<string,any>> {
  return get('/listings/stats')
}

// ── Cards (search / metadata) ─────────────────────────────────────────────

export interface CardResult {
  id: string
  category: string
  card_name: string
  set_name: string
  card_number: string | null
  rarity: string | null
  image_url: string | null
  extra: Record<string,any>
}

export interface CardsResponse {
  data: CardResult[]
  total?: number
  fromCache?: boolean
}

export function searchCards(q: string, category?: string, page = 1): Promise<CardsResponse> {
  return get('/cards/search', { q, ...(category ? { category } : {}), page, pageSize: 24 })
}

export function getCard(id: string): Promise<{ data: CardResult }> {
  return get(`/cards/${id}`)
}

// ── Fee calculator ─────────────────────────────────────────────────────────

export interface FeeBreakdown {
  salePrice: number
  platformFee: number
  causeAmount: number
  opsAmount: number
  sellerPayout: number
}

export function calcFee(price: number): Promise<FeeBreakdown> {
  return post('/cards/fee', { price })
}

// ── Submissions ───────────────────────────────────────────────────────────

export interface SubmissionPayload {
  card_name: string
  set_name?: string
  card_number?: string
  category: string
  condition: string
  asking_price: number
  description?: string
  seller_name: string
  seller_email: string
  paypal_email?: string
  image_urls?: string[]
}

export interface SubmissionResponse {
  data: { id: number; submitted_at: string }
  feeBreakdown: FeeBreakdown
  message: string
}

export function createSubmission(payload: SubmissionPayload): Promise<SubmissionResponse> {
  return post('/submissions', payload)
}
