import mongoose from 'mongoose'

const scheduleEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    resourceUrl: {
      type: String,
      trim: true,
    },
    bgColor: {
      type: String,
      default: 'bg-indigo-500',
      trim: true,
    },
    borderColor: {
      type: String,
      default: 'border-indigo-500',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Schedule = mongoose.model('Schedule', scheduleEntrySchema)

export default Schedule
