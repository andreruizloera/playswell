import { Request, Response } from 'express'
import { z } from 'zod'
import {
  searchPokemonCards, getPokemonCard, getPokemonSet,
  searchLegoSets, getLegoSet,
  searchCached, calcFee
} from '../services/cardService'

export async function search(req: Request, res: Response) {
  try {
    const { q = '', category, page = '1', pageSize = '20' } = req.query as Record<string,string>
    if (!q.trim()) return res.json({ data: [], total: 0 })

    const p  = Math.max(1, parseInt(page))
    const ps = Math.min(100, parseInt(pageSize))

    let result
    if (category === 'pokemon') {
      result = await searchPokemonCards(q, p, ps)
    } else if (category === 'lego') {
      result = await searchLegoSets(q, p, ps)
    } else {
      result = await searchCached(q, category, p, ps)
    }

    res.json(result)
  } catch (err: any) {
    console.error('cards/search error:', err.message)
    res.status(500).json({ error: 'Search failed', message: err.message })
  }
}

export async function getCard(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    let card

    if (id.startsWith('lego-')) {
      card = await getLegoSet(id.replace('lego-', ''))
    } else {
      card = await getPokemonCard(id)
    }

    if (!card) return res.status(404).json({ error: 'Card not found' })
    res.json({ data: card })
  } catch (err: any) {
    console.error('cards/get error:', err.message)
    res.status(500).json({ error: 'Failed to get card' })
  }
}

export async function getSet(req: Request, res: Response) {
  try {
    const setId = req.params.setId as string
    const result = await getPokemonSet(setId)
    res.json(result)
  } catch (err: any) {
    console.error('cards/set error:', err.message)
    res.status(500).json({ error: 'Failed to get set' })
  }
}

export async function feeCalc(req: Request, res: Response) {
  try {
    const schema = z.object({ price: z.number().positive() })
    const { price } = schema.parse(req.body)
    res.json(calcFee(price))
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}
