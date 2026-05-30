import { Router } from 'express'
import * as submissions from '../controllers/submissionsController'

const router = Router()

router.post('/',                     submissions.createSubmission)  // public
router.get('/',                      submissions.getSubmissions)    // admin
router.post('/:id/approve',          submissions.approveSubmission) // admin
router.post('/:id/reject',           submissions.rejectSubmission)  // admin

export default router
