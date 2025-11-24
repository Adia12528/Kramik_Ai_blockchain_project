import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  externalUrl: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject
