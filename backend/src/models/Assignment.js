import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['assignment', 'project', 'lab'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creditPoints: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  cloudinaryPublicId: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

export default Assignment
