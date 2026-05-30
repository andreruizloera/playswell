import { Router } from 'express'
import * as cards from '../controllers/cardsController'

const router = Router()

router.get('/search',     cards.search)   // ?q=charizard&category=pokemon&page=1
router.get('/set/:setId', cards.getSet)   // fetch entire set, cache all
router.get('/fee',        cards.feeCalc)  // POST body: { price }
router.post('/fee',       cards.feeCalc)
router.get('/:id',        cards.getCard)  // base1-4 or lego-75257-1

export default router
