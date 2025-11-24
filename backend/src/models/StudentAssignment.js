import mongoose from 'mongoose'

const studentAssignmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'submitted'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Compound index to ensure one record per student-assignment pair
studentAssignmentSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true })

const StudentAssignment = mongoose.model('StudentAssignment', studentAssignmentSchema)

export default StudentAssignment
