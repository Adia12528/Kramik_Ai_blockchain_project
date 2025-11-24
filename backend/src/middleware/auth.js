import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const requireStudent = (req, res, next) => {
  if (req.user.userType !== 'student') {
    return res.status(403).json({ error: 'Student access required' })
  }
  next()
}