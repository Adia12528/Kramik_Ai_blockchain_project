import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Profile fields - initially empty, to be filled by user
  enrollmentId: String,
  course: String,
  college: String,
  organization: String, // For admin users
  department: String, // For admin users
  semester: String,
  year: String,
  gpa: String,
  creditsCompleted: Number,
  totalCredits: Number,
  skills: [String],
  joinedDate: Date,
  phone: String,
  address: String,
  bio: String,
  profileImage: String,
  selectedSubjects: [String], // Array of subject codes for AI Quiz
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);

export default User;
