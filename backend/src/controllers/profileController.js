import User from '../models/User.js';

// Get user profile - works for both admin and student
export const getProfile = async (req, res) => {
  try {
    // Handle demo users (admin-1, student-demo-1)
    if (req.user.userId === 'admin-1') {
      return res.json({
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@kramik.com',
        userType: 'admin',
        enrollmentId: 'ADMIN001',
        organization: 'Kramik Platform Management',
        department: 'Computer Science',
        phone: '+91 98765 43210',
        address: 'Delhi, India',
        bio: 'Platform administrator managing the Kramik educational system.',
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (req.user.userId === 'student-demo-1') {
      return res.json({
        id: 'student-demo-1',
        name: 'Demo Student',
        email: 'student@kramik.com',
        userType: 'student',
        walletAddress: null,
        enrollmentId: 'KRM2025000',
        course: 'B.Tech Computer Science',
        college: 'Demo Engineering College',
        semester: 'Semester 5',
        year: '3rd Year',
        gpa: '8.5',
        creditsCompleted: 80,
        totalCredits: 160,
        skills: ['JavaScript', 'React', 'Node.js'],
        joinedDate: new Date(),
        phone: null,
        address: null,
        bio: null,
        profileImage: null,
        socialLinks: { linkedin: null, github: null, twitter: null },
        profileCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const user = await User.findOne({ _id: req.user.userId, isActive: true })
      .select('-password')
      .lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId || null,
      course: user.course || null,
      college: user.college || null,
      organization: user.organization || null,
      department: user.department || null,
      semester: user.semester || null,
      year: user.year || null,
      gpa: user.gpa || null,
      creditsCompleted: user.creditsCompleted || 0,
      totalCredits: user.totalCredits || 160,
      skills: user.skills || [],
      joinedDate: user.joinedDate || user.createdAt,
      phone: user.phone || null,
      address: user.address || null,
      bio: user.bio || null,
      profileImage: user.profileImage || null,
      socialLinks: user.socialLinks || { linkedin: null, github: null, twitter: null },
      profileCompleted: user.profileCompleted || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Auto-generate suggestions from email for students if profile not completed
    if (user.userType === 'student' && !user.profileCompleted) {
      const emailDomain = user.email.split('@')[1];
      const emailName = user.email.split('@')[0];
      
      // Suggest college from email domain if it looks like an educational domain
      if (!profileData.college && emailDomain && (emailDomain.includes('.edu') || emailDomain.includes('university') || emailDomain.includes('college'))) {
        profileData.suggestedCollege = emailDomain.split('.')[0].charAt(0).toUpperCase() + emailDomain.split('.')[0].slice(1) + ' University';
      }
      
      // Generate enrollment number from email
      if (!profileData.enrollmentId && emailName.match(/\d+/)) {
        profileData.suggestedEnrollmentId = emailName.toUpperCase();
      }
    }

    res.json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile - works for both admin and student
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Handle demo users - they cannot update their profiles via database
    if (req.user.userId === 'admin-1') {
      console.log('🔷 Demo admin update - returning updated values');
      return res.json({
        id: 'admin-1',
        name: updates.name !== undefined ? updates.name : 'Admin User',
        email: 'admin@kramik.com',
        userType: 'admin',
        enrollmentId: 'ADMIN001',
        organization: updates.organization !== undefined ? updates.organization : 'Kramik Platform Management',
        department: updates.department !== undefined ? updates.department : 'Computer Science',
        phone: updates.phone !== undefined ? updates.phone : '+91 98765 43210',
        address: updates.address !== undefined ? updates.address : 'Delhi, India',
        bio: updates.bio !== undefined ? updates.bio : 'Platform administrator managing the Kramik educational system.',
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (req.user.userId === 'student-demo-1') {
      return res.json({
        id: 'student-demo-1',
        name: updates.name || 'Demo Student',
        email: 'student@kramik.com',
        userType: 'student',
        walletAddress: null,
        enrollmentId: updates.enrollmentId || 'KRM2025000',
        course: updates.course || 'B.Tech Computer Science',
        college: updates.college || 'Demo Engineering College',
        semester: updates.semester || 'Semester 5',
        year: updates.year || '3rd Year',
        gpa: updates.gpa || '8.5',
        creditsCompleted: updates.creditsCompleted || 80,
        totalCredits: updates.totalCredits || 160,
        skills: updates.skills || ['JavaScript', 'React', 'Node.js'],
        joinedDate: new Date(),
        phone: updates.phone || null,
        address: updates.address || null,
        bio: updates.bio || null,
        profileImage: null,
        socialLinks: updates.socialLinks || { linkedin: null, github: null, twitter: null },
        profileCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Remove fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.userType;
    delete updates._id;
    
    console.log('📝 Updating profile:', updates);
    
    // Check if profile is complete
    const requiredFields = ['enrollmentId', 'course', 'college', 'semester', 'year'];
    const hasAllRequired = requiredFields.every(field => 
      updates[field] !== undefined && updates[field] !== null && updates[field] !== ''
    );
    
    if (hasAllRequired) {
      updates.profileCompleted = true;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ Profile updated successfully');
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      walletAddress: user.walletAddress,
      enrollmentId: user.enrollmentId,
      course: user.course,
      college: user.college,
      organization: user.organization,
      department: user.department,
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
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};

// Update profile image
export const updateProfileImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { profileImage: imageUrl } },
      { new: true }
    ).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile image updated successfully', 
      imageUrl: user.profileImage 
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({ error: 'Failed to update profile image' });
  }
};

// Update skills only
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { skills: skillsArray } },
      { new: true }
    ).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Skills updated successfully', 
      skills: user.skills 
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
};