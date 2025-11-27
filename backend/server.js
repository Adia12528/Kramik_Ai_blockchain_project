import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './src/config/mongodb.js'

// Import routes
import authRoutes from './src/routes/auth.js'
import studentRoutes from './src/routes/students.js'
import adminRoutes from './src/routes/admin.js'
import subjectRoutes from './src/routes/subjects.js'
import geminiRoutes from './src/routes/gemini.js'
import aiChatRoutes from './src/routes/aiChat.js'

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// CORS: Allow Vercel frontend, Render backend, and local dev
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://kramik-ai-blockchain-project.vercel.app',
      'https://kramik-ai-blockchain-project-clgum6yn1-adia12528s-projects.vercel.app',
      'https://kramik-ai-blockchain-project.onrender.com',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}))

// Handle preflight requests explicitly
app.options('*', cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/gemini', geminiRoutes)
app.use('/api/ai-chat', aiChatRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Kramik Backend API',
    version: '1.0.0'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 Kramik Engineering Hub API`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})