import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import AIAssistant from '../components/admin/AIAssistant'

const StudentManager = ({ students, loading, error, onDelete }) => {
  if (loading) return <div className="text-center p-8">Loading students...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="glass-effect p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Student Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Enrolled Courses</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-200/50 hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.courses.join(', ')}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onDelete(student.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AssignmentManager = ({ assignments, loading, error, onDelete, onUpdateStatus }) => {
  if (loading) return <div className="text-center p-8">Loading assignments...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="glass-effect p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Assignment Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => {
              const assignmentId = assignment.id || assignment._id?.toString();
              return (
                <tr key={assignmentId} className="border-b border-gray-200/50 hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{assignment.title}</td>
                  <td className="px-6 py-4">{assignment.subject}</td>
                  <td className="px-6 py-4">{new Date(assignment.dueDate || assignment.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => onUpdateStatus(assignmentId, assignment.status === 'active' ? 'archived' : 'active')}
                      className={`font-medium hover:underline ${
                        assignment.status === 'active' ? 'text-orange-500' : 'text-green-500'
                      }`}
                    >
                      {assignment.status === 'active' ? 'Archive' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => onDelete(assignmentId)} 
                      className="font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showWebsiteLinksModal, setShowWebsiteLinksModal] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [dailyQuote, setDailyQuote] = useState({ text: '', author: '' })
  const [websiteLinks, setWebsiteLinks] = useState([])
  const [newWebsiteLink, setNewWebsiteLink] = useState({
    title: '',
    url: '',
    description: '',
    category: 'AI Tools'
  })
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    organization: '',
    department: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: ''
  })
  const [editFormData, setEditFormData] = useState({})
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    activeCourses: 0,
    pendingApprovals: 0,
    systemHealth: 100,
    total_assignments: 0,
    total_projects: 0,
    total_labs: 0,
    completed_assignments: 0,
    completed_projects: 0,
    completed_labs: 0,
    pending_assignments: 0,
    pending_projects: 0,
    pending_labs: 0
  })

  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [errorAssignments, setErrorAssignments] = useState(null)

  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [errorStudents, setErrorStudents] = useState(null)

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    type: 'assignment',
    subject: '',
    subjectCode: '',
    description: '',
    creditPoints: 0,
    dueDate: '',
    difficulty: 'Medium',
    file: null
  })

  const scheduleColorThemes = {
    indigo: { label: 'Indigo', bgColor: 'bg-indigo-500', borderColor: 'border-indigo-500' },
    emerald: { label: 'Emerald', bgColor: 'bg-emerald-500', borderColor: 'border-emerald-500' },
    amber: { label: 'Amber', bgColor: 'bg-amber-500', borderColor: 'border-amber-500' },
    purple: { label: 'Purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
    sky: { label: 'Sky', bgColor: 'bg-sky-500', borderColor: 'border-sky-500' },
  }

  const [scheduleEntries, setScheduleEntries] = useState([])
  const [loadingSchedule, setLoadingSchedule] = useState(true)
  const [scheduleError, setScheduleError] = useState(null)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [scheduleFormData, setScheduleFormData] = useState({
    title: '',
    subjectCode: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    credits: 0,
    location: '',
    instructor: '',
    semester: '',
    description: '',
    resourceUrl: '',
    colorKey: 'indigo'
  })

  const totalScheduledCredits = scheduleEntries.reduce((sum, entry) => sum + (entry.credits || 0), 0)

  // Generate daily motivational quote for admins
  const generateDailyQuote = () => {
    const today = new Date().toDateString()
    const savedQuote = localStorage.getItem('kramik_admin_daily_quote')
    const savedDate = localStorage.getItem('kramik_admin_quote_date')
    
    // If quote exists for today, return it
    if (savedQuote && savedDate === today) {
      return JSON.parse(savedQuote)
    }
    
    // AI-powered motivational quotes for admins and leaders
    const quotes = [
      { text: "Leadership is not about being in charge. It's about taking care of those in your charge.", author: "Simon Sinek" },
      { text: "Great leaders don't set out to be a leader. They set out to make a difference.", author: "Anonymous" },
      { text: "The best executive is the one who has sense enough to pick good people and self-restraint to keep from meddling.", author: "Theodore Roosevelt" },
      { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
      { text: "Management is doing things right; leadership is doing the right things.", author: "Peter Drucker" },
      { text: "The function of leadership is to produce more leaders, not more followers.", author: "Ralph Nader" },
      { text: "Innovation distinguishes between a leader and a follower. Lead with vision.", author: "Steve Jobs" },
      { text: "Efficiency is doing things right; effectiveness is doing the right things.", author: "Peter Drucker" },
      { text: "The greatest leader is not necessarily the one who does the greatest things, but the one who gets others to do great things.", author: "Ronald Reagan" },
      { text: "Leadership is the capacity to translate vision into reality. Stay focused.", author: "Warren Bennis" },
      { text: "Don't manage outcomes, provide the conditions for success and trust your team.", author: "Anonymous" },
      { text: "The best way to predict the future is to create it. Take action today.", author: "Peter Drucker" },
      { text: "Your most important work is empowering others to do their most important work.", author: "Anonymous" },
      { text: "Excellence is not a destination; it is a continuous journey that never ends.", author: "Brian Tracy" },
      { text: "The challenge of leadership is to be strong, but not rude; be kind, but not weak.", author: "Jim Rohn" },
      { text: "A good objective of leadership is to help those who are doing poorly to do well and to help those who are doing well to do even better.", author: "Jim Rohn" },
      { text: "Leadership is about making others better as a result of your presence and making sure that impact lasts in your absence.", author: "Sheryl Sandberg" },
      { text: "The task of leadership is not to put greatness into people, but to elicit it, for the greatness is there already.", author: "John Buchan" },
      { text: "Delegate tasks, empower decisions, and watch your team flourish.", author: "Anonymous" },
      { text: "A leader takes people where they want to go. A great leader takes people where they don't necessarily want to go, but ought to be.", author: "Rosalynn Carter" },
      { text: "The quality of a leader is reflected in the standards they set for themselves.", author: "Ray Kroc" },
      { text: "Leadership and learning are indispensable to each other. Keep growing.", author: "John F. Kennedy" },
      { text: "To handle yourself, use your head; to handle others, use your heart.", author: "Eleanor Roosevelt" },
      { text: "The art of communication is the language of leadership. Listen more, speak wisely.", author: "James Humes" },
      { text: "Leadership is not wielding authority - it's empowering people. Inspire action.", author: "Becky Brodin" }
    ]
    
    // Generate deterministic index based on date (same quote for same day)
    const dateHash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = dateHash % quotes.length
    const quote = quotes[index]
    
    // Save to localStorage
    localStorage.setItem('kramik_admin_daily_quote', JSON.stringify(quote))
    localStorage.setItem('kramik_admin_quote_date', today)
    
    return quote
  }

  const calculateHealth = () => {
    const lastLoginKey = 'admin_last_login'
    const now = new Date()
    const lastLogin = localStorage.getItem(lastLoginKey)
    
    if (!lastLogin) {
      // First time login
      localStorage.setItem(lastLoginKey, now.toISOString())
      return 100
    }
    
    const lastLoginDate = new Date(lastLogin)
    const daysDiff = Math.floor((now - lastLoginDate) / (1000 * 60 * 60 * 24))
    
    // Update last login to today
    localStorage.setItem(lastLoginKey, now.toISOString())
    
    // Calculate health: 100% - (days inactive * 1%)
    const currentHealth = Math.max(0, 100 - daysDiff)
    return currentHealth
  }

  useEffect(() => {
    setIsVisible(true)
    
    // Set initial quote
    setDailyQuote(generateDailyQuote())
    
    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    
    // Calculate and update health
    const health = calculateHealth()
    setStats(prevStats => ({
      ...prevStats,
      systemHealth: health
    }))
    
    fetchAdminProfile()
    fetchAssignments()
    fetchStudents()
    fetchDashboardStats()
    fetchScheduleEntries()
    loadWebsiteLinks()
    
    return () => clearInterval(clockInterval)
  }, [])

  const loadWebsiteLinks = () => {
    const savedLinks = localStorage.getItem('kramik_website_links')
    if (savedLinks) {
      setWebsiteLinks(JSON.parse(savedLinks))
    }
  }

  const saveWebsiteLinks = (links) => {
    localStorage.setItem('kramik_website_links', JSON.stringify(links))
    setWebsiteLinks(links)
  }

  const handleAddWebsiteLink = () => {
    if (!newWebsiteLink.title || !newWebsiteLink.url) {
      alert('❌ Please fill in title and URL')
      return
    }

    const link = {
      id: Date.now().toString(),
      ...newWebsiteLink,
      createdAt: new Date().toISOString()
    }

    const updatedLinks = [...websiteLinks, link]
    saveWebsiteLinks(updatedLinks)
    setNewWebsiteLink({ title: '', url: '', description: '', category: 'AI Tools' })
    alert('✅ Website link added successfully!')
  }

  const handleDeleteWebsiteLink = (id) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const updatedLinks = websiteLinks.filter(link => link.id !== id)
      saveWebsiteLinks(updatedLinks)
      alert('✅ Link deleted successfully!')
    }
  }

  const resetScheduleForm = () => {
    setScheduleFormData({
      title: '',
      subjectCode: '',
      dayOfWeek: 'Monday',
      startTime: '',
      endTime: '',
      credits: 0,
      location: '',
      instructor: '',
      semester: '',
      description: '',
      resourceUrl: '',
      colorKey: 'indigo'
    })
    setEditingSchedule(null)
  }

  const fetchScheduleEntries = async () => {
    try {
      setLoadingSchedule(true)
      const response = await adminAPI.getSchedule()
      setScheduleEntries(response.data || [])
      setScheduleError(null)
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
      setScheduleError(error.message)
    } finally {
      setLoadingSchedule(false)
    }
  }

  const handleScheduleSubmit = async (e) => {
    e.preventDefault()

    const theme = scheduleColorThemes[scheduleFormData.colorKey] || scheduleColorThemes.indigo

    const payload = {
      title: scheduleFormData.title.trim(),
      subjectCode: scheduleFormData.subjectCode.trim(),
      dayOfWeek: scheduleFormData.dayOfWeek,
      startTime: scheduleFormData.startTime,
      endTime: scheduleFormData.endTime,
      credits: Number(scheduleFormData.credits) || 0,
      location: scheduleFormData.location.trim(),
      instructor: scheduleFormData.instructor.trim(),
      semester: scheduleFormData.semester.trim(),
      description: scheduleFormData.description.trim(),
      resourceUrl: scheduleFormData.resourceUrl.trim(),
      bgColor: theme.bgColor,
      borderColor: theme.borderColor
    }

    if (!payload.title || !payload.subjectCode || !payload.startTime || !payload.endTime) {
      alert('❌ Please fill in the title, subject code, start time, and end time')
      return
    }

    try {
      if (editingSchedule) {
        await adminAPI.updateScheduleEntry(editingSchedule.id, payload)
        alert('✅ Schedule entry updated successfully!')
      } else {
        await adminAPI.createScheduleEntry(payload)
        alert('✅ Schedule entry created successfully!')
      }

      await fetchScheduleEntries()
      resetScheduleForm()
    } catch (error) {
      console.error('Failed to save schedule entry:', error)
      setScheduleError(error.message)
      alert(`❌ Failed to save schedule entry: ${error.message}`)
    }
  }

  const handleEditSchedule = (entry) => {
    if (!entry) return

    const matchedColor = Object.entries(scheduleColorThemes).find(([, value]) =>
      value.bgColor === entry.bgColor && value.borderColor === entry.borderColor
    )

    setScheduleFormData({
      title: entry.title || '',
      subjectCode: entry.subjectCode || '',
      dayOfWeek: entry.dayOfWeek || 'Monday',
      startTime: entry.startTime || '',
      endTime: entry.endTime || '',
      credits: entry.credits || 0,
      location: entry.location || '',
      instructor: entry.instructor || '',
      semester: entry.semester || '',
      description: entry.description || '',
      resourceUrl: entry.resourceUrl || '',
      colorKey: matchedColor ? matchedColor[0] : 'indigo'
    })
    setEditingSchedule(entry)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteSchedule = async (entryId) => {
    if (!entryId) return
    const confirmed = confirm('Are you sure you want to delete this schedule entry?')
    if (!confirmed) {
      return
    }

    try {
      await adminAPI.deleteScheduleEntry(entryId)
      alert('✅ Schedule entry deleted successfully!')
      fetchScheduleEntries()
    } catch (error) {
      console.error('Failed to delete schedule entry:', error)
      setScheduleError(error.message)
      alert(`❌ Failed to delete schedule entry: ${error.message}`)
    }
  }

  const fetchAdminProfile = async () => {
    try {
      setLoadingProfile(true)
      const response = await adminAPI.getProfile()
      const profileData = {
        name: response.data?.name || 'Admin User',
        email: response.data?.email || '',
        organization: response.data?.organization || '',
        department: response.data?.department || '',
        phone: response.data?.phone || '',
        address: response.data?.address || '',
        bio: response.data?.bio || '',
        profileImage: response.data?.profileImage || ''
      }
      setAdminData(profileData)
    } catch (error) {
      console.error('Failed to fetch admin profile:', error)
      // Keep default values
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard()
      setStats(prevStats => ({
        ...prevStats,
        ...response.data
      }))
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true)
      const response = await adminAPI.getAssignments()
      setAssignments(response.data)
      setErrorAssignments(null)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      setErrorAssignments('Failed to load assignments')
    } finally {
      setLoadingAssignments(false)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true)
      const response = await adminAPI.getUsers({ userType: 'student' })
      // Handle both array response and paginated response structure
      const studentsData = response.data.users || response.data || []
      
      // Transform data to match StudentManager expectations if needed
      const formattedStudents = studentsData.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        courses: s.courses || ['B.Tech CSE'], // Fallback if courses not in data
        ...s
      }))
      
      setStudents(formattedStudents)
      setErrorStudents(null)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      setErrorStudents('Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append('title', uploadFormData.title)
      formData.append('type', 'assignment')
      formData.append('subject', uploadFormData.subject)
      formData.append('subjectCode', uploadFormData.subjectCode)
      formData.append('description', uploadFormData.description)
      formData.append('creditPoints', uploadFormData.creditPoints)
      formData.append('dueDate', uploadFormData.dueDate)
      formData.append('difficulty', uploadFormData.difficulty)
      
      if (uploadFormData.file) {
        formData.append('file', uploadFormData.file)
      }
      
      await adminAPI.createAssignmentWithFile(formData)
      fetchAssignments() // Refresh list
      fetchDashboardStats() // Refresh stats after creation
      
      alert('✅ Assignment uploaded successfully to cloud storage!')
      
      setShowUploadModal(false)
      setUploadFormData({
        title: '',
        type: 'assignment',
        subject: '',
        subjectCode: '',
        description: '',
        creditPoints: 0,
        dueDate: '',
        difficulty: 'Medium',
        file: null
      })
    } catch (error) {
      console.error('Failed to create assignment:', error)
      alert('Failed to create assignment. Please try again.')
    }
  }

  const handleDeleteAssignment = async (id) => {
    console.log('🗑️ Delete requested for assignment ID:', id);
    if (!id) {
      console.error('❌ No assignment ID provided');
      alert('Error: Cannot delete assignment - invalid ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this assignment? This will also delete any attached files.')) {
      try {
        console.log('📤 Sending delete request to API...');
        await adminAPI.deleteAssignment(id);
        console.log('✅ Assignment deleted successfully');
        await fetchAssignments();
        await fetchDashboardStats();
      } catch (error) {
        console.error('❌ Failed to delete assignment:', error);
        console.error('Error details:', error.response?.data || error.message);
        alert('Failed to delete assignment: ' + (error.response?.data?.error || error.message));
      }
    } else {
      console.log('🚫 Delete cancelled by user');
    }
  }

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminAPI.deleteStudent(id)
        setStudents(prev => prev.filter(s => s.id !== id))
        alert('Student deleted successfully')
      } catch (error) {
        console.error('Failed to delete student:', error)
        alert('Failed to delete student')
      }
    }
  }

  const handleUpdateAssignmentStatus = async (id, status) => {
    try {
      await adminAPI.updateAssignment(id, { status })
      fetchAssignments()
    } catch (error) {
      console.error('Failed to update assignment status:', error)
      alert('Failed to update status')
    }
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-red-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Date & Time Banner */}
        <div className={`mb-6 ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}>
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center space-x-4 mb-3 md:mb-0">
                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <p className="text-sm font-semibold opacity-90">📅 {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <p className="text-sm font-semibold opacity-90">🕐 {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl px-4 py-2 backdrop-blur-sm border border-white border-opacity-20">
                <p className="text-sm font-semibold">👨‍💼 Admin Dashboard</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">🌟</span>
                <div className="flex-1">
                  <p className="text-lg font-semibold mb-1">Leadership Inspiration</p>
                  <p className="text-white text-opacity-95 italic leading-relaxed">"{dailyQuote.text}"</p>
                  <p className="text-sm text-white text-opacity-75 mt-2">— {dailyQuote.author}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className={`mb-10 ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Admin Portal, <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{(adminData?.name && adminData.name.split(' ')[0]) || 'Admin'}</span> 👨‍💼
          </h1>
          <p className="text-lg text-gray-600">Manage assignments, projects, lab reports & students</p>
        </div>

        {/* Stats Dashboard */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="glass-effect p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs font-semibold">Students</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats.totalStudents}</p>
            <span className="text-2xl">👥</span>
          </div>
          
          <div className="glass-effect p-4 rounded-xl shadow-lg border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-all" onClick={() => setShowWebsiteLinksModal(true)}>
            <p className="text-gray-600 text-xs font-semibold">AI Subjective</p>
            <p className="text-sm font-bold text-green-600 mt-1">Manage Links</p>
            <p className="text-xs text-gray-500 mt-1">🔗 {websiteLinks.length} links</p>
            <span className="text-2xl">🌐</span>
          </div>
          
          <div className="glass-effect p-4 rounded-xl shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-600 text-xs font-semibold">Assignments</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats.total_assignments || 0}</p>
            <p className="text-xs text-gray-500 mt-1">✅ {stats.completed_assignments || 0} • ⏳ {stats.pending_assignments || 0}</p>
            <span className="text-2xl">📝</span>
          </div>
          
          <div className="glass-effect p-4 rounded-xl shadow-lg border-l-4 border-orange-500">
            <p className="text-gray-600 text-xs font-semibold">Pending</p>
            <p className="text-2xl font-extrabold text-orange-600 mt-1">{stats.pendingApprovals}</p>
            <span className="text-2xl">⏳</span>
          </div>
          
          <div className={`glass-effect p-4 rounded-xl shadow-lg border-l-4 ${
            stats.systemHealth >= 80 ? 'border-green-500' : 
            stats.systemHealth >= 50 ? 'border-yellow-500' : 
            'border-red-500'
          }`}>
            <p className="text-gray-600 text-xs font-semibold">System Health</p>
            <p className={`text-2xl font-extrabold mt-1 ${
              stats.systemHealth >= 80 ? 'text-green-600' : 
              stats.systemHealth >= 50 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>{stats.systemHealth}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.systemHealth === 100 ? 'Perfect!' : stats.systemHealth >= 80 ? 'Great' : stats.systemHealth >= 50 ? 'Good' : 'Low'}
            </p>
            <span className="text-2xl">
              {stats.systemHealth >= 80 ? '💚' : stats.systemHealth >= 50 ? '💛' : '❤️'}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className={`mb-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {['overview', 'assignments', 'students', 'schedule', 'ai-assistant'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'assignments' && '📝 Assignments'}
                  {tab === 'students' && '👥 Students'}
                  {tab === 'schedule' && '📅 Schedule'}
                  {tab === 'ai-assistant' && '🤖 AI Assistant'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="lg:grid lg:grid-cols-3 gap-8">
            {/* Admin Profile */}
            <div className={`col-span-1 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
              <div className="glass-effect p-8 rounded-2xl shadow-xl sticky top-24">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <span className="text-5xl text-white font-bold">{(adminData?.name && adminData.name.charAt(0)) || 'A'}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs">⚙️</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">Admin Profile</h3>
                  <button
                    onClick={() => {
                      setEditFormData({
                        name: adminData?.name || '',
                        organization: adminData?.organization || '',
                        department: adminData?.department || '',
                        phone: adminData?.phone || '',
                        address: adminData?.address || '',
                        bio: adminData?.bio || ''
                      })
                      setShowProfileEditor(true)
                    }}
                    className="mt-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-6 py-2 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="p-3 bg-white rounded-xl border-l-4 border-red-500">
                    <p className="text-xs text-gray-500 font-semibold">Full Name</p>
                    <p className="font-bold text-gray-800 break-words">{adminData?.name || '-'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border-l-4 border-orange-500">
                    <p className="text-xs text-gray-500 font-semibold">Email</p>
                    <p className="font-bold text-gray-800 break-all text-sm">{adminData?.email || '-'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border-l-4 border-purple-500">
                    <p className="text-xs text-gray-500 font-semibold">Organization</p>
                    <p className="font-bold text-gray-800 break-words">{adminData?.organization || '-'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 font-semibold">Department</p>
                    <p className="font-bold text-gray-800 break-words">{adminData?.department || '-'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 font-semibold">Contact</p>
                    <p className="font-bold text-gray-800">{adminData?.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-2 space-y-6 mt-8 lg:mt-0">
              <div className={`glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-orange-600 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">📤</span>
                    <h3 className="text-2xl font-bold text-gray-800">Upload Documents</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Upload assignments for students</p>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => {
                      setShowUploadModal(true)
                    }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    📝 Upload Assignment
                  </button>
                </div>
              </div>

              <div className={`glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-green-600 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📊</span>
                  <h3 className="text-2xl font-bold text-gray-800">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border-l-4 border-green-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.subject} • {item.creditPoints} points</p>
                        </div>
                        <span className="text-2xl">
                          {item.type === 'assignment' && '📝'}
                          {item.type === 'project' && '🚀'}
                          {item.type === 'lab' && '🧪'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-blue-600 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1200ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">🔗</span>
                    <h3 className="text-2xl font-bold text-gray-800">Website Links</h3>
                  </div>
                  <button
                    onClick={() => setShowWebsiteLinksModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    ➕ Add Link
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {websiteLinks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-4xl mb-2">🌐</p>
                      <p>No website links added yet</p>
                      <p className="text-sm mt-1">Click "Add Link" to create your first link</p>
                    </div>
                  ) : (
                    websiteLinks.map((link) => (
                      <div key={link.id} className="bg-white p-4 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-800">{link.title}</p>
                              <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {link.category}
                              </span>
                            </div>
                            {link.description && (
                              <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              <span>🌐</span>
                              <span className="break-all">{link.url}</span>
                            </a>
                          </div>
                          <button
                            onClick={() => handleDeleteWebsiteLink(link.id)}
                            className="ml-3 text-red-500 hover:text-red-700 text-xl font-bold"
                            title="Delete link"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <AssignmentManager 
            assignments={assignments}
            loading={loadingAssignments}
            error={errorAssignments}
            onDelete={handleDeleteAssignment}
            onUpdateStatus={handleUpdateAssignmentStatus}
          />
        )}

        {activeTab === 'schedule' && (
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">🗓️</span>
                    <h3 className="text-2xl font-bold text-gray-800">Schedule Planner</h3>
                  </div>
                  {editingSchedule && (
                    <button
                      type="button"
                      onClick={resetScheduleForm}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                {scheduleError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-lg text-sm text-red-600">
                    ⚠️ {scheduleError}
                  </div>
                )}

                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Title *</label>
                      <input
                        type="text"
                        value={scheduleFormData.title}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., Data Structures"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Code *</label>
                      <input
                        type="text"
                        value={scheduleFormData.subjectCode}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, subjectCode: e.target.value.toUpperCase() }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., CSE201"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Day *</label>
                      <select
                        value={scheduleFormData.dayOfWeek}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time *</label>
                      <input
                        type="time"
                        value={scheduleFormData.startTime}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">End Time *</label>
                      <input
                        type="time"
                        value={scheduleFormData.endTime}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Credits</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={scheduleFormData.credits}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, credits: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., 4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                      <input
                        type="text"
                        value={scheduleFormData.semester}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, semester: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., 4th"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Instructor</label>
                      <input
                        type="text"
                        value={scheduleFormData.instructor}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, instructor: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., Dr. Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={scheduleFormData.location}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="e.g., Lab 204"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        value={scheduleFormData.description}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        rows="3"
                        placeholder="Add extra context for students"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Resource URL</label>
                      <input
                        type="url"
                        value={scheduleFormData.resourceUrl}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, resourceUrl: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="https://"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Color Theme</label>
                      <select
                        value={scheduleFormData.colorKey}
                        onChange={(e) => setScheduleFormData(prev => ({ ...prev, colorKey: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      >
                        {Object.entries(scheduleColorThemes).map(([key, value]) => (
                          <option key={key} value={key}>{value.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all"
                  >
                    {editingSchedule ? '💾 Update Schedule Entry' : '➕ Create Schedule Entry'}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-purple-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    📈 Weekly Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs uppercase font-semibold text-purple-500">Total Slots</p>
                      <p className="text-2xl font-bold text-gray-900">{scheduleEntries.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs uppercase font-semibold text-purple-500">Total Credits</p>
                      <p className="text-2xl font-bold text-gray-900">{totalScheduledCredits}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs uppercase font-semibold text-purple-500">With Resources</p>
                      <p className="text-2xl font-bold text-gray-900">{scheduleEntries.filter(entry => entry.resourceUrl).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs uppercase font-semibold text-purple-500">Unique Faculty</p>
                      <p className="text-2xl font-bold text-gray-900">{new Set(scheduleEntries.filter(entry => entry.instructor).map(entry => entry.instructor)).size}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      📅 Weekly Schedule
                    </h3>
                    <button
                      type="button"
                      onClick={fetchScheduleEntries}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingSchedule ? (
                    <div className="text-center py-10 text-gray-500">Loading schedule...</div>
                  ) : scheduleEntries.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <p className="text-4xl mb-2">📝</p>
                      <p>No schedule entries yet</p>
                      <p className="text-sm mt-1">Create your first entry using the form</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
                      {scheduleEntries.map((entry) => (
                        <div key={entry.id} className={`bg-white p-5 rounded-2xl border-l-4 ${entry.borderColor} shadow-sm hover:shadow-md transition-all`}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`${entry.bgColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{entry.subjectCode}</span>
                                <p className="text-sm font-semibold text-indigo-600">{entry.dayOfWeek}</p>
                                <p className="text-xs text-gray-500">{entry.startTime} - {entry.endTime}</p>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">{entry.title}</h4>
                              {entry.description && (
                                <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                              )}
                              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                                {entry.instructor && <span className="bg-gray-100 px-2.5 py-1 rounded-full">👩‍🏫 {entry.instructor}</span>}
                                {entry.location && <span className="bg-gray-100 px-2.5 py-1 rounded-full">📍 {entry.location}</span>}
                                {entry.credits ? <span className="bg-gray-100 px-2.5 py-1 rounded-full">🎓 {entry.credits} credits</span> : null}
                                {entry.semester && <span className="bg-gray-100 px-2.5 py-1 rounded-full">📘 {entry.semester}</span>}
                                {entry.resourceUrl && (
                                  <a
                                    href={entry.resourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                  >
                                    🔗 Resources
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleEditSchedule(entry)}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSchedule(entry.id)}
                                className="text-sm font-semibold text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <StudentManager 
            students={students}
            loading={loadingStudents}
            error={errorStudents}
            onDelete={handleDeleteStudent}
          />
        )}

        {/* AI Assistant Tab */}
        {activeTab === 'ai-assistant' && (
          <div className="animate-fadeInUp">
            <AIAssistant />
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">
                    📤 Upload Assignment
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="text-white hover:text-gray-200 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      placeholder="e.g., Data Structures Assignment 3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      value={uploadFormData.subject}
                      onChange={(e) => setUploadFormData({...uploadFormData, subject: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      placeholder="e.g., Data Structures & Algorithms"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Code *</label>
                    <input
                      type="text"
                      value={uploadFormData.subjectCode}
                      onChange={(e) => setUploadFormData({...uploadFormData, subjectCode: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      placeholder="e.g., CSE201"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={uploadFormData.description}
                      onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      rows="3"
                      placeholder="Describe the task..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Points *</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={uploadFormData.creditPoints}
                      onChange={(e) => setUploadFormData({...uploadFormData, creditPoints: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      placeholder="10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      value={uploadFormData.dueDate}
                      onChange={(e) => setUploadFormData({...uploadFormData, dueDate: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty *</label>
                    <select
                      value={uploadFormData.difficulty}
                      onChange={(e) => setUploadFormData({...uploadFormData, difficulty: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document File *</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.zip"
                      onChange={(e) => setUploadFormData({...uploadFormData, file: e.target.files[0]})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT, ZIP only (Max 10MB)</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    ✅ Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Profile Editor Modal */}
        {showProfileEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
                <h2 className="text-3xl font-bold">✏️ Edit Admin Profile</h2>
                <p className="text-red-100 mt-2">Update your administrative information</p>
              </div>
              
              <form className="p-6" onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const updateData = {
                    name: editFormData.name?.trim(),
                    organization: editFormData.organization?.trim(),
                    department: editFormData.department?.trim(),
                    phone: editFormData.phone?.trim(),
                    address: editFormData.address?.trim(),
                    bio: editFormData.bio?.trim()
                  }
                  
                  // Remove empty fields
                  Object.keys(updateData).forEach(key => {
                    if (!updateData[key] || updateData[key] === '') {
                      delete updateData[key]
                    }
                  })
                  
                  console.log('📤 Updating admin profile:', updateData)
                  
                  const response = await adminAPI.updateProfile(updateData)
                  console.log('✅ Admin profile updated:', response.data)
                  
                  // Update local state
                  const updatedProfile = {
                    name: response.data?.name || adminData?.name || '',
                    email: response.data?.email || adminData?.email || '',
                    organization: response.data?.organization || adminData?.organization || '',
                    department: response.data?.department || adminData?.department || '',
                    phone: response.data?.phone || adminData?.phone || '',
                    address: response.data?.address || adminData?.address || '',
                    bio: response.data?.bio || adminData?.bio || '',
                    profileImage: response.data?.profileImage || adminData?.profileImage || ''
                  }
                  
                  setAdminData(updatedProfile)
                  
                  alert('✅ Admin profile updated successfully!')
                  setShowProfileEditor(false)
                } catch (error) {
                  console.error('Failed to update admin profile:', error)
                  alert('❌ Failed to update profile: ' + error.message)
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>👤</span>
                      <span>Personal Information</span>
                    </h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={editFormData.name || adminData?.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={adminData?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  {/* Professional Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 mt-4 flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Professional Information</span>
                    </h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      value={editFormData.organization || adminData?.organization || ''}
                      onChange={(e) => setEditFormData({...editFormData, organization: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="e.g., Kramik Platform Management"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={editFormData.department || adminData?.department || ''}
                      onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  
                  {/* Contact Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 mt-4 flex items-center space-x-2">
                      <span>📞</span>
                      <span>Contact Information</span>
                    </h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phone || adminData?.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address || adminData?.address || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="City, State, Country"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / About</label>
                    <textarea
                      value={editFormData.bio || adminData?.bio || ''}
                      onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-all"
                      placeholder="Tell us about yourself and your role..."
                      rows="4"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowProfileEditor(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    💾 Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Website Links Management Modal */}
        {showWebsiteLinksModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-t-2xl">
                <h2 className="text-3xl font-bold">🌐 AI Subjective Website Links</h2>
                <p className="text-green-100 mt-2">Manage website links for students</p>
              </div>
              
              <div className="p-6">
                {/* Add New Link Form */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl mb-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Website Link</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website Title *</label>
                      <input
                        type="text"
                        value={newWebsiteLink.title}
                        onChange={(e) => setNewWebsiteLink({...newWebsiteLink, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                        placeholder="e.g., AI Study Assistant"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL *</label>
                      <input
                        type="url"
                        value={newWebsiteLink.url}
                        onChange={(e) => setNewWebsiteLink({...newWebsiteLink, url: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select
                        value={newWebsiteLink.category}
                        onChange={(e) => setNewWebsiteLink({...newWebsiteLink, category: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                      >
                        <option>AI Tools</option>
                        <option>Learning Resources</option>
                        <option>Study Materials</option>
                        <option>Practice Tests</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={newWebsiteLink.description}
                        onChange={(e) => setNewWebsiteLink({...newWebsiteLink, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                        placeholder="Brief description"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddWebsiteLink}
                    className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    ➕ Add Link
                  </button>
                </div>
                
                {/* Existing Links List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 Existing Links ({websiteLinks.length})</h3>
                  {websiteLinks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-4xl mb-2">💭</p>
                      <p>No website links added yet. Add your first link above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {websiteLinks.map((link) => (
                        <div key={link.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-lg font-bold text-gray-800">{link.title}</h4>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                  {link.category}
                                </span>
                              </div>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 break-all">
                                🔗 {link.url}
                              </a>
                              {link.description && (
                                <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                Added: {new Date(link.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteWebsiteLink(link.id)}
                              className="ml-4 text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Close Button */}
                <div className="flex justify-end mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowWebsiteLinksModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                  >
                    ✔️ Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin