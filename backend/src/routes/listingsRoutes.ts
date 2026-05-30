import { Router } from 'express'
import * as listings from '../controllers/listingsController'

const router = Router()

router.get('/',        listings.getListings)   // ?category=pokemon&q=charizard&page=1
router.get('/stats',   listings.getStats)
router.get('/:id',     listings.getListing)
router.post('/',       listings.createListing) // admin use

export default router
