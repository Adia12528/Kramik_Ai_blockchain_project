import express from 'express'
import { 
  getDashboard, 
  getUsers, 
  createSubject, 
  updateSubject, 
  deleteSubject,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getSchedule,
  createScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry
} from '../controllers/adminController.js'
import { getProfile, updateProfile, updateProfileImage, updateSkills } from '../controllers/profileController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

// Profile management for admin
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/profile/image', updateProfileImage)
router.patch('/profile/skills', updateSkills)

// Admin management routes
router.get('/dashboard', getDashboard)
router.get('/users', getUsers)
router.get('/assignments', getAssignments);
router.post('/assignments', upload.single('file'), createAssignment);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);
router.post('/subjects', createSubject)
router.put('/subjects/:id', updateSubject)
router.delete('/subjects/:id', deleteSubject)
router.get('/schedule', getSchedule)
router.post('/schedule', createScheduleEntry)
router.put('/schedule/:id', updateScheduleEntry)
router.delete('/schedule/:id', deleteScheduleEntry)

export default router