import express from 'express'
import { 
  getStudyAdvice, 
  analyzeSubject, 
  generateProjectIdeas 
} from '../controllers/geminiController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)

router.post('/study-advice', getStudyAdvice)
router.post('/analyze-subject', analyzeSubject)
router.post('/project-ideas', generateProjectIdeas)

export default router