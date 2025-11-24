import express from 'express'
import { login, register, blockchainLogin, verifyToken } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/blockchain-login', blockchainLogin)
router.get('/verify', verifyToken)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router