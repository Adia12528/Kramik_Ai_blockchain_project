import mongoose from 'mongoose'

const studentScheduleSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Schedule',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

studentScheduleSchema.index({ studentId: 1, scheduleId: 1 }, { unique: true })

const StudentSchedule = mongoose.model('StudentSchedule', studentScheduleSchema)

export default StudentSchedule
