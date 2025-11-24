import Assignment from '../models/Assignment.js'
import Subject from '../models/Subject.js'
import User from '../models/User.js'
import StudentAssignment from '../models/StudentAssignment.js'
import Schedule from '../models/Schedule.js'
import { uploadFileToCloudinary, deleteFileFromCloudinary, getFileUrl } from '../services/s3Service.js'

export const getDashboard = async (req, res) => {
  try {
    // Get assignment statistics from MongoDB
    const totalAssignments = await Assignment.countDocuments({ type: 'assignment' })
    const totalProjects = await Assignment.countDocuments({ type: 'project' })
    const totalLabs = await Assignment.countDocuments({ type: 'lab' })
    const activeAssignments = await Assignment.countDocuments({ type: 'assignment', status: 'active' })
    const activeProjects = await Assignment.countDocuments({ type: 'project', status: 'active' })
    const activeLabs = await Assignment.countDocuments({ type: 'lab', status: 'active' })
    
    // Get user counts
    const totalStudents = await User.countDocuments({ userType: 'student' })
    const totalSubjects = await Subject.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    
    // Get completed assignments stats
    const completedAssignments = await StudentAssignment.countDocuments({ status: 'completed' })
    const completedProjects = await StudentAssignment.countDocuments({ status: 'completed' }) // Assuming similar tracking
    const completedLabs = await StudentAssignment.countDocuments({ status: 'completed' }) // Assuming similar tracking
    
    // Get recent registrations
    const recentRegistrations = await User.find({ userType: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email userType createdAt')
      .lean()
    
    const stats = {
      totalStudents,
      totalSubjects,
      activeUsers,
      recentRegistrations,
      total_assignments: totalAssignments,
      total_projects: totalProjects,
      total_labs: totalLabs,
      active_assignments: activeAssignments,
      active_projects: activeProjects,
      active_labs: activeLabs,
      pendingApprovals: 0,
      systemHealth: 100,
      completed_assignments: completedAssignments,
      completed_projects: completedProjects,
      completed_labs: completedLabs,
      pending_assignments: totalAssignments - completedAssignments,
      pending_projects: totalProjects - completedProjects,
      pending_labs: totalLabs - completedLabs
    }
    res.json(stats)
  } catch (error) {
    console.error('Get dashboard error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, userType } = req.query
    const query = userType ? { userType } : {}
    
    const skip = (page - 1) * limit
    
    const users = await User.find(query)
      .select('name email userType isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
    
    const total = await User.countDocuments(query)
    
    const result = {
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    }
    
    res.json(result)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

export const createSubject = async (req, res) => {
  try {
    const { name, code, description, external_url, category, semester, color } = req.body

    const existingSubject = await Subject.findOne({ code })
    if (existingSubject) {
      return res.status(409).json({ error: 'Subject with this code already exists' })
    }

    const newSubject = await Subject.create({
      name,
      code,
      description,
      externalUrl: external_url,
      category,
      semester: parseInt(semester),
      color,
      isActive: true
    })

    res.status(201).json(newSubject)
  } catch (error) {
    console.error('Create subject error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const subject = await Subject.findByIdAndUpdate(id, updates, { new: true })
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' })
    }

    res.json(subject)
  } catch (error) {
    console.error('Update subject error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params

    const subject = await Subject.findByIdAndDelete(id)
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' })
    }

    res.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Delete subject error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Assignment Management
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    
    // Transform MongoDB documents to include id field for frontend compatibility
    const transformedAssignments = assignments.map(assignment => ({
      ...assignment,
      id: assignment._id.toString(),
    }));
    
    console.log(`📋 Returning ${transformedAssignments.length} assignments to admin`);
    res.json(transformedAssignments);
  } catch (error) {
    console.error('❌ Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { title, type, subject, subjectCode, description, creditPoints, dueDate, difficulty } = req.body;
    let fileUrl = null;
    let fileName = null;
    let cloudinaryPublicId = null;

    console.log('Creating assignment:', { title, type, subject, hasFile: !!req.file });

    // If file is uploaded, store it in Cloudinary
    if (req.file) {
      try {
        const uploadResult = await uploadFileToCloudinary(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        fileUrl = uploadResult.url;
        fileName = req.file.originalname;
        cloudinaryPublicId = uploadResult.publicId;
        console.log('✅ File uploaded to Cloudinary:', fileUrl);
      } catch (uploadError) {
        console.error('❌ File upload failed:', uploadError);
        // Log error but continue - don't block assignment creation
        console.warn('⚠️ Continuing assignment creation without file upload');
      }
    }
    
    const assignment = await Assignment.create({
      title,
      type,
      subject,
      subjectCode,
      description,
      creditPoints,
      dueDate,
      difficulty,
      fileUrl,
      fileName,
      cloudinaryPublicId
    });
    
    console.log('Assignment created successfully:', assignment._id);
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating assignment ${id}:`, updates);
    
    const assignment = await Assignment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Add id field for frontend compatibility
    const response = {
      ...assignment,
      id: assignment._id.toString()
    };
    
    console.log('✅ Assignment updated successfully');
    res.json(response);
  } catch (error) {
    console.error('❌ Update assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to update assignment' });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting assignment: ${id}`);
    
    // Get the assignment to retrieve Cloudinary public ID before deletion
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      console.log('❌ Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Delete file from Cloudinary if exists
    if (assignment.cloudinaryPublicId) {
      try {
        console.log('🗑️ Deleting file from Cloudinary:', assignment.cloudinaryPublicId);
        await deleteFileFromCloudinary(assignment.cloudinaryPublicId);
        console.log('✅ File deleted from Cloudinary');
      } catch (cloudinaryError) {
        console.error('⚠️ Cloudinary deletion failed (continuing with DB deletion):', cloudinaryError.message);
      }
    }
    
    // Delete from database
    await Assignment.findByIdAndDelete(id);
    console.log('✅ Assignment deleted from database');
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('❌ Delete assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete assignment' });
  }
};

const sortScheduleEntries = (entries) => {
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  }

  return entries.sort((a, b) => {
    const dayDifference = (dayOrder[a.dayOfWeek] || 8) - (dayOrder[b.dayOfWeek] || 8)
    if (dayDifference !== 0) {
      return dayDifference
    }

    return a.startTime.localeCompare(b.startTime)
  })
}

const formatScheduleEntry = (entry) => ({
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
  isActive: entry.isActive,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
})

export const getSchedule = async (req, res) => {
  try {
    const entries = await Schedule.find({ isActive: true }).lean()
    const formatted = sortScheduleEntries(entries).map((entry) => formatScheduleEntry(entry))
    res.json(formatted)
  } catch (error) {
    console.error('Get schedule error:', error)
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
}

export const createScheduleEntry = async (req, res) => {
  try {
    const {
      title,
      subjectCode,
      dayOfWeek,
      startTime,
      endTime,
      credits,
      location,
      instructor,
      semester,
      description,
      resourceUrl,
      bgColor,
      borderColor,
    } = req.body

    if (!title || !subjectCode || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields for schedule entry' })
    }

    const scheduleEntry = await Schedule.create({
      title,
      subjectCode,
      dayOfWeek,
      startTime,
      endTime,
      credits,
      location,
      instructor,
      semester,
      description,
      resourceUrl,
      bgColor,
      borderColor,
      createdBy: req.user.userId,
    })

    res.status(201).json(formatScheduleEntry(scheduleEntry))
  } catch (error) {
    console.error('Create schedule entry error:', error)
    res.status(500).json({ error: error.message || 'Failed to create schedule entry' })
  }
}

export const updateScheduleEntry = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const entry = await Schedule.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

    if (!entry) {
      return res.status(404).json({ error: 'Schedule entry not found' })
    }

    res.json(formatScheduleEntry(entry))
  } catch (error) {
    console.error('Update schedule entry error:', error)
    res.status(500).json({ error: error.message || 'Failed to update schedule entry' })
  }
}

export const deleteScheduleEntry = async (req, res) => {
  try {
    const { id } = req.params

    const entry = await Schedule.findByIdAndUpdate(id, { isActive: false }, { new: true })

    if (!entry) {
      return res.status(404).json({ error: 'Schedule entry not found' })
    }

    res.json({ message: 'Schedule entry deleted successfully' })
  } catch (error) {
    console.error('Delete schedule entry error:', error)
    res.status(500).json({ error: error.message || 'Failed to delete schedule entry' })
  }
}