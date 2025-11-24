import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Assignment from '../models/Assignment.js'
import StudentAssignment from '../models/StudentAssignment.js'
import User from '../models/User.js'
import Schedule from '../models/Schedule.js'
import StudentSchedule from '../models/StudentSchedule.js'

export const getSubjects = async (req, res) => {
  try {
    // Return empty subjects array - no demo data
    res.json([])
  } catch (error) {
    console.error('Get subjects error:', error)
    res.status(500).json({ error: 'Failed to fetch subjects' })
  }
}

export const getAssignments = async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    // Fetch all active assignments
    const assignments = await Assignment.find({ status: 'active' }).sort({ dueDate: 1 }).lean();
    
    // Get student's completion status for each assignment
    const studentAssignments = await StudentAssignment.find({ studentId }).lean();
    
    // Create a map of assignment completions
    const completionMap = {};
    studentAssignments.forEach(sa => {
      completionMap[sa.assignmentId.toString()] = {
        completion_status: sa.status,
        completed_at: sa.completedAt
      };
    });
    
    // Merge the data and transform _id to id
    const assignmentsWithStatus = assignments.map(assignment => ({
      id: assignment._id.toString(), // Add id field for frontend compatibility
      _id: assignment._id,
      title: assignment.title,
      type: assignment.type,
      subject: assignment.subject,
      subjectCode: assignment.subjectCode,
      description: assignment.description,
      creditPoints: assignment.creditPoints,
      dueDate: assignment.dueDate,
      difficulty: assignment.difficulty,
      status: assignment.status,
      fileUrl: assignment.fileUrl,
      fileName: assignment.fileName,
      cloudinaryPublicId: assignment.cloudinaryPublicId,
      completion_status: completionMap[assignment._id.toString()]?.completion_status || 'pending',
      completed_at: completionMap[assignment._id.toString()]?.completed_at || null,
      earnedPoints: completionMap[assignment._id.toString()]?.completion_status === 'completed' ? assignment.creditPoints : 0
    }));
    
    console.log(`📚 Fetched ${assignmentsWithStatus.length} assignments for student ${studentId}`);
    console.log('📎 File URLs:', assignmentsWithStatus.map(a => ({ title: a.title, fileUrl: a.fileUrl, fileName: a.fileName })));
    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.json([]);
  }
};

export const markAssignmentComplete = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { assignmentId } = req.params;
    
    console.log(`✅ Marking assignment complete - Student: ${studentId}, Assignment: ${assignmentId}`);
    
    // Verify assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      console.log('❌ Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Check if already completed
    const existing = await StudentAssignment.findOne({ studentId, assignmentId });
    if (existing && existing.status === 'completed') {
      console.log('⚠️ Assignment already completed');
      return res.status(400).json({ error: 'Assignment already completed' });
    }
    
    // Mark as complete
    const studentAssignment = await StudentAssignment.findOneAndUpdate(
      { studentId, assignmentId },
      { 
        status: 'completed', 
        completedAt: new Date() 
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    
    console.log('✅ Assignment marked as complete successfully');
    res.json({
      message: 'Assignment completed successfully',
      assignment: studentAssignment,
      earnedPoints: assignment.creditPoints
    });
  } catch (error) {
    console.error('❌ Mark assignment complete error:', error);
    res.status(500).json({ error: error.message || 'Failed to mark assignment as complete' });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ userType: 'student' })
      .select('name email walletAddress createdAt isActive')
      .sort({ createdAt: -1 })
      .lean()
    
    // Transform to match expected format
    const transformedStudents = students.map(student => ({
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      walletAddress: student.walletAddress,
      blockchainVerified: !!student.walletAddress,
      createdAt: student.createdAt,
      isActive: student.isActive
    }))
    
    res.json(transformedStudents)
  } catch (error) {
    console.error('Get all students error:', error)
    res.status(500).json({ error: 'Failed to fetch students' })
  }
}

export const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, userType: 'student' })
      .select('-password')
      .lean()
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }
    
    // Transform to match expected format
    const studentProfile = {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      walletAddress: student.walletAddress,
      blockchainVerified: !!student.walletAddress,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    }
    
    res.json(studentProfile)
  } catch (error) {
    console.error('Get student by id error:', error)
    res.status(500).json({ error: 'Failed to fetch student' })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, userType: 'student' },
      { isActive: false },
      { new: true }
    ).lean()
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }
    
    res.json({ message: 'Student deactivated successfully' })
  } catch (error) {
    console.error('Delete student error:', error)
    res.status(500).json({ error: 'Failed to deactivate student' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const user = await User.findById(userId).select('-password').lean()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId,
      course: user.course,
      college: user.college,
      semester: user.semester,
      year: user.year,
      gpa: user.gpa,
      creditsCompleted: user.creditsCompleted,
      totalCredits: user.totalCredits,
      skills: user.skills || [],
      joinedDate: user.joinedDate || user.createdAt,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      profileImage: user.profileImage,
      socialLinks: user.socialLinks || {},
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const updates = req.body
    
    // Remove fields that shouldn't be updated via this endpoint
    delete updates.password
    delete updates.email
    delete updates.userType
    delete updates._id
    
    console.log('📝 Updating profile for user:', userId, updates)
    
    // Check if profile is now complete
    const requiredFields = ['enrollmentId', 'course', 'college', 'semester', 'year']
    const isComplete = requiredFields.every(field => updates[field] || updates[field] !== undefined)
    
    if (isComplete) {
      updates.profileCompleted = true
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password').lean()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ Profile updated successfully')
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId,
      course: user.course,
      college: user.college,
      semester: user.semester,
      year: user.year,
      gpa: user.gpa,
      creditsCompleted: user.creditsCompleted,
      totalCredits: user.totalCredits,
      skills: user.skills || [],
      joinedDate: user.joinedDate || user.createdAt,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      profileImage: user.profileImage,
      socialLinks: user.socialLinks || {},
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  } catch (error) {
    console.error('❌ Update profile error:', error)
    res.status(500).json({ error: error.message || 'Failed to update profile' })
  }
}

export const getSchedule = async (req, res) => {
  try {
    const studentId = req.user.userId?.toString()
    const entries = await Schedule.find({ isActive: true }).lean()

    const completionDocs = studentId
      ? await StudentSchedule.find({ studentId }).lean()
      : []

    const completionMap = completionDocs.reduce((acc, doc) => {
      acc[doc.scheduleId.toString()] = {
        status: doc.status,
        completedAt: doc.completedAt,
      }
      return acc
    }, {})

    const dayOrder = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    }

    const formatted = entries
      .sort((a, b) => {
        const dayDiff = (dayOrder[a.dayOfWeek] || 8) - (dayOrder[b.dayOfWeek] || 8)
        if (dayDiff !== 0) {
          return dayDiff
        }
        return (a.startTime || '').localeCompare(b.startTime || '')
      })
      .map((entry) => ({
        id: entry._id.toString(),
        title: entry.title,
        subjectCode: entry.subjectCode,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        credits: entry.credits,
        location: entry.location,
        instructor: entry.instructor,
        semester: entry.semester,
        description: entry.description,
        resourceUrl: entry.resourceUrl,
        bgColor: entry.bgColor,
        borderColor: entry.borderColor,
        completionStatus: completionMap[entry._id.toString()]?.status || 'pending',
        completedAt: completionMap[entry._id.toString()]?.completedAt || null,
      }))

    res.json(formatted)
  } catch (error) {
    console.error('Get student schedule error:', error)
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
}

export const markScheduleEntryComplete = async (req, res) => {
  try {
    const studentId = req.user.userId?.toString()
    const { scheduleId } = req.params

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return res.status(400).json({ error: 'Invalid schedule entry id' })
    }

    const scheduleEntry = await Schedule.findById(scheduleId)

    if (!scheduleEntry || !scheduleEntry.isActive) {
      return res.status(404).json({ error: 'Schedule entry not found' })
    }

    const completedAt = new Date()

    const studentSchedule = await StudentSchedule.findOneAndUpdate(
      { studentId, scheduleId },
      { status: 'completed', completedAt },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    if (mongoose.Types.ObjectId.isValid(studentId)) {
      await User.findByIdAndUpdate(
        studentId,
        { $inc: { creditsCompleted: scheduleEntry.credits || 0 } }
      )
    }

    res.json({
      message: 'Schedule entry marked as completed',
      schedule: {
        id: scheduleId,
        status: studentSchedule.status,
        completedAt: studentSchedule.completedAt,
        creditsEarned: scheduleEntry.credits || 0,
      },
    })
  } catch (error) {
    console.error('Mark schedule complete error:', error)
    res.status(500).json({ error: error.message || 'Failed to mark schedule entry as complete' })
  }
}