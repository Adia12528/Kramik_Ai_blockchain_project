import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

// Helper function to generate unique sequential enrollment ID
const generateEnrollmentId = async () => {
  const currentYear = new Date().getFullYear()
  const prefix = `KRM${currentYear}`
  
  // Find the highest enrollment ID for the current year
  const lastUser = await User.findOne({
    enrollmentId: { $regex: `^${prefix}` }
  }).sort({ enrollmentId: -1 })
  
  let sequenceNumber = 1
  if (lastUser && lastUser.enrollmentId) {
    const lastSequence = parseInt(lastUser.enrollmentId.replace(prefix, ''))
    sequenceNumber = lastSequence + 1
  }
  
  // Format: KRM2025001, KRM2025002, etc.
  return `${prefix}${String(sequenceNumber).padStart(3, '0')}`
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('Login attempt:', { email })

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Demo logins (accept both username and email)
    const isAdminDemo =
      (email === 'admin' || email === 'admin@kramik.com') && password === 'admin123';
    const isStudentDemo =
      (email === 'student' || email === 'student@kramik.com') && password === 'stu123';

    if (isAdminDemo) {
      const token = jwt.sign(
        { userId: 'admin-1', userType: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        user: {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@kramik.com',
          userType: 'admin',
          enrollmentId: 'ADMIN001',
        },
        token,
      });
    }

    if (isStudentDemo) {
      const token = jwt.sign(
        { userId: 'student-demo-1', userType: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        user: {
          id: 'student-demo-1',
          name: 'Demo Student',
          email: 'student@kramik.com',
          userType: 'student',
          enrollmentId: 'KRM2025000',
        },
        token,
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true })

    if (!user) {
      console.log('User not found:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log('Password mismatch for:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId
    }

    console.log('Login successful:', userResponse)

    res.json({
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, userType = 'student' } = req.body

    console.log('Registration attempt:', { name, email, userType })

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Generate unique enrollment ID
    const enrollmentId = await generateEnrollmentId()
    console.log('Generated enrollment ID:', enrollmentId)

    // Create new user with hashed password and enrollment ID
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType,
      enrollmentId
    })

    const token = jwt.sign(
      { userId: newUser._id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      walletAddress: newUser.walletAddress,
      enrollmentId: newUser.enrollmentId
    }

    console.log('Registration successful:', userResponse)

    res.status(201).json({
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const blockchainLogin = async (req, res) => {
  try {
    console.log('🔷 [BACKEND] Blockchain login request received')
    const { message, signature, userType } = req.body

    console.log('🔷 [BACKEND] Request body:', { 
      messageLength: message?.length, 
      signatureLength: signature?.length, 
      userType,
      messagePreview: message?.substring(0, 50)
    })

    if (!message || !signature) {
      console.log('❌ [BACKEND] Missing message or signature')
      return res.status(400).json({ error: 'Message and signature are required' })
    }

    // Extract wallet address from message
    const walletMatch = message.match(/Wallet: (0x[a-fA-F0-9]{40})/)
    const walletAddress = walletMatch ? walletMatch[1] : '0x' + Math.random().toString(16).substr(2, 40)

    console.log('🔷 [BACKEND] Extracted wallet address:', walletAddress)

    // Check if user already exists with this wallet
    console.log('🔷 [BACKEND] Checking for existing user...')
    let user = await User.findOne({ walletAddress, isActive: true })

    if (!user) {
      console.log('🔷 [BACKEND] Creating new blockchain user...')
      
      // Generate enrollment ID for new blockchain user
      const enrollmentId = await generateEnrollmentId()
      console.log('🔷 [BACKEND] Generated enrollment ID:', enrollmentId)
      
      // Generate random password and hash it
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      
      // Create new user
      user = await User.create({
        name: `User ${walletAddress.substring(0, 6)}`,
        email: `${walletAddress.toLowerCase()}@blockchain.kramik.com`,
        password: hashedPassword,
        userType: userType || 'student',
        walletAddress,
        enrollmentId
      })
      console.log('✅ [BACKEND] Created new blockchain user:', user.email, 'with enrollment ID:', enrollmentId)
    } else {
      console.log('✅ [BACKEND] Existing blockchain user found:', user.email)
    }

    console.log('🔷 [BACKEND] Generating JWT token...')
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId
    }

    console.log('✅ [BACKEND] Sending successful response:', { userId: user._id, userType: user.userType, enrollmentId: user.enrollmentId })
    res.json({
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('❌ [BACKEND] Blockchain login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(500).json({ 
      error: 'Blockchain authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user in MongoDB
    const user = await User.findOne({ _id: decoded.userId, isActive: true })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}