import express from 'express'
import { 
  getSubjects,
  getAssignments,
  markAssignmentComplete,
  getSchedule,
  markScheduleEntryComplete
} from '../controllers/studentController.js'
import { getProfile, updateProfile, updateProfileImage, updateSkills } from '../controllers/profileController.js'
import { authenticate, requireStudent } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(requireStudent)

// Profile management for students
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/profile/image', updateProfileImage)
router.patch('/profile/skills', updateSkills)

// Student-specific routes
router.get('/subjects', getSubjects)
router.get('/assignments', getAssignments);
router.post('/assignments/:assignmentId/complete', markAssignmentComplete);
router.get('/schedule', getSchedule)
router.post('/schedule/:scheduleId/complete', markScheduleEntryComplete)

export default router