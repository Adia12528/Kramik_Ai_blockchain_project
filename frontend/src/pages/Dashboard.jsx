import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAttendanceStats, getMonthCalendarData, calculateAttendancePercentage, hasLoggedInToday, getAttendanceStreak } from '../utils/attendanceUtils'
import { studentAPI } from '../services/api'
import AIBotTab from '../components/dashboard/AIBotTab'
import blockchainService from '../services/blockchain'
import { useBlockchain } from '../contexts/BlockchainContext'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  console.log('🎯 Dashboard component rendering...')
  
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isConnected, currentAccount } = useBlockchain()
  const [blockchainStats, setBlockchainStats] = useState(null)
  
  // Redirect admins to admin panel
  useEffect(() => {
    if (user && user.userType === 'admin') {
      console.log('⚠️ Admin user detected, redirecting to admin panel...')
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])
  
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [attendanceStats, setAttendanceStats] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [completedAssignments, setCompletedAssignments] = useState([])
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [dashboardError, setDashboardError] = useState(null)
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    enrollmentId: '',
    course: '',
    college: '',
    semester: '',
    year: '',
    gpa: '',
    creditsCompleted: 0,
    totalCredits: 160,
    skills: [],
    selectedSubjects: [],
    joinedDate: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: '',
    socialLinks: { linkedin: '', github: '', twitter: '' },
    profileCompleted: false
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileSuggestions, setProfileSuggestions] = useState({
    suggestedCollege: '',
    suggestedEnrollmentId: ''
  })

  const [subjects, setSubjects] = useState([])
  const [scheduleEntries, setScheduleEntries] = useState([])
  const [achievements, setAchievements] = useState([])
  const [websiteLinks, setWebsiteLinks] = useState([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [dailyQuote, setDailyQuote] = useState({ text: '', author: '' })
  
  // AI Quiz System States
  const [quizSubject, setQuizSubject] = useState(null)
  const [quizLevel, setQuizLevel] = useState('Beginner') // Beginner, Intermediate, Advanced, Expert
  const [quizPoints, setQuizPoints] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizHistory, setQuizHistory] = useState([])
  const [quizAchievements, setQuizAchievements] = useState([])
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  
  // AI Bot States
  const [botQuestion, setBotQuestion] = useState('')
  const [botAnswer, setBotAnswer] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [botHistory, setBotHistory] = useState([])
  
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  const [recentActivity, setRecentActivity] = useState([])
  const [completingSchedule, setCompletingSchedule] = useState(null)
  const [quizRefreshTrigger, setQuizRefreshTrigger] = useState(0)

  // Generate daily motivational quote
  const generateDailyQuote = () => {
    const today = new Date().toDateString()
    const savedQuote = localStorage.getItem('kramik_daily_quote')
    const savedDate = localStorage.getItem('kramik_quote_date')
    
    // If quote exists for today, return it
    if (savedQuote && savedDate === today) {
      return JSON.parse(savedQuote)
    }
    
    // AI-powered motivational quotes for students
    const quotes = [
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "The expert in anything was once a beginner. Keep learning, keep growing.", author: "Helen Hayes" },
      { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
      { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
      { text: "Your limitation—it's only your imagination. Push beyond your boundaries.", author: "Anonymous" },
      { text: "Great things never come from comfort zones. Embrace the challenge.", author: "Anonymous" },
      { text: "Dream it. Wish it. Do it. Your future depends on what you do today.", author: "Mahatma Gandhi" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
      { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
      { text: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
      { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
      { text: "Little things make big days. Small efforts compound into extraordinary results.", author: "Anonymous" },
      { text: "It's going to be hard, but hard does not mean impossible.", author: "Anonymous" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The key to success is to focus on goals, not obstacles.", author: "Anonymous" },
      { text: "Believe you can and you're halfway there. Your mindset shapes your reality.", author: "Theodore Roosevelt" },
      { text: "Study while others are sleeping; work while others are loafing; prepare while others are playing.", author: "William Arthur Ward" },
      { text: "Your education is a dress rehearsal for a life that is yours to lead.", author: "Nora Ephron" },
      { text: "Intelligence plus character—that is the goal of true education.", author: "Martin Luther King Jr." },
      { text: "The only way to learn mathematics is to do mathematics. Practice makes progress.", author: "Paul Halmos" },
      { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
      { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Strive for progress, not perfection. Every step forward counts.", author: "Anonymous" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" }
    ]
    
    // Generate deterministic index based on date (same quote for same day)
    const dateHash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = dateHash % quotes.length
    const quote = quotes[index]
    
    // Save to localStorage
    localStorage.setItem('kramik_daily_quote', JSON.stringify(quote))
    localStorage.setItem('kramik_quote_date', today)
    
    return quote
  }

  useEffect(() => {
    console.log('🚀 Dashboard useEffect triggered')
    setIsVisible(true)
    
    // Set initial quote
    setDailyQuote(generateDailyQuote())
    
    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        console.log('📡 Fetching profile...')
        setLoadingProfile(true)
        const response = await studentAPI.getProfile()
        console.log('✅ Profile data received:', response.data)
        
        // Merge response data with default structure to prevent undefined fields
        const profileData = {
          name: response.data?.name || 'Student',
          email: response.data?.email || '',
          enrollmentId: response.data?.enrollmentId || '',
          course: response.data?.course || '',
          college: response.data?.college || '',
          semester: response.data?.semester || '',
          year: response.data?.year || '',
          gpa: response.data?.gpa || '',
          creditsCompleted: response.data?.creditsCompleted || 0,
          totalCredits: response.data?.totalCredits || 160,
          skills: response.data?.skills || [],
          selectedSubjects: response.data?.selectedSubjects || [],
          joinedDate: response.data?.joinedDate || '',
          phone: response.data?.phone || '',
          address: response.data?.address || '',
          bio: response.data?.bio || '',
          profileImage: response.data?.profileImage || '',
          socialLinks: response.data?.socialLinks || { linkedin: '', github: '', twitter: '' },
          profileCompleted: response.data?.profileCompleted || false
        }
        
        setStudentData(profileData)
        
        // Store suggestions if profile is incomplete
        if (!profileData.profileCompleted) {
          setProfileSuggestions({
            suggestedCollege: response.data?.suggestedCollege || '',
            suggestedEnrollmentId: response.data?.suggestedEnrollmentId || ''
          })
          setShowProfileEditor(true) // Auto-show profile editor for incomplete profiles
        }
      } catch (error) {
        console.error('❌ Failed to fetch profile:', error)
        setDashboardError('Failed to load profile: ' + error.message)
        // Keep default state - studentData is already initialized with safe defaults
      } finally {
        setLoadingProfile(false)
      }
    }
    
    fetchProfile()
    loadBlockchainStats()
    
    // Load website links from localStorage
    const savedLinks = localStorage.getItem('kramik_website_links')
    if (savedLinks) {
      setWebsiteLinks(JSON.parse(savedLinks))
    }
    
    // Load attendance data
    const stats = getAttendanceStats()
    setAttendanceStats(stats)
    console.log('📊 Attendance Stats Loaded:', stats)
    
    // Fetch assignments from API
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true)
        const response = await studentAPI.getAssignments()
        console.log('📥 Assignments received:', response.data)
        console.log('📎 File URLs in assignments:', response.data.map(a => ({ 
          title: a.title, 
          hasFileUrl: !!a.fileUrl, 
          fileUrl: a.fileUrl,
          fileName: a.fileName 
        })))
        const fetchedAssignments = response.data
        setAssignments(fetchedAssignments)
        
        // Generate upcoming deadlines from pending assignments
        const pending = fetchedAssignments
          .filter(a => a.completion_status !== 'completed')
          .map(a => {
            const dueDate = new Date(a.dueDate || a.due_date)
            const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
            return {
              subject: a.subject,
              task: a.title,
              due: daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`,
              priority: daysLeft < 0 ? 'high' : daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low',
              daysLeft
            }
          })
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 5)
        setUpcomingDeadlines(pending)
        
        // Generate recent activity from completed assignments
        const completed = fetchedAssignments
          .filter(a => a.completion_status === 'completed' && a.completed_at)
          .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
          .slice(0, 5)
          .map(a => {
            const completedDate = new Date(a.completed_at)
            const now = new Date()
            const diffMs = now - completedDate
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)
            
            let timeAgo
            if (diffMins < 60) timeAgo = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
            else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
            else timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
            
            return {
              action: 'Completed',
              item: a.title,
              time: timeAgo,
              icon: a.type === 'project' ? '🚀' : a.type === 'lab' ? '🧪' : '✅',
              points: a.creditPoints
            }
          })
        
        setRecentActivity(completed)
        
        // Calculate achievements based on actual data
        const totalCompleted = fetchedAssignments.filter(a => a.completion_status === 'completed').length
        const totalPoints = fetchedAssignments
          .filter(a => a.completion_status === 'completed')
          .reduce((sum, a) => sum + (a.earnedPoints || a.creditPoints || 0), 0)
        
        // Update earned points state
        setEarnedPoints(totalPoints)
        
        const projectsCompleted = fetchedAssignments.filter(a => 
          a.type === 'project' && a.completion_status === 'completed'
        ).length
        
        const labsCompleted = fetchedAssignments.filter(a => 
          a.type === 'lab' && a.completion_status === 'completed'
        ).length
        
        const newAchievements = []
        
        if (totalCompleted >= 10) {
          newAchievements.push({ 
            icon: '🏆', 
            title: 'Assignment Master', 
            description: `Completed ${totalCompleted} assignments`, 
            color: 'yellow' 
          })
        }
        
        if (totalPoints >= 50) {
          newAchievements.push({ 
            icon: '⭐', 
            title: 'Point Collector', 
            description: `Earned ${totalPoints} credit points`, 
            color: 'purple' 
          })
        }
        
        if (projectsCompleted >= 3) {
          newAchievements.push({ 
            icon: '🚀', 
            title: 'Project Pro', 
            description: `Completed ${projectsCompleted} projects`, 
            color: 'blue' 
          })
        }
        
        if (labsCompleted >= 5) {
          newAchievements.push({ 
            icon: '🧪', 
            title: 'Lab Expert', 
            description: `Finished ${labsCompleted} lab assignments`, 
            color: 'green' 
          })
        }
        
        if (stats.attendancePercentage >= 90) {
          newAchievements.push({ 
            icon: '📅', 
            title: 'Perfect Attendance', 
            description: `${stats.attendancePercentage.toFixed(0)}% attendance rate`, 
            color: 'green' 
          })
        }
        
        // Default achievements if none earned yet
        if (newAchievements.length === 0) {
          newAchievements.push(
            { icon: '🎯', title: 'Getting Started', description: 'Complete your first assignment', color: 'blue' },
            { icon: '💪', title: 'Stay Focused', description: 'Keep working on your goals', color: 'purple' }
          )
        }
        
        setAchievements(newAchievements)
      } catch (error) {
        console.error('Failed to fetch assignments:', error)
        // Fallback to localStorage if API fails (for demo purposes if DB is down)
        const savedAssignments = localStorage.getItem('student_assignments')
        if (savedAssignments) {
          setAssignments(JSON.parse(savedAssignments))
        }
      } finally {
        setLoadingAssignments(false)
      }
    }
    
    fetchAssignments()
    
    // Load completed assignments
    const completed = localStorage.getItem('completed_assignments')
    if (completed) {
      const completedList = JSON.parse(completed)
      setCompletedAssignments(completedList)
      
      // Calculate earned points - will be recalculated when assignments are loaded
      const points = completedList.reduce((total, id) => {
        const assignment = assignments.find(a => a.id === id)
        return total + (assignment ? (assignment.earnedPoints || assignment.creditPoints) : 0)
      }, 0)
      setEarnedPoints(points)
    }
    
    // Refresh attendance stats periodically
    const intervalId = setInterval(() => {
      const freshStats = getAttendanceStats()
      setAttendanceStats(freshStats)
    }, 60000) // Update every minute
    
    return () => {
      clearInterval(intervalId)
      clearInterval(clockInterval)
    }
  }, [])

  useEffect(() => {
    const fetchScheduleEntries = async () => {
      try {
        const response = await studentAPI.getSchedule()
        setScheduleEntries(response.data || [])
      } catch (error) {
        console.error('❌ Failed to fetch schedule:', error)
      }
    }

    fetchScheduleEntries()
  }, [])

  // Load bot history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('kramik_bot_history')
    if (savedHistory) {
      try {
        setBotHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to load bot history:', error)
      }
    }
  }, [])

  // Update subjects when selectedSubjects changes
  useEffect(() => {
    if (scheduleEntries.length > 0) {
      return
    }

    if (studentData.selectedSubjects) {
      // Create subjects array based on selectedSubjects
      const selectedSubjectsData = studentData.selectedSubjects.length > 0
        ? allQuizSubjects.filter(subject => studentData.selectedSubjects.includes(subject.code))
        : allQuizSubjects.slice(0, 6) // Default to first 6 if no selection
      
      // Map to the format expected by My Courses section
      const grades = ['A+', 'A', 'A-', 'B+', 'B']
      const nextClasses = ['Mon, 9:00 AM', 'Tue, 11:00 AM', 'Wed, 2:00 PM', 'Thu, 10:00 AM', 'Fri, 9:00 AM', 'Fri, 2:00 PM']
      
      const mappedSubjects = selectedSubjectsData.map((subject, index) => ({
        name: subject.name,
        code: subject.code,
        bgColor: subject.color,
        borderColor: subject.borderColor,
        progress: Math.floor(Math.random() * 30) + 70, // Random progress 70-100
        grade: grades[Math.floor(Math.random() * grades.length)],
        credits: subject.credits,
        link: subject.link,
        description: subject.description,
        nextClass: nextClasses[index % nextClasses.length]
      }))
      
      setSubjects(mappedSubjects)
    }
        }, [studentData.selectedSubjects, scheduleEntries.length])

  // Calculate total credits from completed subjects (progress >= 100%)
  const calculateCompletedCredits = () => {
    return subjects.reduce((total, subject) => {
      if (subject.progress >= 100) {
        return total + subject.credits
      }
      return total
    }, 0)
  }

  // Calculate total credits from all subjects
  const calculateTotalCredits = () => {
    return subjects.reduce((total, subject) => total + subject.credits, 0)
  }

  useEffect(() => {
    if (scheduleEntries.length === 0) {
      return
    }

    const grades = ['A+', 'A', 'A-', 'B+', 'B']

    const mappedSubjects = scheduleEntries.map((entry, index) => {
      const googleFallback = `https://www.google.com/search?q=${encodeURIComponent(`${entry.subjectCode || ''} ${entry.title || ''}`.trim())}`
      const scheduleWindow = [entry.startTime, entry.endTime].filter(Boolean).join(' - ')

      // Calculate quiz-based progress for this subject
      const subjectCode = entry.subjectCode
      const quizData = localStorage.getItem(`kramik_quiz_${subjectCode}`)
      let quizProgress = 0
      let quizGrade = grades[grades.length - 1]
      
      if (quizData) {
        try {
          const parsed = JSON.parse(quizData)
          const questionsAnswered = parsed.history?.length || 0
          const correctAnswers = parsed.history?.filter(h => h.correct).length || 0
          
          // Progress based on questions answered (cap at 100%)
          // Each question contributes ~5% (20 questions = 100%)
          quizProgress = Math.min(100, questionsAnswered * 5)
          
          // Grade based on accuracy
          if (questionsAnswered > 0) {
            const accuracy = (correctAnswers / questionsAnswered) * 100
            if (accuracy >= 90) quizGrade = grades[0] // A+
            else if (accuracy >= 80) quizGrade = grades[1] // A
            else if (accuracy >= 70) quizGrade = grades[2] // A-
            else if (accuracy >= 60) quizGrade = grades[3] // B+
            else quizGrade = grades[4] // B
          }
        } catch (e) {
          console.error('Error parsing quiz data:', e)
        }
      }

      return {
        id: entry.id,
        scheduleId: entry.id,
        name: entry.title,
        code: entry.subjectCode,
        bgColor: entry.bgColor || 'bg-indigo-500',
        borderColor: entry.borderColor || 'border-indigo-500',
        progress: quizProgress,
        grade: quizGrade,
        credits: entry.credits || 0,
        link: entry.resourceUrl || googleFallback,
        resourceUrl: entry.resourceUrl,
        description: entry.description || `${entry.dayOfWeek || 'Schedule'} • ${scheduleWindow}`.trim(),
        nextClass: `${entry.dayOfWeek || 'TBD'}, ${scheduleWindow || 'Time TBA'}`.trim(),
        location: entry.location || '',
        instructor: entry.instructor || '',
        semester: entry.semester || '',
        dayOfWeek: entry.dayOfWeek || '',
        startTime: entry.startTime || '',
        endTime: entry.endTime || '',
        completionStatus: entry.completionStatus || 'pending',
        completedAt: entry.completedAt,
      }
    })

    setSubjects(mappedSubjects)
    
    const totalCredits = mappedSubjects.reduce((sum, subject) => sum + (subject.credits || 0), 0)
    const completedCredits = mappedSubjects
      .filter(subject => subject.completionStatus === 'completed')
      .reduce((sum, subject) => sum + (subject.credits || 0), 0)
    
    setStudentData(prev => ({
      ...prev,
      totalCredits,
      creditsCompleted: completedCredits
    }))
  }, [scheduleEntries, quizRefreshTrigger])

  const handleScheduleComplete = async (scheduleId, credits = 0, alreadyCompleted = false) => {
    if (!scheduleId || alreadyCompleted) {
      return
    }

    setCompletingSchedule(scheduleId)
    try {
      const response = await studentAPI.markScheduleComplete(scheduleId)
      const completedAt = response.data?.schedule?.completedAt || new Date().toISOString()

      setScheduleEntries(prev => prev.map(entry => entry.id === scheduleId
        ? { ...entry, completionStatus: 'completed', completedAt }
        : entry
      ))

      alert(`✅ Credits claimed! You earned ${credits} credit${credits === 1 ? '' : 's'}.`)
      
      // Record schedule completion on blockchain if wallet connected
      if (isConnected) {
        try {
          const scheduleEntry = scheduleEntries.find(e => e.id === scheduleId)
          const scheduleData = {
            scheduleId,
            creditsEarned: credits,
            scheduleTitle: scheduleEntry?.title || 'Schedule Entry'
          }
          
          const result = await blockchainService.recordScheduleCompletionOnBlockchain(scheduleData)
          console.log('✅ Schedule completion recorded on blockchain:', result)
          
          // Show blockchain verification
          alert(`🔗 Blockchain Verified!\n\nYour completion has been permanently recorded on the blockchain.\nTransaction: ${result.transactionHash.slice(0, 10)}...`)
          
          // Refresh blockchain stats
          loadBlockchainStats()
        } catch (error) {
          console.error('❌ Blockchain recording failed:', error)
          // Don't interrupt user experience
        }
      }
    } catch (error) {
      console.error('❌ Failed to mark schedule entry complete:', error)
      alert(`❌ Failed to mark schedule entry complete: ${error.message}`)
    } finally {
      setCompletingSchedule(null)
    }
  }

  // AI Analysis function
  const analyzeWithAI = async (assignment) => {
    setIsAnalyzing(true)
    setAiAnalysis('')
    
    // Simulate AI analysis (in production, this would call an actual AI API)
    setTimeout(() => {
      const analysis = `
🤖 AI Analysis of "${assignment.title}"

📚 **Subject**: ${assignment.subject} (${assignment.subjectCode})

🎯 **Task Overview**:
${assignment.description}

💡 **Key Concepts to Focus On**:
${generateKeyConcepts(assignment)}

📖 **Recommended Approach**:
${generateRecommendedApproach(assignment)}

⚠️ **Common Mistakes to Avoid**:
${generateCommonMistakes(assignment)}

🔗 **Helpful Resources**:
${generateResources(assignment)}

⏱️ **Estimated Time**: ${assignment.difficulty === 'Easy' ? '2-4 hours' : assignment.difficulty === 'Medium' ? '4-8 hours' : '8-15 hours'}

✅ **Tips for Success**:
- Break down the problem into smaller parts
- Test your solution thoroughly
- Document your code/work clearly
- Review similar examples before starting
- Ask questions if you're stuck

🏆 **Reward**: ${assignment.creditPoints} credit points upon completion
      `
      
      setAiAnalysis(analysis)
      setIsAnalyzing(false)
      console.log('🤖 AI Analysis completed for:', assignment.title)
    }, 2000)
  }

  const generateKeyConcepts = (assignment) => {
    const concepts = {
      'Data Structures': '- Trees (AVL, Red-Black)\n- Balancing algorithms\n- Rotations and rebalancing\n- Time complexity analysis',
      'Database': '- Entity-Relationship modeling\n- Normalization (1NF, 2NF, 3NF)\n- SQL queries and joins\n- Transaction management',
      'Operating': '- CPU scheduling algorithms\n- Process states and transitions\n- Context switching\n- Performance metrics (turnaround time, waiting time)'
    }
    
    for (let key in concepts) {
      if (assignment.title.includes(key) || assignment.subject.includes(key)) {
        return concepts[key]
      }
    }
    return '- Problem analysis\n- Solution design\n- Implementation\n- Testing and validation'
  }

  const generateRecommendedApproach = (assignment) => {
    if (assignment.type === 'assignment') {
      return '1. Read the problem carefully\n2. Design your solution on paper first\n3. Implement incrementally\n4. Test with different test cases\n5. Optimize if needed'
    } else if (assignment.type === 'project') {
      return '1. Plan the project architecture\n2. Break into modules/components\n3. Implement core functionality first\n4. Add features incrementally\n5. Document as you go\n6. Final testing and polish'
    } else {
      return '1. Perform the lab experiment\n2. Note down observations\n3. Analyze results\n4. Write clear explanations\n5. Include screenshots/diagrams\n6. State conclusions'
    }
  }

  const generateCommonMistakes = (assignment) => {
    const mistakes = {
      'Easy': '- Skipping edge cases\n- Not testing thoroughly\n- Poor documentation',
      'Medium': '- Overcomplicating the solution\n- Not handling errors\n- Ignoring time/space complexity',
      'Hard': '- Starting without planning\n- Not breaking into subtasks\n- Insufficient testing\n- Missing optimization opportunities'
    }
    return mistakes[assignment.difficulty] || '- Rushing through the task\n- Not following instructions'
  }

  const generateResources = (assignment) => {
    if (assignment.subject.includes('Data Structures')) {
      return '- VisualGo.net for algorithm visualization\n- GeeksforGeeks tutorials\n- MIT OpenCourseWare lectures'
    } else if (assignment.subject.includes('Database')) {
      return '- W3Schools SQL tutorial\n- SQLite documentation\n- Database design case studies'
    } else if (assignment.subject.includes('Operating')) {
      return '- OS: Three Easy Pieces (free book)\n- Tutorials Point OS guide\n- YouTube OS concept videos'
    }
    return '- Course textbook\n- Official documentation\n- Online tutorials and forums'
  }

  // AI Quiz System Functions
  const allQuizSubjects = [
    // 1st Semester
    { name: 'Engineering Mathematics I', code: 'MATH1', icon: '∑', color: 'bg-blue-500', borderColor: 'border-blue-500', semester: '1st', link: 'https://www.khanacademy.org/math/calculus-1', description: 'Calculus and Linear Algebra', credits: 4 },
    { name: 'Engineering Physics', code: 'PHY1', icon: '⚛️', color: 'bg-purple-500', borderColor: 'border-purple-500', semester: '1st', link: 'https://www.physicsclassroom.com/', description: 'Mechanics and Thermodynamics', credits: 4 },
    { name: 'Engineering Chemistry', code: 'CHEM1', icon: '🧪', color: 'bg-green-500', borderColor: 'border-green-500', semester: '1st', link: 'https://www.khanacademy.org/science/chemistry', description: 'Basic Chemistry concepts', credits: 3 },
    { name: 'Basic Electrical Engineering', code: 'BEE', icon: '⚡', color: 'bg-yellow-500', borderColor: 'border-yellow-500', semester: '1st', link: 'https://www.allaboutcircuits.com/', description: 'Circuit analysis and basics', credits: 3 },
    { name: 'Engineering Graphics', code: 'EG', icon: '📊', color: 'bg-pink-500', borderColor: 'border-pink-500', semester: '1st', link: 'https://www.autodesk.com/education', description: 'Technical drawing and CAD', credits: 2 },
    
    // 2nd Semester
    { name: 'Engineering Mathematics II', code: 'MATH2', icon: '∫', color: 'bg-indigo-500', borderColor: 'border-indigo-500', semester: '2nd', link: 'https://www.khanacademy.org/math/multivariable-calculus', description: 'Advanced Calculus', credits: 4 },
    { name: 'Basic Electronics Engineering', code: 'BEC', icon: '🔌', color: 'bg-red-500', borderColor: 'border-red-500', semester: '2nd', link: 'https://www.electronics-tutorials.ws/', description: 'Electronic devices and circuits', credits: 3 },
    { name: 'Engineering Mechanics', code: 'EM', icon: '⚙️', color: 'bg-orange-500', borderColor: 'border-orange-500', semester: '2nd', link: 'https://www.engineeringtoolbox.com/', description: 'Statics and Dynamics', credits: 3 },
    { name: 'Programming for Problem Solving', code: 'PPS', icon: '💻', color: 'bg-teal-500', borderColor: 'border-teal-500', semester: '2nd', link: 'https://www.programiz.com/c-programming', description: 'C Programming fundamentals', credits: 4 },
    { name: 'Communication Skills', code: 'CS', icon: '💬', color: 'bg-cyan-500', borderColor: 'border-cyan-500', semester: '2nd', link: 'https://www.coursera.org/learn/communication-skills', description: 'Professional communication', credits: 2 },
    
    // 3rd Semester
    { name: 'Data Structures & Algorithms', code: 'DSA', icon: '🌳', color: 'bg-blue-600', borderColor: 'border-blue-600', semester: '3rd', link: 'https://visualgo.net/en', description: 'Interactive DSA visualizations', credits: 4 },
    { name: 'Object Oriented Programming', code: 'OOP', icon: '🎯', color: 'bg-purple-600', borderColor: 'border-purple-600', semester: '3rd', link: 'https://www.javatpoint.com/java-oops-concepts', description: 'Java OOP concepts', credits: 4 },
    { name: 'Digital Logic Design', code: 'DLD', icon: '🔢', color: 'bg-green-600', borderColor: 'border-green-600', semester: '3rd', link: 'https://www.tutorialspoint.com/digital_circuits/index.htm', description: 'Logic gates and circuits', credits: 3 },
    { name: 'Discrete Mathematics', code: 'DM', icon: '🔢', color: 'bg-yellow-600', borderColor: 'border-yellow-600', semester: '3rd', link: 'https://www.khanacademy.org/computing/computer-science/cryptography', description: 'Set theory and graph theory', credits: 3 },
    { name: 'Computer Organization', code: 'CO', icon: '🖥️', color: 'bg-pink-600', borderColor: 'border-pink-600', semester: '3rd', link: 'https://www.nand2tetris.org/', description: 'Build a computer from logic gates', credits: 3 },
    
    // 4th Semester
    { name: 'Database Management Systems', code: 'DBMS', icon: '🗄️', color: 'bg-green-500', borderColor: 'border-green-500', semester: '4th', link: 'https://www.sqlitetutorial.net/', description: 'SQL and database design', credits: 4 },
    { name: 'Operating Systems', code: 'OS', icon: '💻', color: 'bg-purple-500', borderColor: 'border-purple-500', semester: '4th', link: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', description: 'OS concepts and design', credits: 4 },
    { name: 'Computer Networks', code: 'CN', icon: '🌐', color: 'bg-orange-500', borderColor: 'border-orange-500', semester: '4th', link: 'https://www.computernetworkingnotes.com/', description: 'Network protocols and TCP/IP', credits: 3 },
    { name: 'Theory of Computation', code: 'TOC', icon: '🧠', color: 'bg-red-600', borderColor: 'border-red-600', semester: '4th', link: 'https://www.tutorialspoint.com/automata_theory/index.htm', description: 'Automata and complexity', credits: 3 },
    { name: 'Microprocessors', code: 'MP', icon: '🔬', color: 'bg-indigo-600', borderColor: 'border-indigo-600', semester: '4th', link: 'https://www.8085projects.info/', description: '8085 and 8086 architecture', credits: 3 },
    
    // 5th Semester
    { name: 'Software Engineering', code: 'SE', icon: '⚙️', color: 'bg-pink-500', borderColor: 'border-pink-500', semester: '5th', link: 'https://www.geeksforgeeks.org/software-engineering/', description: 'SDLC and project management', credits: 3 },
    { name: 'Computer Graphics', code: 'CG', icon: '🎨', color: 'bg-yellow-500', borderColor: 'border-yellow-500', semester: '5th', link: 'https://www.tutorialspoint.com/computer_graphics/index.htm', description: 'Graphics algorithms and OpenGL', credits: 3 },
    { name: 'Design & Analysis of Algorithms', code: 'DAA', icon: '🔍', color: 'bg-blue-500', borderColor: 'border-blue-500', semester: '5th', link: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', description: 'Algorithm design techniques', credits: 4 },
    { name: 'Compiler Design', code: 'CD', icon: '🛠️', color: 'bg-green-600', borderColor: 'border-green-600', semester: '5th', link: 'https://www.tutorialspoint.com/compiler_design/index.htm', description: 'Lexical and syntax analysis', credits: 3 },
    { name: 'Web Technologies', code: 'WT', icon: '🌍', color: 'bg-indigo-500', borderColor: 'border-indigo-500', semester: '5th', link: 'https://www.w3schools.com/', description: 'HTML, CSS, JavaScript basics', credits: 3 },
    
    // 6th Semester
    { name: 'Machine Learning', code: 'ML', icon: '🤖', color: 'bg-purple-600', borderColor: 'border-purple-600', semester: '6th', link: 'https://www.coursera.org/learn/machine-learning', description: 'ML algorithms and models', credits: 4 },
    { name: 'Artificial Intelligence', code: 'AI', icon: '🧠', color: 'bg-pink-600', borderColor: 'border-pink-600', semester: '6th', link: 'https://www.ai-class.com/', description: 'AI search and reasoning', credits: 4 },
    { name: 'Data Mining', code: 'DM2', icon: '⛏️', color: 'bg-orange-600', borderColor: 'border-orange-600', semester: '6th', link: 'https://www.kdnuggets.com/', description: 'Data analysis and patterns', credits: 3 },
    { name: 'Information Security', code: 'IS', icon: '🔒', color: 'bg-red-500', borderColor: 'border-red-500', semester: '6th', link: 'https://www.cybrary.it/', description: 'Security concepts and crypto', credits: 3 },
    { name: 'Mobile Application Development', code: 'MAD', icon: '📱', color: 'bg-teal-600', borderColor: 'border-teal-600', semester: '6th', link: 'https://developer.android.com/', description: 'Android app development', credits: 3 },
    
    // 7th Semester
    { name: 'Cloud Computing', code: 'CC', icon: '☁️', color: 'bg-cyan-500', borderColor: 'border-cyan-500', semester: '7th', link: 'https://aws.amazon.com/training/', description: 'Cloud platforms and services', credits: 3 },
    { name: 'Big Data Analytics', code: 'BDA', icon: '📊', color: 'bg-blue-700', borderColor: 'border-blue-700', semester: '7th', link: 'https://hadoop.apache.org/', description: 'Hadoop and big data tools', credits: 4 },
    { name: 'Internet of Things', code: 'IOT', icon: '🌐', color: 'bg-green-700', borderColor: 'border-green-700', semester: '7th', link: 'https://www.arduino.cc/', description: 'IoT devices and Arduino', credits: 3 },
    { name: 'Blockchain Technology', code: 'BCT', icon: '⛓️', color: 'bg-yellow-700', borderColor: 'border-yellow-700', semester: '7th', link: 'https://ethereum.org/en/developers/', description: 'Blockchain and smart contracts', credits: 3 },
    { name: 'Natural Language Processing', code: 'NLP', icon: '📝', color: 'bg-purple-700', borderColor: 'border-purple-700', semester: '7th', link: 'https://www.nltk.org/', description: 'Text processing with NLTK', credits: 3 },
    
    // 8th Semester
    { name: 'Deep Learning', code: 'DL', icon: '🧬', color: 'bg-indigo-700', borderColor: 'border-indigo-700', semester: '8th', link: 'https://www.deeplearning.ai/', description: 'Neural networks and CNNs', credits: 4 },
    { name: 'DevOps', code: 'DEVOPS', icon: '🚀', color: 'bg-orange-700', borderColor: 'border-orange-700', semester: '8th', link: 'https://www.docker.com/get-started', description: 'Docker, Kubernetes, CI/CD', credits: 3 },
    { name: 'Cyber Security', code: 'CYBER', icon: '🛡️', color: 'bg-red-700', borderColor: 'border-red-700', semester: '8th', link: 'https://www.offensive-security.com/', description: 'Ethical hacking and pentesting', credits: 3 },
    { name: 'Quantum Computing', code: 'QC', icon: '⚛️', color: 'bg-pink-700', borderColor: 'border-pink-700', semester: '8th', link: 'https://qiskit.org/', description: 'Quantum algorithms with Qiskit', credits: 3 },
    { name: 'Augmented Reality', code: 'AR', icon: '🕶️', color: 'bg-teal-700', borderColor: 'border-teal-700', semester: '8th', link: 'https://unity.com/solutions/ar', description: 'AR/VR with Unity', credits: 3 },
  ]

  const quizSubjects = studentData.selectedSubjects && studentData.selectedSubjects.length > 0
    ? allQuizSubjects.filter(subject => studentData.selectedSubjects.includes(subject.code))
    : allQuizSubjects.slice(0, 6) // Default to first 6 if no selection

  const loadQuizProgress = (subject) => {
    const saved = localStorage.getItem(`kramik_quiz_${subject.code}`)
    if (saved) {
      const data = JSON.parse(saved)
      setQuizPoints(data.points || 0)
      setQuizLevel(data.level || 'Beginner')
      setQuizHistory(data.history || [])
      setQuizAchievements(data.achievements || [])
    } else {
      setQuizPoints(0)
      setQuizLevel('Beginner')
      setQuizHistory([])
      setQuizAchievements([])
    }
  }

  const saveQuizProgress = (subject, points, level, history, achievements) => {
    const data = { points, level, history, achievements, lastPlayed: new Date().toISOString() }
    localStorage.setItem(`kramik_quiz_${subject.code}`, JSON.stringify(data))
  }

  const generateQuestion = (subject, level) => {
    const questionBank = {
      'DSA': {
        'Beginner': [
          { q: 'What is the time complexity of accessing an element in an array by index?', a: 'O(1)', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'] },
          { q: 'Which data structure uses LIFO (Last In First Out) principle?', a: 'Stack', options: ['Queue', 'Stack', 'Array', 'Tree'] },
          { q: 'What is a linked list?', a: 'A linear data structure where elements are linked using pointers', options: ['A sorted array', 'A linear data structure where elements are linked using pointers', 'A tree structure', 'A hash table'] },
        ],
        'Intermediate': [
          { q: 'What is the worst-case time complexity of Quick Sort?', a: 'O(n²)', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'] },
          { q: 'In a binary search tree, which traversal gives sorted output?', a: 'Inorder', options: ['Preorder', 'Inorder', 'Postorder', 'Level order'] },
          { q: 'What is the space complexity of merge sort?', a: 'O(n)', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'] },
        ],
        'Advanced': [
          { q: 'What is the amortized time complexity of dynamic array insertion?', a: 'O(1)', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'] },
          { q: 'Which algorithm is used for finding strongly connected components?', a: 'Kosaraju', options: ['Dijkstra', 'Kosaraju', 'Prim', 'Kruskal'] },
          { q: 'What is the time complexity of heap sort?', a: 'O(n log n)', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'] },
        ],
        'Expert': [
          { q: 'What is the time complexity of the Aho-Corasick algorithm?', a: 'O(n + m + z)', options: ['O(n + m)', 'O(n * m)', 'O(n + m + z)', 'O(n log m)'] },
          { q: 'Which data structure is used in the Union-Find algorithm?', a: 'Disjoint Set', options: ['Heap', 'Trie', 'Disjoint Set', 'Segment Tree'] },
          { q: 'What is the purpose of the Fenwick Tree?', a: 'Range sum queries and updates', options: ['Sorting', 'Range sum queries and updates', 'Pathfinding', 'String matching'] },
        ],
      },
      'DBMS': {
        'Beginner': [
          { q: 'What does SQL stand for?', a: 'Structured Query Language', options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Language', 'Sequential Query Language'] },
          { q: 'Which SQL command is used to retrieve data?', a: 'SELECT', options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'] },
          { q: 'What is a primary key?', a: 'A unique identifier for a record', options: ['A foreign reference', 'A unique identifier for a record', 'An index', 'A constraint'] },
        ],
        'Intermediate': [
          { q: 'What is normalization in databases?', a: 'Organizing data to reduce redundancy', options: ['Increasing data redundancy', 'Organizing data to reduce redundancy', 'Creating backups', 'Indexing data'] },
          { q: 'Which normal form eliminates transitive dependencies?', a: '3NF', options: ['1NF', '2NF', '3NF', 'BCNF'] },
          { q: 'What is a foreign key?', a: 'A field that links to a primary key in another table', options: ['A unique key', 'A field that links to a primary key in another table', 'An index', 'A constraint'] },
        ],
        'Advanced': [
          { q: 'What is ACID in database transactions?', a: 'Atomicity, Consistency, Isolation, Durability', options: ['Access, Control, Integrity, Data', 'Atomicity, Consistency, Isolation, Durability', 'Authentication, Compression, Indexing, Distribution', 'Authorization, Concurrency, Indexing, Delivery'] },
          { q: 'What is the purpose of indexing?', a: 'To speed up data retrieval', options: ['To increase storage', 'To speed up data retrieval', 'To normalize data', 'To backup data'] },
          { q: 'What is a deadlock in databases?', a: 'When two transactions wait for each other indefinitely', options: ['A slow query', 'When two transactions wait for each other indefinitely', 'A crashed database', 'A locked table'] },
        ],
        'Expert': [
          { q: 'What is MVCC in PostgreSQL?', a: 'Multi-Version Concurrency Control', options: ['Multi-Value Consistency Check', 'Multi-Version Concurrency Control', 'Multiple View Cache Control', 'Master-View Consistency Control'] },
          { q: 'What is the CAP theorem?', a: 'Consistency, Availability, Partition tolerance', options: ['Cache, Access, Performance', 'Consistency, Availability, Partition tolerance', 'Control, Authentication, Privacy', 'Capacity, Atomicity, Persistence'] },
          { q: 'What is sharding?', a: 'Horizontal partitioning of data across multiple servers', options: ['Vertical partitioning', 'Horizontal partitioning of data across multiple servers', 'Data replication', 'Index optimization'] },
        ],
      },
      'OS': {
        'Beginner': [
          { q: 'What is an operating system?', a: 'Software that manages hardware and software resources', options: ['An application', 'Software that manages hardware and software resources', 'A programming language', 'A database'] },
          { q: 'Which scheduling algorithm is simplest?', a: 'FCFS', options: ['Round Robin', 'FCFS', 'Priority', 'SJF'] },
          { q: 'What is a process?', a: 'A program in execution', options: ['A file', 'A program in execution', 'A thread', 'A device'] },
        ],
        'Intermediate': [
          { q: 'What is context switching?', a: 'Switching CPU from one process to another', options: ['Switching between threads', 'Switching CPU from one process to another', 'Changing memory allocation', 'Updating file systems'] },
          { q: 'What is virtual memory?', a: 'Using disk space as RAM', options: ['Extra RAM', 'Using disk space as RAM', 'Cache memory', 'ROM'] },
          { q: 'What is a deadlock?', a: 'When processes wait for each other indefinitely', options: ['A crashed process', 'When processes wait for each other indefinitely', 'A slow system', 'A memory leak'] },
        ],
        'Advanced': [
          { q: 'What are the four conditions for deadlock?', a: 'Mutual exclusion, Hold and wait, No preemption, Circular wait', options: ['Mutual exclusion, Hold and wait, No preemption, Circular wait', 'Atomicity, Consistency, Isolation, Durability', 'Read, Write, Execute, Delete', 'Single, Multiple, Distributed, Parallel'] },
          { q: 'What is thrashing?', a: 'Excessive page swapping', options: ['Fast processing', 'Excessive page swapping', 'Thread creation', 'Disk defragmentation'] },
          { q: 'What is the difference between paging and segmentation?', a: 'Paging uses fixed-size blocks, segmentation uses variable-size blocks', options: ['No difference', 'Paging is faster', 'Paging uses fixed-size blocks, segmentation uses variable-size blocks', 'Segmentation is newer'] },
        ],
        'Expert': [
          { q: 'What is the Bankers algorithm used for?', a: 'Deadlock avoidance', options: ['Scheduling', 'Deadlock avoidance', 'Memory management', 'File allocation'] },
          { q: 'What is copy-on-write in process creation?', a: 'Sharing memory until write occurs', options: ['Copying process immediately', 'Sharing memory until write occurs', 'Writing to disk', 'Creating backups'] },
          { q: 'What is the working set model?', a: 'Set of pages a process is currently using', options: ['All pages in memory', 'Set of pages a process is currently using', 'Available memory', 'Disk cache'] },
        ],
      },
      'CN': {
        'Beginner': [
          { q: 'What does IP stand for?', a: 'Internet Protocol', options: ['Internet Protocol', 'Internal Process', 'Information Processing', 'Integrated Platform'] },
          { q: 'Which layer is responsible for routing in OSI model?', a: 'Network', options: ['Physical', 'Data Link', 'Network', 'Transport'] },
          { q: 'What is the default port for HTTP?', a: '80', options: ['21', '80', '443', '8080'] },
        ],
        'Intermediate': [
          { q: 'What is the difference between TCP and UDP?', a: 'TCP is connection-oriented, UDP is connectionless', options: ['No difference', 'TCP is faster', 'TCP is connection-oriented, UDP is connectionless', 'UDP is more reliable'] },
          { q: 'What is a subnet mask?', a: 'Used to divide IP address into network and host parts', options: ['A security feature', 'Used to divide IP address into network and host parts', 'A protocol', 'A device'] },
          { q: 'What is DNS?', a: 'Domain Name System', options: ['Data Network Service', 'Domain Name System', 'Direct Network Storage', 'Dynamic Name Service'] },
        ],
        'Advanced': [
          { q: 'What is the three-way handshake in TCP?', a: 'SYN, SYN-ACK, ACK', options: ['SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'HELLO, ACK, BYE', 'REQ, RES, CLOSE'] },
          { q: 'What is CIDR notation?', a: 'Classless Inter-Domain Routing notation for IP addresses', options: ['A security protocol', 'Classless Inter-Domain Routing notation for IP addresses', 'A routing algorithm', 'A network device'] },
          { q: 'What is ARP used for?', a: 'Mapping IP addresses to MAC addresses', options: ['Routing packets', 'Mapping IP addresses to MAC addresses', 'Encrypting data', 'Compressing data'] },
        ],
        'Expert': [
          { q: 'What is BGP?', a: 'Border Gateway Protocol', options: ['Basic Gateway Protocol', 'Border Gateway Protocol', 'Binary Group Protocol', 'Broadcast Gateway Protocol'] },
          { q: 'What is VLAN trunking?', a: 'Carrying traffic for multiple VLANs over a single link', options: ['Creating virtual networks', 'Carrying traffic for multiple VLANs over a single link', 'Encrypting traffic', 'Load balancing'] },
          { q: 'What is the purpose of NAT?', a: 'Translating private IP addresses to public ones', options: ['Network security', 'Translating private IP addresses to public ones', 'Routing optimization', 'Data compression'] },
        ],
      },
      'SE': {
        'Beginner': [
          { q: 'What is the software development life cycle (SDLC)?', a: 'A process for planning, creating, testing, and deploying software', options: ['A programming language', 'A process for planning, creating, testing, and deploying software', 'A testing tool', 'A design pattern'] },
          { q: 'What is version control?', a: 'Managing changes to source code', options: ['Compiling code', 'Managing changes to source code', 'Testing software', 'Deploying applications'] },
          { q: 'What is a bug?', a: 'An error in software', options: ['A feature', 'An error in software', 'A requirement', 'A design'] },
        ],
        'Intermediate': [
          { q: 'What is Agile methodology?', a: 'Iterative development with frequent releases', options: ['Waterfall approach', 'Iterative development with frequent releases', 'Testing strategy', 'Design pattern'] },
          { q: 'What is unit testing?', a: 'Testing individual components', options: ['Testing the entire system', 'Testing individual components', 'User acceptance testing', 'Performance testing'] },
          { q: 'What is continuous integration?', a: 'Automatically building and testing code changes', options: ['Manual deployment', 'Automatically building and testing code changes', 'Code review', 'Version control'] },
        ],
        'Advanced': [
          { q: 'What is the SOLID principle in OOP?', a: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion', options: ['A design pattern', 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion', 'A testing framework', 'A programming language'] },
          { q: 'What is technical debt?', a: 'Future cost of rework due to quick solutions', options: ['Financial debt', 'Future cost of rework due to quick solutions', 'Code complexity', 'Testing backlog'] },
          { q: 'What is refactoring?', a: 'Restructuring code without changing behavior', options: ['Adding features', 'Restructuring code without changing behavior', 'Fixing bugs', 'Writing tests'] },
        ],
        'Expert': [
          { q: 'What is domain-driven design?', a: 'Modeling software based on business domain', options: ['UI-focused design', 'Modeling software based on business domain', 'Database design', 'Network architecture'] },
          { q: 'What is event sourcing?', a: 'Storing state changes as events', options: ['Event handling', 'Storing state changes as events', 'Logging system', 'Message queue'] },
          { q: 'What is the strangler fig pattern?', a: 'Gradually replacing legacy systems', options: ['Design pattern', 'Gradually replacing legacy systems', 'Testing strategy', 'Deployment approach'] },
        ],
      },
      'WEB': {
        'Beginner': [
          { q: 'What does HTML stand for?', a: 'HyperText Markup Language', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'] },
          { q: 'Which tag is used for the largest heading?', a: '<h1>', options: ['<heading>', '<h6>', '<h1>', '<head>'] },
          { q: 'What is CSS used for?', a: 'Styling web pages', options: ['Programming logic', 'Styling web pages', 'Database queries', 'Server configuration'] },
        ],
        'Intermediate': [
          { q: 'What is the box model in CSS?', a: 'Content, padding, border, margin', options: ['Content, padding, border, margin', 'HTML structure', 'JavaScript objects', 'Database schema'] },
          { q: 'What is AJAX?', a: 'Asynchronous JavaScript and XML', options: ['A programming language', 'Asynchronous JavaScript and XML', 'A web server', 'A database'] },
          { q: 'What is responsive design?', a: 'Adapting layout to different screen sizes', options: ['Fast loading', 'Adapting layout to different screen sizes', 'Interactive features', 'Backend optimization'] },
        ],
        'Advanced': [
          { q: 'What is the virtual DOM in React?', a: 'A lightweight copy of the actual DOM', options: ['A database', 'A lightweight copy of the actual DOM', 'A server', 'A framework'] },
          { q: 'What is CORS?', a: 'Cross-Origin Resource Sharing', options: ['Cross-Origin Resource Sharing', 'Code Optimization and Reuse System', 'Central Object Repository Service', 'Client-Origin Request System'] },
          { q: 'What is server-side rendering?', a: 'Rendering web pages on the server', options: ['Client-side rendering', 'Rendering web pages on the server', 'Database rendering', 'Cache rendering'] },
        ],
        'Expert': [
          { q: 'What is tree shaking in webpack?', a: 'Removing unused code from bundles', options: ['DOM manipulation', 'Removing unused code from bundles', 'Component rendering', 'State management'] },
          { q: 'What is the difference between SSR and SSG?', a: 'SSR renders on request, SSG generates at build time', options: ['No difference', 'SSR renders on request, SSG generates at build time', 'SSG is faster', 'SSR is newer'] },
          { q: 'What is hydration in Next.js?', a: 'Attaching event handlers to server-rendered HTML', options: ['Loading data', 'Attaching event handlers to server-rendered HTML', 'Building pages', 'Caching content'] },
        ],
      },
    }

    // Fallback questions for subjects without specific question banks
    const fallbackQuestions = {
      'Beginner': [
        { q: `What is the fundamental concept of ${subject.name}?`, a: 'Core principles and basic understanding', options: ['Core principles and basic understanding', 'Advanced techniques', 'Complex algorithms', 'Expert systems'] },
        { q: `What are the primary applications of ${subject.name}?`, a: 'Practical implementations in real-world scenarios', options: ['Theoretical research only', 'Practical implementations in real-world scenarios', 'Abstract concepts', 'Historical analysis'] },
        { q: `Why is ${subject.name} important in engineering?`, a: 'Essential for problem-solving and innovation', options: ['Not relevant', 'Essential for problem-solving and innovation', 'Optional skill', 'Deprecated technology'] },
      ],
      'Intermediate': [
        { q: `What are common challenges in ${subject.name}?`, a: 'Complexity and optimization requirements', options: ['No challenges exist', 'Complexity and optimization requirements', 'Simple straightforward tasks', 'Minimal learning curve'] },
        { q: `What tools are commonly used in ${subject.name}?`, a: 'Specialized software and frameworks', options: ['No tools needed', 'Basic calculators', 'Specialized software and frameworks', 'Paper and pencil only'] },
        { q: `How does ${subject.name} integrate with other technologies?`, a: 'Through APIs and standard protocols', options: ['It does not integrate', 'Through APIs and standard protocols', 'Manual intervention required', 'Isolated system'] },
      ],
      'Advanced': [
        { q: `What are advanced techniques in ${subject.name}?`, a: 'Optimization and innovative methodologies', options: ['Basic operations', 'Optimization and innovative methodologies', 'Simple procedures', 'Standard approaches'] },
        { q: `What are current research areas in ${subject.name}?`, a: 'Emerging trends and cutting-edge developments', options: ['No active research', 'Emerging trends and cutting-edge developments', 'Obsolete topics', 'Historical methods'] },
        { q: `What makes an expert in ${subject.name}?`, a: 'Deep understanding and practical experience', options: ['Basic knowledge', 'Reading textbooks', 'Deep understanding and practical experience', 'Memorization skills'] },
      ],
      'Expert': [
        { q: `What are the future directions of ${subject.name}?`, a: 'AI integration and advanced automation', options: ['No future developments', 'Declining relevance', 'AI integration and advanced automation', 'Manual processes'] },
        { q: `How do you optimize performance in ${subject.name}?`, a: 'Advanced algorithms and efficient resource management', options: ['No optimization needed', 'Random approaches', 'Advanced algorithms and efficient resource management', 'Trial and error'] },
        { q: `What industry standards exist for ${subject.name}?`, a: 'IEEE and ISO standards for best practices', options: ['No standards', 'Individual preferences', 'IEEE and ISO standards for best practices', 'Outdated guidelines'] },
      ],
    }

    const questions = questionBank[subject.code]?.[level] || fallbackQuestions[level] || []
    if (questions.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * questions.length)
    return questions[randomIndex]
  }

  // Load blockchain stats
  const loadBlockchainStats = async () => {
    if (!isConnected) return
    
    try {
      const stats = await blockchainService.getStudentBlockchainStats()
      setBlockchainStats(stats)
      console.log('⛓️ Blockchain stats loaded:', stats)
    } catch (error) {
      console.error('❌ Failed to load blockchain stats:', error)
    }
  }

  const startQuiz = (subject) => {
    setQuizSubject(subject)
    loadQuizProgress(subject)
    const question = generateQuestion(subject, quizLevel)
    setCurrentQuestion(question)
    setUserAnswer('')
    setShowQuizResult(false)
    setQuestionsAnswered(0)
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter your answer!')
      return
    }

    const correct = userAnswer.trim().toLowerCase() === currentQuestion.a.toLowerCase()
    setLastAnswerCorrect(correct)
    setShowQuizResult(true)

    let newPoints = quizPoints
    let newLevel = quizLevel
    let newAchievements = [...quizAchievements]
    let newQuestionsAnswered = questionsAnswered + 1

    if (correct) {
      newPoints += 1
      
      // Check for level progression every 10 points
      if (newPoints % 10 === 0 && newPoints > 0) {
        const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        const currentIndex = levels.indexOf(quizLevel)
        if (currentIndex < levels.length - 1) {
          newLevel = levels[currentIndex + 1]
          newAchievements.push({
            title: `${newLevel} Level Unlocked!`,
            description: `Congratulations! You've reached ${newLevel} level in ${quizSubject.name}`,
            icon: '🎉',
            timestamp: new Date().toISOString(),
            points: newPoints
          })
          alert(`🎉 LEVEL UP! You've reached ${newLevel} level! Keep up the great work!`)
        } else {
          newAchievements.push({
            title: 'Master Achievement',
            description: `You've earned ${newPoints} points at Expert level!`,
            icon: '👑',
            timestamp: new Date().toISOString(),
            points: newPoints
          })
        }
      }
    } else {
      newPoints = Math.max(0, newPoints - 1)
    }

    const newHistory = [...quizHistory, {
      question: currentQuestion.q,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.a,
      correct,
      timestamp: new Date().toISOString(),
      level: quizLevel
    }]

    setQuizPoints(newPoints)
    setQuizLevel(newLevel)
    setQuizHistory(newHistory)
    setQuizAchievements(newAchievements)
    setQuestionsAnswered(newQuestionsAnswered)

    saveQuizProgress(quizSubject, newPoints, newLevel, newHistory, newAchievements)
    
    // Record quiz on blockchain if wallet connected and every 5 questions
    if (isConnected && newQuestionsAnswered % 5 === 0) {
      try {
        const accuracy = (newHistory.filter(h => h.correct).length / newHistory.length) * 100
        const quizData = {
          subjectCode: quizSubject.code,
          questions: [currentQuestion],
          answers: [userAnswer],
          score: accuracy,
          totalQuestions: newQuestionsAnswered
        }
        
        const result = await blockchainService.recordQuizOnBlockchain(quizData)
        console.log('✅ Quiz recorded on blockchain:', result)
        
        // Show blockchain verification badge
        alert(`🔗 Blockchain Verified!\n\nYour quiz progress has been recorded on the blockchain.\nTransaction: ${result.transactionHash.slice(0, 10)}...`)
        
        // Refresh blockchain stats
        loadBlockchainStats()
      } catch (error) {
        console.error('❌ Blockchain recording failed:', error)
        // Don't interrupt user experience, just log the error
      }
    }
    
    // Trigger subjects refresh to update progress bars immediately
    setQuizRefreshTrigger(prev => prev + 1)
  }

  const nextQuestion = () => {
    const question = generateQuestion(quizSubject, quizLevel)
    setCurrentQuestion(question)
    setUserAnswer('')
    setShowQuizResult(false)
    setLastAnswerCorrect(null)
  }

  const exitQuiz = () => {
    setQuizSubject(null)
    setCurrentQuestion(null)
    setUserAnswer('')
    setShowQuizResult(false)
    setLastAnswerCorrect(null)
  }

  const handleCompleteAssignment = async (assignmentId) => {
    const assignment = assignments.find(a => {
      const id = a.id || a._id?.toString();
      return id === assignmentId;
    });
    
    if (!assignment) {
      console.error('❌ Assignment not found:', assignmentId);
      return;
    }
    
    if (assignment.completion_status === 'completed') {
      alert('✅ You have already completed this assignment!');
      return;
    }
    
    if (confirm(`Mark "${assignment.title}" as completed?\n\nYou will earn ${assignment.creditPoints} credit points.`)) {
      try {
        console.log('✅ Marking assignment as complete:', assignmentId);
        await studentAPI.markAssignmentComplete(assignmentId);
        
        // Refresh assignments to get updated completion status
        const response = await studentAPI.getAssignments();
        const updatedAssignments = response.data;
        setAssignments(updatedAssignments);
        
        // Recalculate earned points from all completed assignments
        const totalPoints = updatedAssignments
          .filter(a => a.completion_status === 'completed')
          .reduce((sum, a) => sum + (a.earnedPoints || a.creditPoints || 0), 0);
        setEarnedPoints(totalPoints);
        
        console.log('💰 Total points after completion:', totalPoints);
        
        // Close modal if open
        setShowAssignmentModal(false);
        
        alert(`🎉 Congratulations!\n\nYou completed: ${assignment.title}\nPoints earned: +${assignment.creditPoints}\nTotal Points: ${totalPoints}`);
      } catch (error) {
        console.error('❌ Failed to mark assignment complete:', error);
        alert('Failed to mark assignment as complete. Please try again.');
      }
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    console.log(`🔄 Switched to tab: ${tab}`)
  }

  // AI Bot Functions
  const generateAIAnswer = async (question) => {
    setIsGenerating(true)
    setCurrentPage(0)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate comprehensive answer with multiple pages
    const pages = [
      {
        type: 'theory',
        title: 'Theoretical Foundation',
        content: generateTheory(question),
        visual: generateDiagram(question)
      },
      {
        type: 'mindmap',
        title: 'Concept Mind Map',
        content: generateMindMap(question)
      },
      {
        type: 'explanation',
        title: 'Detailed Explanation',
        content: generateDetailedExplanation(question),
        examples: generateExamples(question)
      }
    ]
    
    // Add code page if question is code-related
    const codeKeywords = ['code', 'program', 'algorithm', 'function', 'implement', 'write', 'create', 'build', 'develop', 'java', 'python', 'javascript', 'c++', 'sorting', 'search', 'tree', 'graph', 'stack', 'queue']
    const isCodeRelated = codeKeywords.some(keyword => question.toLowerCase().includes(keyword))
    
    if (isCodeRelated) {
      pages.push({
        type: 'code',
        title: 'Code Implementation',
        content: generateCodeImplementation(question)
      })
    }
    
    pages.push(
      {
        type: 'comic',
        title: 'Comic Visualization',
        content: generateComic(question)
      },
      {
        type: 'summary',
        title: 'Key Takeaways',
        content: generateSummary(question),
        resources: generateBotResources(question)
      }
    )
    
    const answer = {
      question: question,
      timestamp: new Date().toISOString(),
      pages: pages
    }
    
    setBotAnswer(answer)
    const newHistory = [answer, ...botHistory.slice(0, 9)] // Keep last 10
    setBotHistory(newHistory)
    localStorage.setItem('kramik_bot_history', JSON.stringify(newHistory))
    setIsGenerating(false)
  }

  const generateCodeImplementation = (question) => {
    const lowerQ = question.toLowerCase()
    
    // Detect specific algorithms/topics for accurate code
    const getSpecificCode = () => {
      // Binary Search
      if (lowerQ.includes('binary search')) {
        return {
          python: `# Binary Search Algorithm\ndef binary_search(arr, target):\n    """Find target in sorted array using binary search"""\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = left + (right - left) // 2  # Avoid overflow\n        \n        if arr[mid] == target:\n            return mid  # Found target\n        elif arr[mid] < target:\n            left = mid + 1  # Search right half\n        else:\n            right = mid - 1  # Search left half\n    \n    return -1  # Target not found\n\n# Test cases\ntest_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\nprint(f"Index of 7: {binary_search(test_array, 7)}")  # Output: 3\nprint(f"Index of 20: {binary_search(test_array, 20)}")  # Output: -1`,
          complexity: { time: 'O(log n)', space: 'O(1)', explanation: 'Logarithmic time - halves search space each iteration. Constant space - only uses a few variables.' }
        }
      }
      
      // Bubble Sort
      if (lowerQ.includes('bubble sort')) {
        return {
          python: `# Bubble Sort Algorithm\ndef bubble_sort(arr):\n    """Sort array in ascending order using bubble sort"""\n    n = len(arr)\n    \n    for i in range(n):\n        swapped = False  # Optimization flag\n        \n        for j in range(0, n - i - 1):\n            # Compare adjacent elements\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        \n        # If no swaps, array is sorted\n        if not swapped:\n            break\n    \n    return arr\n\n# Test\ntest_array = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Sorted: {bubble_sort(test_array)}")\n# Output: [11, 12, 22, 25, 34, 64, 90]`,
          complexity: { time: 'O(n²)', space: 'O(1)', explanation: 'Quadratic time - nested loops. Best case O(n) if already sorted. In-place sorting - constant space.' }
        }
      }
      
      // Quick Sort
      if (lowerQ.includes('quick sort')) {
        return {
          python: `# Quick Sort Algorithm\ndef quick_sort(arr):\n    """Sort array using quicksort (divide and conquer)"""\n    if len(arr) <= 1:\n        return arr\n    \n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    \n    return quick_sort(left) + middle + quick_sort(right)\n\ndef quick_sort_inplace(arr, low=0, high=None):\n    """In-place quicksort implementation"""\n    if high is None:\n        high = len(arr) - 1\n    \n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort_inplace(arr, low, pi - 1)\n        quick_sort_inplace(arr, pi + 1, high)\n    return arr\n\ndef partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1\n\n# Test\ntest = [10, 7, 8, 9, 1, 5]\nprint(quick_sort(test))  # [1, 5, 7, 8, 9, 10]`,
          complexity: { time: 'O(n log n) avg, O(n²) worst', space: 'O(log n)', explanation: 'Average case very efficient. Worst case when already sorted. Recursion uses stack space.' }
        }
      }
      
      // Linked List
      if (lowerQ.includes('linked list')) {
        return {
          python: `# Linked List Implementation\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        """Add node to end"""\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        \n        current = self.head\n        while current.next:\n            current = current.next\n        current.next = new_node\n    \n    def prepend(self, data):\n        """Add node to beginning"""\n        new_node = Node(data)\n        new_node.next = self.head\n        self.head = new_node\n    \n    def delete(self, data):\n        """Delete first occurrence of data"""\n        if not self.head:\n            return\n        \n        if self.head.data == data:\n            self.head = self.head.next\n            return\n        \n        current = self.head\n        while current.next:\n            if current.next.data == data:\n                current.next = current.next.next\n                return\n            current = current.next\n    \n    def display(self):\n        elements = []\n        current = self.head\n        while current:\n            elements.append(str(current.data))\n            current = current.next\n        print(" -> ".join(elements))\n\n# Test\nll = LinkedList()\nll.append(1)\nll.append(2)\nll.prepend(0)\nll.display()  # 0 -> 1 -> 2`,
          complexity: { time: 'O(1) insert/delete at head, O(n) at tail', space: 'O(n)', explanation: 'Dynamic size. Efficient head operations. Linear search time.' }
        }
      }
      
      // Stack
      if (lowerQ.includes('stack')) {
        return {
          python: `# Stack Implementation\nclass Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        """Add item to top"""\n        self.items.append(item)\n    \n    def pop(self):\n        """Remove and return top item"""\n        if self.is_empty():\n            raise IndexError("Pop from empty stack")\n        return self.items.pop()\n    \n    def peek(self):\n        """Return top item without removing"""\n        if self.is_empty():\n            raise IndexError("Peek from empty stack")\n        return self.items[-1]\n    \n    def is_empty(self):\n        return len(self.items) == 0\n    \n    def size(self):\n        return len(self.items)\n\n# Example: Balanced Parentheses\ndef is_balanced(expression):\n    stack = Stack()\n    pairs = {')': '(', '}': '{', ']': '['}\n    \n    for char in expression:\n        if char in '({[':\n            stack.push(char)\n        elif char in ')}]':\n            if stack.is_empty() or stack.pop() != pairs[char]:\n                return False\n    \n    return stack.is_empty()\n\n# Test\nprint(is_balanced("((()))"))  # True\nprint(is_balanced("({[]})"   # False`,
          complexity: { time: 'O(1) push/pop', space: 'O(n)', explanation: 'Constant time operations. LIFO principle. Dynamic size.' }
        }
      }
      
      // Queue
      if (lowerQ.includes('queue')) {
        return {
          python: `# Queue Implementation\nfrom collections import deque\n\nclass Queue:\n    def __init__(self):\n        self.items = deque()\n    \n    def enqueue(self, item):\n        """Add item to rear"""\n        self.items.append(item)\n    \n    def dequeue(self):\n        """Remove and return front item"""\n        if self.is_empty():\n            raise IndexError("Dequeue from empty queue")\n        return self.items.popleft()\n    \n    def front(self):\n        """Return front item"""\n        if self.is_empty():\n            raise IndexError("Front from empty queue")\n        return self.items[0]\n    \n    def is_empty(self):\n        return len(self.items) == 0\n    \n    def size(self):\n        return len(self.items)\n\n# Example: BFS Traversal\ndef bfs(graph, start):\n    visited = set()\n    queue = Queue()\n    queue.enqueue(start)\n    visited.add(start)\n    result = []\n    \n    while not queue.is_empty():\n        vertex = queue.dequeue()\n        result.append(vertex)\n        \n        for neighbor in graph[vertex]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.enqueue(neighbor)\n    \n    return result\n\n# Test\ngraph = {0: [1, 2], 1: [3], 2: [3], 3: []}\nprint(bfs(graph, 0))  # [0, 1, 2, 3]`,
          complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)', explanation: 'Efficient with deque. FIFO principle. Used in BFS.' }
        }
      }
      
      // Merge Sort
      if (lowerQ.includes('merge sort')) {
        return {
          python: `# Merge Sort Algorithm\ndef merge_sort(arr):\n    """Sort array using merge sort (divide and conquer)"""\n    if len(arr) <= 1:\n        return arr\n    \n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    return merge(left, right)\n\ndef merge(left, right):\n    """Merge two sorted arrays"""\n    result = []\n    i = j = 0\n    \n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    # Add remaining elements\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\n# Test\ntest = [38, 27, 43, 3, 9, 82, 10]\nprint(merge_sort(test))  # [3, 9, 10, 27, 38, 43, 82]`,
          complexity: { time: 'O(n log n)', space: 'O(n)', explanation: 'Guaranteed O(n log n). Stable sort. Requires extra space for merging.' }
        }
      }
      
      // Binary Tree
      if (lowerQ.includes('binary tree') || lowerQ.includes('tree traversal')) {
        return {
          python: `# Binary Tree Implementation\nclass TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\nclass BinaryTree:\n    def __init__(self):\n        self.root = None\n    \n    def inorder(self, node, result=[]):\n        """Left -> Root -> Right"""\n        if node:\n            self.inorder(node.left, result)\n            result.append(node.value)\n            self.inorder(node.right, result)\n        return result\n    \n    def preorder(self, node, result=[]):\n        """Root -> Left -> Right"""\n        if node:\n            result.append(node.value)\n            self.preorder(node.left, result)\n            self.preorder(node.right, result)\n        return result\n    \n    def postorder(self, node, result=[]):\n        """Left -> Right -> Root"""\n        if node:\n            self.postorder(node.left, result)\n            self.postorder(node.right, result)\n            result.append(node.value)\n        return result\n\n# Test\nroot = TreeNode(1)\nroot.left = TreeNode(2)\nroot.right = TreeNode(3)\nroot.left.left = TreeNode(4)\nroot.left.right = TreeNode(5)\n\ntree = BinaryTree()\nprint("Inorder:", tree.inorder(root, []))  # [4,2,5,1,3]`,
          complexity: { time: 'O(n) traversal', space: 'O(h) recursion depth', explanation: 'Visit all nodes once. Space for recursion stack height.' }
        }
      }
      
      return null
    }
    
    const specificCode = getSpecificCode()
    if (specificCode) {
      return {
        language: 'python',
        code: specificCode.python,
        flowchart: generateAlgorithmFlowchart(lowerQ),
        complexity: specificCode.complexity,
        stepByStep: [
          { step: 1, title: 'Understand the Problem', description: 'Analyze requirements and constraints' },
          { step: 2, title: 'Choose Data Structure', description: 'Select appropriate data structure for efficiency' },
          { step: 3, title: 'Design Algorithm', description: 'Plan step-by-step solution approach' },
          { step: 4, title: 'Implement Code', description: 'Write clean, well-commented code' },
          { step: 5, title: 'Test & Optimize', description: 'Verify correctness and improve performance' }
        ]
      }
    }
    
    // Detect programming language from question
    const langKeywords = {
      python: ['python', 'py'],
      javascript: ['javascript', 'js', 'node'],
      java: ['java'],
      cpp: ['c++', 'cpp'],
      c: ['c programming', ' c ']
    }
    
    let detectedLang = 'python' // default
    for (const [lang, keywords] of Object.entries(langKeywords)) {
      if (keywords.some(kw => question.toLowerCase().includes(kw))) {
        detectedLang = lang
        break
      }
    }
    
    // Generate language-specific code
    const codeExamples = {
      python: `# Python Implementation\ndef solution(input_data):\n    """\n    ${question}\n    """\n    # Step 1: Initialize variables\n    result = []\n    \n    # Step 2: Process the data\n    for item in input_data:\n        # Apply logic here\n        processed = process(item)\n        result.append(processed)\n    \n    # Step 3: Return the result\n    return result\n\n# Example usage\ndata = [1, 2, 3, 4, 5]\noutput = solution(data)\nprint(output)`,
      
      javascript: `// JavaScript Implementation\nfunction solution(inputData) {\n    /**\n     * ${question}\n     */\n    // Step 1: Initialize variables\n    const result = [];\n    \n    // Step 2: Process the data\n    for (const item of inputData) {\n        // Apply logic here\n        const processed = process(item);\n        result.push(processed);\n    }\n    \n    // Step 3: Return the result\n    return result;\n}\n\n// Example usage\nconst data = [1, 2, 3, 4, 5];\nconst output = solution(data);\nconsole.log(output);`,
      
      java: `// Java Implementation\npublic class Solution {\n    /**\n     * ${question}\n     */\n    public static List<Integer> solution(List<Integer> inputData) {\n        // Step 1: Initialize variables\n        List<Integer> result = new ArrayList<>();\n        \n        // Step 2: Process the data\n        for (Integer item : inputData) {\n            // Apply logic here\n            Integer processed = process(item);\n            result.add(processed);\n        }\n        \n        // Step 3: Return the result\n        return result;\n    }\n    \n    // Example usage\n    public static void main(String[] args) {\n        List<Integer> data = Arrays.asList(1, 2, 3, 4, 5);\n        List<Integer> output = solution(data);\n        System.out.println(output);\n    }\n}`,
      
      cpp: `// C++ Implementation\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n/**\n * ${question}\n */\nvector<int> solution(vector<int> inputData) {\n    // Step 1: Initialize variables\n    vector<int> result;\n    \n    // Step 2: Process the data\n    for (int item : inputData) {\n        // Apply logic here\n        int processed = process(item);\n        result.push_back(processed);\n    }\n    \n    // Step 3: Return the result\n    return result;\n}\n\n// Example usage\nint main() {\n    vector<int> data = {1, 2, 3, 4, 5};\n    vector<int> output = solution(data);\n    \n    for (int val : output) {\n        cout << val << " ";\n    }\n    return 0;\n}`,
      
      c: `// C Implementation\n#include <stdio.h>\n#include <stdlib.h>\n\n/**\n * ${question}\n */\nvoid solution(int* inputData, int size, int* result) {\n    // Step 1: Initialize variables\n    int i;\n    \n    // Step 2: Process the data\n    for (i = 0; i < size; i++) {\n        // Apply logic here\n        result[i] = process(inputData[i]);\n    }\n}\n\n// Example usage\nint main() {\n    int data[] = {1, 2, 3, 4, 5};\n    int size = 5;\n    int result[size];\n    \n    solution(data, size, result);\n    \n    for (int i = 0; i < size; i++) {\n        printf("%d ", result[i]);\n    }\n    return 0;\n}`
    }
    
    return {
      language: detectedLang,
      code: codeExamples[detectedLang],
      flowchart: {
        title: 'Algorithm Flowchart',
        steps: [
          { id: 1, label: 'Start', type: 'start', color: 'bg-green-500' },
          { id: 2, label: 'Input Data', type: 'input', color: 'bg-blue-500' },
          { id: 3, label: 'Initialize Variables', type: 'process', color: 'bg-purple-500' },
          { id: 4, label: 'Loop Through Data', type: 'decision', color: 'bg-orange-500' },
          { id: 5, label: 'Process Each Item', type: 'process', color: 'bg-indigo-500' },
          { id: 6, label: 'Store Result', type: 'process', color: 'bg-pink-500' },
          { id: 7, label: 'More Items?', type: 'decision', color: 'bg-yellow-500' },
          { id: 8, label: 'Return Result', type: 'output', color: 'bg-teal-500' },
          { id: 9, label: 'End', type: 'end', color: 'bg-red-500' }
        ],
        connections: [
          [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4], [7, 8], [8, 9]
        ]
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        explanation: 'Linear time and space complexity based on input size'
      },
      stepByStep: [
        { step: 1, title: 'Understand the Problem', description: 'Read and comprehend what needs to be solved' },
        { step: 2, title: 'Plan the Approach', description: 'Design the algorithm and data structures needed' },
        { step: 3, title: 'Write the Code', description: 'Implement the solution in chosen programming language' },
        { step: 4, title: 'Test with Examples', description: 'Verify the code works with sample inputs' },
        { step: 5, title: 'Optimize', description: 'Improve efficiency and handle edge cases' }
      ]
    }
  }

  const generateTheory = (question) => {
    const lowerQ = question.toLowerCase()
    
    // Detect topic category
    const topics = {
      dataStructures: ['array', 'linked list', 'tree', 'graph', 'stack', 'queue', 'heap', 'hash', 'trie'],
      algorithms: ['sort', 'search', 'binary search', 'merge sort', 'quick sort', 'dynamic programming', 'greedy', 'recursion', 'backtracking'],
      programming: ['oop', 'object oriented', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction'],
      database: ['sql', 'database', 'dbms', 'normalization', 'join', 'query', 'index', 'transaction'],
      networking: ['network', 'tcp', 'udp', 'http', 'api', 'protocol', 'osi', 'ip'],
      ai: ['machine learning', 'neural network', 'deep learning', 'ai', 'artificial intelligence', 'ml', 'classification', 'regression'],
      webdev: ['html', 'css', 'javascript', 'react', 'node', 'frontend', 'backend', 'web'],
      os: ['operating system', 'process', 'thread', 'memory', 'deadlock', 'scheduling', 'os']
    }
    
    let category = 'general'
    for (const [cat, keywords] of Object.entries(topics)) {
      if (keywords.some(kw => lowerQ.includes(kw))) {
        category = cat
        break
      }
    }
    
    const definitions = {
      dataStructures: `A data structure is a specialized format for organizing, processing, retrieving and storing data efficiently. ${question} represents a fundamental way to organize data with specific properties that make certain operations more efficient.`,
      algorithms: `An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. ${question} is a computational method designed to solve specific problems with proven efficiency and correctness.`,
      programming: `${question} is a core programming concept that helps write better, more maintainable, and scalable code by following proven design principles and patterns.`,
      database: `${question} is a crucial database concept that ensures data integrity, efficiency, and optimal performance in database management systems.`,
      networking: `${question} relates to computer networking - the practice of connecting computers and devices to share resources and information across networks.`,
      ai: `${question} is an artificial intelligence and machine learning concept that enables computers to learn from data and make intelligent decisions.`,
      webdev: `${question} is a web development technology/concept used to build modern, interactive, and responsive web applications.`,
      os: `${question} is an operating system concept that manages computer hardware and software resources efficiently.`,
      general: `Understanding ${question}: A comprehensive overview of this important concept in computer science and technology.`
    }
    
    const keyPointsMap = {
      dataStructures: [
        'Efficient data organization and access patterns',
        'Time and space complexity trade-offs',
        'Common operations: insertion, deletion, search, traversal',
        'Real-world applications and use cases',
        'Performance characteristics and optimization'
      ],
      algorithms: [
        'Clear step-by-step problem-solving approach',
        'Time complexity: How fast the algorithm runs',
        'Space complexity: How much memory it uses',
        'Correctness proof and edge case handling',
        'Comparison with alternative approaches'
      ],
      programming: [
        'Core principles and design patterns',
        'Benefits for code maintainability and reusability',
        'Best practices and common pitfalls to avoid',
        'Real-world implementation examples',
        'Relationship to software engineering principles'
      ],
      database: [
        'Data integrity and consistency guarantees',
        'Performance optimization techniques',
        'Scalability considerations',
        'ACID properties and transaction management',
        'Industry standards and best practices'
      ],
      networking: [
        'Protocol specifications and standards',
        'Client-server communication patterns',
        'Security and authentication mechanisms',
        'Performance and latency considerations',
        'Common use cases and applications'
      ],
      ai: [
        'Mathematical foundations and algorithms',
        'Training and optimization techniques',
        'Model evaluation and validation',
        'Real-world applications and impact',
        'Ethical considerations and limitations'
      ],
      webdev: [
        'Browser compatibility and standards',
        'Performance optimization best practices',
        'Security considerations',
        'Modern development workflows',
        'Integration with other technologies'
      ],
      os: [
        'System resource management',
        'Process and memory management',
        'Concurrency and synchronization',
        'Performance and efficiency',
        'Security and protection mechanisms'
      ],
      general: [
        'Core principles and foundational concepts',
        'Historical context and evolution',
        'Practical applications in modern technology',
        'Relationship to related concepts',
        'Future trends and developments'
      ]
    }
    
    return {
      definition: definitions[category],
      keyPoints: keyPointsMap[category],
      formula: (lowerQ.includes('math') || lowerQ.includes('formula') || lowerQ.includes('equation') || lowerQ.includes('complexity')) 
        ? 'Mathematical notation and complexity analysis provided in detailed sections' 
        : null,
      category: category
    }
  }

  const generateDiagram = (question) => {
    const lowerQ = question.toLowerCase()
    
    // Generate contextual flowchart based on question type
    if (lowerQ.includes('sort') || lowerQ.includes('search')) {
      return {
        type: 'flowchart',
        nodes: [
          { id: 1, label: 'Input Data', color: 'bg-blue-400' },
          { id: 2, label: 'Initialize', color: 'bg-green-400' },
          { id: 3, label: 'Process/Compare', color: 'bg-purple-400' },
          { id: 4, label: 'Update/Swap', color: 'bg-orange-400' },
          { id: 5, label: 'Check Condition', color: 'bg-yellow-400' },
          { id: 6, label: 'Output Result', color: 'bg-teal-400' }
        ],
        connections: [[1,2], [2,3], [3,4], [4,5], [5,6]]
      }
    } else if (lowerQ.includes('learning') || lowerQ.includes('ai') || lowerQ.includes('ml')) {
      return {
        type: 'flowchart',
        nodes: [
          { id: 1, label: 'Collect Data', color: 'bg-blue-400' },
          { id: 2, label: 'Preprocess', color: 'bg-green-400' },
          { id: 3, label: 'Train Model', color: 'bg-purple-400' },
          { id: 4, label: 'Validate', color: 'bg-orange-400' },
          { id: 5, label: 'Deploy', color: 'bg-teal-400' }
        ],
        connections: [[1,2], [2,3], [3,4], [4,5]]
      }
    } else if (lowerQ.includes('database') || lowerQ.includes('sql')) {
      return {
        type: 'flowchart',
        nodes: [
          { id: 1, label: 'Connect DB', color: 'bg-blue-400' },
          { id: 2, label: 'Write Query', color: 'bg-green-400' },
          { id: 3, label: 'Execute', color: 'bg-purple-400' },
          { id: 4, label: 'Fetch Results', color: 'bg-orange-400' },
          { id: 5, label: 'Process Data', color: 'bg-teal-400' }
        ],
        connections: [[1,2], [2,3], [3,4], [4,5]]
      }
    } else if (lowerQ.includes('web') || lowerQ.includes('api') || lowerQ.includes('http')) {
      return {
        type: 'flowchart',
        nodes: [
          { id: 1, label: 'Client Request', color: 'bg-blue-400' },
          { id: 2, label: 'Server Process', color: 'bg-purple-400' },
          { id: 3, label: 'Database Query', color: 'bg-green-400' },
          { id: 4, label: 'Generate Response', color: 'bg-orange-400' },
          { id: 5, label: 'Client Receives', color: 'bg-teal-400' }
        ],
        connections: [[1,2], [2,3], [3,4], [4,5]]
      }
    } else {
      return {
        type: 'flowchart',
        nodes: [
          { id: 1, label: 'Start/Input', color: 'bg-green-400' },
          { id: 2, label: 'Understand Concept', color: 'bg-blue-400' },
          { id: 3, label: 'Apply Logic', color: 'bg-purple-400' },
          { id: 4, label: 'Generate Output', color: 'bg-orange-400' },
          { id: 5, label: 'Verify Result', color: 'bg-teal-400' }
        ],
        connections: [[1,2], [2,3], [3,4], [4,5]]
      }
    }
  }

  const generateMindMap = (question) => {
    const lowerQ = question.toLowerCase()
    const keywords = question.split(' ').filter(word => word.length > 3)
    
    // Extract key concepts from question
    const extractConcepts = () => {
      if (lowerQ.includes('sort')) return ['Comparison-based', 'Divide & Conquer', 'In-place vs Out-place']
      if (lowerQ.includes('search')) return ['Linear', 'Binary', 'Hash-based']
      if (lowerQ.includes('tree')) return ['Binary Trees', 'BST', 'AVL', 'B-Trees']
      if (lowerQ.includes('learning') || lowerQ.includes('ml')) return ['Supervised', 'Unsupervised', 'Reinforcement']
      if (lowerQ.includes('database')) return ['Relational', 'NoSQL', 'NewSQL']
      if (lowerQ.includes('network')) return ['TCP/IP', 'HTTP/HTTPS', 'WebSocket']
      return ['Basic Concepts', 'Intermediate Topics', 'Advanced Patterns']
    }
    
    const extractApplications = () => {
      if (lowerQ.includes('sort')) return ['Data organization', 'Search optimization', 'Database indexing']
      if (lowerQ.includes('search')) return ['Data retrieval', 'Pattern matching', 'Information systems']
      if (lowerQ.includes('learning') || lowerQ.includes('ai')) return ['Predictions', 'Classification', 'Recommendation systems']
      if (lowerQ.includes('database')) return ['Web applications', 'Analytics', 'Transaction processing']
      if (lowerQ.includes('web')) return ['Websites', 'APIs', 'Mobile backends']
      return ['Software development', 'System design', 'Problem solving']
    }
    
    const extractAdvanced = () => {
      if (lowerQ.includes('sort') || lowerQ.includes('algorithm')) return ['Optimization techniques', 'Parallel algorithms', 'Big O analysis']
      if (lowerQ.includes('learning') || lowerQ.includes('ai')) return ['Deep learning', 'Transfer learning', 'Model optimization']
      if (lowerQ.includes('database')) return ['Sharding', 'Replication', 'ACID guarantees']
      if (lowerQ.includes('network')) return ['Load balancing', 'CDN', 'Security']
      return ['Performance tuning', 'Scalability patterns', 'Best practices']
    }
    
    return {
      central: question,
      branches: [
        {
          title: 'Core Concepts',
          color: 'bg-blue-500',
          items: extractConcepts()
        },
        {
          title: 'Practical Applications',
          color: 'bg-green-500',
          items: extractApplications()
        },
        {
          title: 'Advanced Topics',
          color: 'bg-purple-500',
          items: extractAdvanced()
        },
        {
          title: 'Related Technologies',
          color: 'bg-orange-500',
          items: lowerQ.includes('python') ? ['NumPy', 'Pandas', 'scikit-learn'] :
                 lowerQ.includes('javascript') ? ['Node.js', 'React', 'Express'] :
                 lowerQ.includes('java') ? ['Spring', 'Hibernate', 'Maven'] :
                 lowerQ.includes('database') ? ['PostgreSQL', 'MongoDB', 'Redis'] :
                 ['Libraries', 'Frameworks', 'Tools']
        }
      ]
    }
  }

  const generateDetailedExplanation = (question) => {
    const lowerQ = question.toLowerCase()
    
    const getIntroduction = () => {
      if (lowerQ.includes('sort')) return `Sorting algorithms are fundamental to computer science, enabling efficient data organization. ${question} works by systematically arranging elements in a specific order (ascending or descending) through comparison and swapping operations. Understanding sorting is crucial for optimizing search operations and data processing.`
      if (lowerQ.includes('search')) return `Search algorithms are essential for finding specific elements within datasets. ${question} provides a methodical approach to locate target values efficiently. The choice of search algorithm dramatically impacts performance, especially with large datasets.`
      if (lowerQ.includes('tree') || lowerQ.includes('graph')) return `${question} is a non-linear data structure that represents hierarchical relationships. Trees and graphs are powerful tools for modeling complex relationships in data, from file systems to social networks. Understanding their properties enables efficient traversal and manipulation.`
      if (lowerQ.includes('learning') || lowerQ.includes('ai') || lowerQ.includes('ml')) return `${question} represents a paradigm shift in how computers solve problems - by learning from data rather than explicit programming. Machine learning algorithms identify patterns and make predictions, revolutionizing fields from healthcare to finance.`
      if (lowerQ.includes('database') || lowerQ.includes('sql')) return `${question} is fundamental to data management and persistence. Databases provide structured, efficient, and reliable storage solutions. Understanding database concepts ensures data integrity, optimal query performance, and scalability.`
      if (lowerQ.includes('network') || lowerQ.includes('http') || lowerQ.includes('api')) return `${question} involves the communication and data exchange between systems. Networking concepts are the backbone of modern distributed applications, enabling everything from web browsing to cloud computing.`
      return `Let's explore ${question} comprehensively. This concept plays a vital role in modern computing and software development. Understanding it deeply will enhance your problem-solving capabilities and technical expertise.`
    }
    
    const getDeepDive = () => {
      if (lowerQ.includes('sort')) return 'Sorting algorithms vary in their approach: comparison-based sorts (like QuickSort) compare elements directly, while non-comparison sorts (like Counting Sort) use other properties. Time complexity ranges from O(n²) for simple algorithms to O(n log n) for efficient ones. Space complexity determines if sorting happens in-place or requires additional memory. The choice depends on data characteristics, size, and whether stability matters.'
      if (lowerQ.includes('search')) return 'Search efficiency depends on data organization. Linear search works on any list but takes O(n) time. Binary search achieves O(log n) but requires sorted data. Hash-based search offers O(1) average case but needs extra space. Understanding these trade-offs helps select the right approach for your use case.'
      if (lowerQ.includes('learning') || lowerQ.includes('ai')) return 'Machine learning involves three main paradigms: supervised learning (labeled data), unsupervised learning (pattern discovery), and reinforcement learning (reward-based). The process includes data collection, preprocessing, feature engineering, model selection, training, validation, and deployment. Performance metrics like accuracy, precision, and recall guide optimization.'
      if (lowerQ.includes('database')) return 'Databases organize data into tables (relational) or documents/collections (NoSQL). SQL provides a declarative language for queries. Normalization reduces redundancy. Indexes speed up searches. Transactions ensure ACID properties. Understanding these principles enables building scalable, reliable data systems.'
      if (lowerQ.includes('oop') || lowerQ.includes('object')) return 'Object-Oriented Programming organizes code around objects containing data (attributes) and behavior (methods). Four pillars - Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (flexibility), and Abstraction (simplification) - enable modular, maintainable code. Classes serve as blueprints for objects.'
      return `Breaking down ${question} into components reveals its inner workings. Each piece serves a specific purpose, working together to achieve the overall functionality. Understanding the relationships between components is key to mastery.`
    }
    
    const getPractical = () => {
      if (lowerQ.includes('sort')) return 'In production systems, sorting is everywhere: displaying search results, organizing user data, preparing data for binary search, database query optimization, and scheduling tasks. Libraries provide optimized implementations (Python\'s sorted(), Java\'s Arrays.sort()), but understanding fundamentals helps debug issues and optimize edge cases.'
      if (lowerQ.includes('search')) return 'Search algorithms power search engines, autocomplete features, database queries, file system navigation, and game AI pathfinding. Real-world systems often combine multiple techniques: hash tables for fast lookups, binary search on sorted data, and specialized structures like tries for prefix matching.'
      if (lowerQ.includes('learning') || lowerQ.includes('ai')) return 'ML applications are ubiquitous: recommendation systems (Netflix, Amazon), voice assistants (Siri, Alexa), fraud detection, medical diagnosis, autonomous vehicles, and image recognition. Framework like TensorFlow, PyTorch, and scikit-learn provide pre-built algorithms. The key is preparing quality data and choosing appropriate models.'
      if (lowerQ.includes('database')) return 'Modern applications rely on databases for user accounts, transactions, analytics, caching, and session management. Web apps use ORMs (Object-Relational Mapping) to interact with databases. Choosing between SQL (structured, relational) and NoSQL (flexible, scalable) depends on data structure and access patterns. Cloud providers offer managed database services.'
      if (lowerQ.includes('web') || lowerQ.includes('api')) return 'Web technologies enable browser-server communication. Frontend frameworks (React, Vue, Angular) handle UI. Backend frameworks (Express, Django, Spring) process requests. RESTful APIs and GraphQL facilitate data exchange. Understanding HTTP, JSON, and async programming is essential for modern web development.'
      return `In professional software development, ${question} appears in various contexts. From building scalable applications to optimizing system performance, this concept provides practical solutions to real-world challenges. Industry best practices emphasize maintainability, efficiency, and robustness.`
    }
    
    return [
      {
        section: 'Introduction & Overview',
        text: getIntroduction()
      },
      {
        section: 'Deep Technical Analysis',
        text: getDeepDive()
      },
      {
        section: 'Real-World Applications',
        text: getPractical()
      }
    ]
  }

  const generateExamples = (question) => {
    const lowerQ = question.toLowerCase()
    
    const examples = []
    
    if (lowerQ.includes('binary search')) {
      examples.push({
        title: 'Example 1: Classic Binary Search',
        description: 'Find target element in sorted array using divide-and-conquer',
        code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid  # Found!\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1  # Not found\n\n# Example usage\nnums = [1, 3, 5, 7, 9, 11, 13]\nresult = binary_search(nums, 7)\nprint(f"Found at index: {result}")  # Output: 3`
      })
    } else if (lowerQ.includes('bubble sort')) {
      examples.push({
        title: 'Example 1: Bubble Sort Implementation',
        description: 'Sort array by repeatedly swapping adjacent elements',
        code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:  # Optimization\n            break\n    return arr\n\narr = [64, 34, 25, 12, 22]\nprint(bubble_sort(arr))  # [12, 22, 25, 34, 64]`
      })
    } else if (lowerQ.includes('linked list')) {
      examples.push({
        title: 'Example 1: Linked List Implementation',
        description: 'Create and traverse a singly linked list',
        code: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        current = self.head\n        while current.next:\n            current = current.next\n        current.next = new_node\n    \n    def display(self):\n        current = self.head\n        while current:\n            print(current.data, end=" -> ")\n            current = current.next\n        print("None")\n\n# Usage\nll = LinkedList()\nll.append(1)\nll.append(2)\nll.display()  # 1 -> 2 -> None`
      })
    } else if (lowerQ.includes('sql') || lowerQ.includes('database')) {
      examples.push({
        title: 'Example 1: SQL Query with JOIN',
        description: 'Retrieve data from multiple related tables',
        code: `-- Get all orders with customer information\nSELECT \n    customers.name,\n    customers.email,\n    orders.order_id,\n    orders.total_amount,\n    orders.order_date\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id\nWHERE orders.order_date >= '2025-01-01'\nORDER BY orders.order_date DESC;\n\n-- Create index for performance\nCREATE INDEX idx_order_date ON orders(order_date);`
      })
    } else if (lowerQ.includes('api') || lowerQ.includes('rest')) {
      examples.push({
        title: 'Example 1: REST API with Express.js',
        description: 'Create a simple REST API endpoint',
        code: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// GET endpoint\napp.get('/api/users/:id', (req, res) => {\n    const userId = req.params.id;\n    // Fetch from database\n    res.json({ id: userId, name: 'John' });\n});\n\n// POST endpoint\napp.post('/api/users', (req, res) => {\n    const newUser = req.body;\n    // Save to database\n    res.status(201).json(newUser);\n});\n\napp.listen(3000, () => {\n    console.log('Server running on port 3000');\n});`
      })
    } else if (lowerQ.includes('react') || lowerQ.includes('component')) {
      examples.push({
        title: 'Example 1: React Component',
        description: 'Build a functional component with hooks',
        code: `import React, { useState, useEffect } from 'react';\n\nfunction UserProfile({ userId }) {\n    const [user, setUser] = useState(null);\n    const [loading, setLoading] = useState(true);\n\n    useEffect(() => {\n        fetch(\`/api/users/\${userId}\`)\n            .then(res => res.json())\n            .then(data => {\n                setUser(data);\n                setLoading(false);\n            });\n    }, [userId]);\n\n    if (loading) return <div>Loading...</div>;\n\n    return (\n        <div className="profile">\n            <h2>{user.name}</h2>\n            <p>{user.email}</p>\n        </div>\n    );\n}\n\nexport default UserProfile;`
      })
    } else if (lowerQ.includes('machine learning') || lowerQ.includes('ml')) {
      examples.push({
        title: 'Example 1: Simple ML Classification',
        description: 'Train a classifier using scikit-learn',
        code: `from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\n# Prepare data\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# Train model\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# Make predictions\ny_pred = model.predict(X_test)\n\n# Evaluate\naccuracy = accuracy_score(y_test, y_pred)\nprint(f'Accuracy: {accuracy:.2f}')`
      })
    } else {
      examples.push({
        title: 'Example 1: Basic Implementation',
        description: `A practical demonstration of ${question}`,
        code: lowerQ.includes('python') ? 
          `# Python implementation\ndef solution(data):\n    """${question}"""\n    result = []\n    for item in data:\n        # Process logic here\n        result.append(item)\n    return result\n\n# Test\ndata = [1, 2, 3, 4, 5]\nprint(solution(data))` :
          lowerQ.includes('javascript') ?
          `// JavaScript implementation\nfunction solution(data) {\n    // ${question}\n    return data.map(item => {\n        // Process logic here\n        return item;\n    });\n}\n\n// Test\nconst data = [1, 2, 3, 4, 5];\nconsole.log(solution(data));` :
          `// Implementation example\nfunction example() {\n    // ${question}\n    return "Sample implementation";\n}`
      })
    }
    
    examples.push({
      title: 'Example 2: Advanced Use Case',
      description: `Production-ready implementation with error handling`,
      code: lowerQ.includes('python') ?
        `# Advanced implementation with validation\ndef advanced_solution(data):\n    if not data:\n        raise ValueError("Data cannot be empty")\n    \n    try:\n        result = process_data(data)\n        validate_result(result)\n        return result\n    except Exception as e:\n        log_error(e)\n        return default_value()` :
        `// Advanced implementation\nfunction advancedSolution(data) {\n    if (!data || data.length === 0) {\n        throw new Error('Invalid input');\n    }\n    \n    try {\n        const result = processData(data);\n        return validateResult(result);\n    } catch (error) {\n        console.error(error);\n        return getDefaultValue();\n    }\n}`
    })
    
    return examples
  }

  const generateComic = (question) => {
    return {
      panels: [
        {
          scene: 1,
          character: '👨‍🎓',
          dialogue: `What is ${question}?`,
          background: 'bg-blue-100',
          narration: 'Our curious student asks...'
        },
        {
          scene: 2,
          character: '🤖',
          dialogue: 'Let me explain it in a fun way!',
          background: 'bg-purple-100',
          narration: 'The AI Bot responds...'
        },
        {
          scene: 3,
          character: '💡',
          dialogue: 'Aha! Now I understand!',
          background: 'bg-yellow-100',
          narration: 'Understanding dawns...'
        },
        {
          scene: 4,
          character: '🎯',
          dialogue: 'Time to practice and master it!',
          background: 'bg-green-100',
          narration: 'Ready to apply the knowledge!'
        }
      ]
    }
  }

  const generateSummary = (question) => {
    return {
      keyTakeaways: [
        `${question} is a fundamental concept in modern technology`,
        'Understanding the theory helps in practical application',
        'Multiple perspectives provide deeper insight',
        'Practice and experimentation solidify learning'
      ],
      nextSteps: [
        'Practice with hands-on examples',
        'Explore related topics',
        'Build a project using this concept',
        'Teach others to reinforce understanding'
      ]
    }
  }

  const generateBotResources = (question) => {
    return [
      { name: 'Interactive Tutorial', url: 'https://www.khanacademy.org/', icon: '📚' },
      { name: 'Video Explanation', url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(question), icon: '🎥' },
      { name: 'Practice Problems', url: 'https://www.hackerrank.com/', icon: '💻' },
      { name: 'Documentation', url: 'https://developer.mozilla.org/', icon: '📖' }
    ]
  }

  const handleBotSubmit = (e) => {
    e.preventDefault()
    if (botQuestion.trim()) {
      generateAIAnswer(botQuestion.trim())
      setBotQuestion('')
    }
  }

  const nextPage = () => {
    if (botAnswer && currentPage < botAnswer.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const resetBot = () => {
    setBotAnswer(null)
    setCurrentPage(0)
  }
  
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      setBotHistory([])
      localStorage.removeItem('kramik_bot_history')
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'subjects', name: 'My Subjects', icon: '📚' },
    { id: 'quizai', name: 'AI Quiz', icon: '🧠' },
    { id: 'aibot', name: 'AI Learning Bot', icon: '🤖' },
    { id: 'assignments', name: 'Assignments', icon: '📝' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'schedule', name: 'Schedule', icon: '📅' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Banner */}
        {dashboardError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-bold text-red-800 mb-1">Dashboard Error</h4>
                <p className="text-sm text-red-700">{dashboardError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Profile */}
        {loadingProfile && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading your profile...</p>
            </div>
          </div>
        )}

        {!loadingProfile && (
          <>
            {/* Date, Time & Motivational Quote Banner */}
            <div className={`mb-6 ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}>
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-3 md:mb-0">
                    <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm font-semibold opacity-90">📅 {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm font-semibold opacity-90">🕐 {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">💡</span>
                    <div className="flex-1">
                      <p className="text-lg font-semibold mb-1">Daily Motivation</p>
                      <p className="text-white text-opacity-95 italic leading-relaxed">"{dailyQuote.text}"</p>
                      <p className="text-sm text-white text-opacity-75 mt-2">— {dailyQuote.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Header */}
            <div className={`mb-8 ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                    Welcome back, <span className="gradient-text">{(studentData.name && studentData.name.split(' ')[0]) || 'Student'}</span>! 👋
                  </h1>
                  <p className="text-lg text-gray-600">Here's what's happening with your studies today</p>
                </div>
            <div className="mt-4 md:mt-0">
              <button 
                type="button"
                onClick={() => {
                  // Initialize edit form with current data
                  setEditFormData({
                    name: studentData?.name || '',
                    enrollmentId: studentData?.enrollmentId || '',
                    course: studentData?.course || '',
                    college: studentData?.college || '',
                    semester: studentData?.semester || '',
                    year: studentData?.year || '',
                    gpa: studentData.gpa,
                    phone: studentData.phone,
                    address: studentData.address,
                    bio: studentData.bio,
                    selectedSubjects: studentData.selectedSubjects || [],
                    socialLinks: studentData.socialLinks || { linkedin: '', github: '', twitter: '' }
                  })
                  setShowProfileEditor(true)
                  console.log('📝 Opening Profile Editor')
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                📝 Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Current GPA</p>
                <p className="text-3xl font-bold text-blue-600">{studentData.gpa}</p>
              </div>
              <div className="text-4xl">🎓</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Attendance</p>
                <p className="text-3xl font-bold text-green-600">
                  {attendanceStats ? `${attendanceStats.percentage.toFixed(1)}%` : '0%'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {attendanceStats ? `${attendanceStats.presentDays}/${attendanceStats.workingDays} days` : 'Loading...'}
                </p>
              </div>
              <div className="text-4xl cursor-pointer" onClick={() => setShowAttendanceModal(true)} title="View details">✅</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Credits</p>
                <p className="text-3xl font-bold text-purple-600">{calculateCompletedCredits()}/{calculateTotalCredits()}</p>
                <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Active Subjects</p>
                <p className="text-3xl font-bold text-orange-600">{subjects.length}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className={`mb-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log('Tab clicked:', tab.id)
                    setActiveTab(tab.id)
                  }}
                  type="button"
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className={`glass-effect p-8 rounded-2xl shadow-xl sticky top-24 ${isVisible ? 'animate-fadeInLeft' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <span className="text-5xl text-white font-bold">
                        {(studentData?.name && studentData.name.charAt(0)) || 'S'}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">Student Profile</h3>
                </div>
                
                <div className="space-y-3 text-gray-700">
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-semibold">Full Name</p>
                    <p className="font-bold text-gray-800 break-words">{studentData?.name || '-'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-semibold">Enrollment ID</p>
                    <p className="font-bold text-gray-800 break-all">{studentData?.enrollmentId || '-'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-semibold">Email</p>
                    <p className="font-bold text-gray-800 text-sm break-all overflow-hidden">{studentData?.email || '-'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-semibold">Course</p>
                    <p className="font-bold text-gray-800 break-words">{studentData?.course || '-'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-semibold">College</p>
                    <p className="font-bold text-gray-800 break-words">{studentData?.college || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl text-center">
                      <p className="text-xs text-gray-500 font-semibold">Year</p>
                      <p className="text-xl font-bold text-indigo-600">{studentData?.year || '-'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl text-center">
                      <p className="text-xs text-gray-500 font-semibold">Semester</p>
                      <p className="text-xl font-bold text-purple-600">{studentData?.semester?.split(' ')[0] || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Deadlines */}
              <div className={`glass-effect p-6 rounded-2xl shadow-xl ${isVisible ? 'animate-fadeInRight' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3">⏰</span>
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((deadline, index) => (
                    <div
                      key={index}
                      className={`bg-white p-4 rounded-xl flex items-center justify-between border-l-4 ${
                        deadline.priority === 'high' ? 'border-red-500' :
                        deadline.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">{deadline.task}</p>
                        <p className="text-sm text-gray-600">{deadline.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          deadline.priority === 'high' ? 'text-red-600' :
                          deadline.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {deadline.due}
                        </p>
                        <p className="text-xs text-gray-500">remaining</p>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white p-6 rounded-xl text-center">
                      <p className="text-green-600 font-semibold">🎉 All caught up! No pending deadlines.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`glass-effect p-6 rounded-2xl shadow-xl ${isVisible ? 'animate-fadeInRight' : 'opacity-0'}`} style={{ animationDelay: '700ms' }}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3">📋</span>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl flex items-start space-x-4">
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {activity.action} <span className="text-indigo-600">{activity.item}</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{activity.time}</p>
                          {activity.points && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              +{activity.points} pts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white p-6 rounded-xl text-center">
                      <p className="text-gray-500">No recent activity yet. Complete assignments to see your progress!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className={`glass-effect p-6 rounded-2xl shadow-xl ${isVisible ? 'animate-fadeInRight' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3">🏆</span>
                  Your Achievements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`bg-${achievement.color}-50 border-2 border-${achievement.color}-200 p-4 rounded-xl text-center transform hover:scale-105 transition-all duration-300`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h4 className="font-bold text-gray-800 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            {/* AI Subjective Website Links Section */}
            {websiteLinks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-3">🌐</span>
                    AI Subjective Resources
                  </h3>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    {websiteLinks.length} {websiteLinks.length === 1 ? 'Link' : 'Links'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {websiteLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group cursor-pointer"
                    >
                      <div className="glass-effect p-5 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-green-500 h-full">
                        <div className="flex items-start justify-between mb-3">
                          <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                            {link.category}
                          </span>
                          <span className="text-2xl">🔗</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                          {link.title}
                        </h4>
                        {link.description && (
                          <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                        )}
                        <p className="text-xs text-green-500 flex items-center font-semibold">
                          <span className="mr-1">🌐</span>
                          <span className="group-hover:text-green-700 transition-colors">Visit Website →</span>
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* My Courses Section */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📚</span>
                My Courses
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <a
                  key={index}
                  href={subject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => console.log('Subject card clicked:', subject.name)}
                  className="block group cursor-pointer"
                  style={{ pointerEvents: 'auto', zIndex: 1 }}
                >
                  <div className={`glass-effect p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 ${subject.borderColor} h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`${subject.bgColor} text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md`}>
                        {subject.code}
                      </span>
                      <span className="text-2xl font-bold text-green-600">{subject.grade}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">{subject.name}</h4>
                    
                    <p className="text-xs text-gray-500 mb-3">{subject.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>📅 {subject.nextClass}</span>
                      <span>📖 {subject.credits} credits</span>
                    </div>
                    <p className="text-xs text-indigo-500 flex items-center font-semibold">
                      <span className="mr-1">🔗</span> 
                      <span className="group-hover:text-indigo-700 transition-colors">Visit Course Website →</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* AI Quiz Tab */}
        {activeTab === 'quizai' && (
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            {!quizSubject ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">🧠 AI-Powered Quiz Challenge</h2>
                  <p className="text-gray-600">Select a subject to start your learning journey. Answer questions correctly to earn points and unlock new difficulty levels!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizSubjects.map((subject, index) => {
                    const savedProgress = localStorage.getItem(`kramik_quiz_${subject.code}`)
                    const progress = savedProgress ? JSON.parse(savedProgress) : { points: 0, level: 'Beginner' }
                    
                    return (
                      <div
                        key={index}
                        onClick={() => startQuiz(subject)}
                        className={`glass-effect p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 ${subject.borderColor} cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className={`${subject.color} text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md`}>
                            {subject.code}
                          </span>
                          <span className="text-4xl">{subject.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Current Level:</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              progress.level === 'Expert' ? 'bg-red-100 text-red-700' :
                              progress.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                              progress.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>{progress.level}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Points:</span>
                            <span className="text-xl font-bold text-indigo-600">{progress.points}</span>
                          </div>
                        </div>
                        <button className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all">
                          Start Quiz →
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="max-w-4xl mx-auto">
                {/* Quiz Header */}
                <div className="glass-effect p-6 rounded-2xl shadow-xl mb-6 border-l-4 border-indigo-600">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="text-3xl mr-3">{quizSubject.icon}</span>
                        {quizSubject.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Keep answering to level up!</p>
                    </div>
                    <button
                      onClick={exitQuiz}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all"
                    >
                      Exit Quiz
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl text-center">
                      <p className="text-sm text-gray-600">Level</p>
                      <p className={`text-2xl font-bold ${
                        quizLevel === 'Expert' ? 'text-red-600' :
                        quizLevel === 'Advanced' ? 'text-purple-600' :
                        quizLevel === 'Intermediate' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>{quizLevel}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center">
                      <p className="text-sm text-gray-600">Points</p>
                      <p className="text-2xl font-bold text-indigo-600">{quizPoints}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center">
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-2xl font-bold text-orange-600">{questionsAnswered}</p>
                    </div>
                  </div>
                </div>

                {/* Question Card */}
                {currentQuestion && (
                  <div className="glass-effect p-8 rounded-2xl shadow-xl mb-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.q}</h3>
                      
                      {currentQuestion.options ? (
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => setUserAnswer(option)}
                              disabled={showQuizResult}
                              className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                                userAnswer === option
                                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              } ${showQuizResult ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                                showQuizResult && option === currentQuestion.a
                                  ? 'bg-green-500 text-white'
                                  : showQuizResult && option === userAnswer && !lastAnswerCorrect
                                  ? 'bg-red-500 text-white'
                                  : ''
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={showQuizResult}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                          placeholder="Type your answer here..."
                        />
                      )}
                    </div>

                    {showQuizResult && (
                      <div className={`p-4 rounded-xl mb-4 ${lastAnswerCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className={`font-bold text-lg ${lastAnswerCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {lastAnswerCorrect ? '✅ Correct! +1 point' : '❌ Incorrect! -1 point'}
                        </p>
                        {!lastAnswerCorrect && (
                          <p className="text-sm text-gray-700 mt-1">
                            Correct answer: <span className="font-bold">{currentQuestion.a}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      {!showQuizResult ? (
                        <button
                          onClick={submitAnswer}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={nextQuestion}
                          className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
                        >
                          Next Question →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Achievements Section */}
                {quizAchievements.length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Your Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizAchievements.slice(-6).reverse().map((achievement, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-500">
                          <div className="flex items-start space-x-3">
                            <span className="text-3xl">{achievement.icon}</span>
                            <div>
                              <p className="font-bold text-gray-800">{achievement.title}</p>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(achievement.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quiz History */}
                {quizHistory.length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">📜</span>
                      Recent Questions (Last 5)
                    </h3>
                    <div className="space-y-3">
                      {quizHistory.slice(-5).reverse().map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-xl ${item.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className="font-semibold text-gray-800 mb-1">{item.question}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className={item.correct ? 'text-green-700' : 'text-red-700'}>
                              Your answer: <strong>{item.userAnswer}</strong>
                            </span>
                            <span className="text-gray-600 text-xs">{item.level}</span>
                          </div>
                          {!item.correct && (
                            <p className="text-sm text-gray-600 mt-1">
                              Correct: <strong>{item.correctAnswer}</strong>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Learning Bot Tab */}
        {activeTab === 'aibot' && (
          <AIBotTab
            isVisible={isVisible}
            botQuestion={botQuestion}
            setBotQuestion={setBotQuestion}
            handleBotSubmit={handleBotSubmit}
            isGenerating={isGenerating}
            botAnswer={botAnswer}
            resetBot={resetBot}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
            botHistory={botHistory}
            setBotAnswer={setBotAnswer}
            setCurrentPage={setCurrentPage}
            clearHistory={clearHistory}
          />
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className={`space-y-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            {/* Get all assignments */}
            {(() => {
              const filteredAssignments = assignments;
              
              const filteredCompleted = filteredAssignments.filter(a => a.completion_status === 'completed');
              const filteredPoints = filteredCompleted.reduce((sum, a) => sum + (a.earnedPoints || 0), 0);

              return (
                <>
                  {/* Header with Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-effect p-6 rounded-xl border-l-4 border-purple-500">
                      <p className="text-gray-600 text-sm font-semibold">Total Tasks</p>
                      <p className="text-3xl font-bold text-purple-600">{filteredAssignments.length}</p>
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="glass-effect p-6 rounded-xl border-l-4 border-green-500">
                      <p className="text-gray-600 text-sm font-semibold">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{filteredCompleted.length}</p>
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="glass-effect p-6 rounded-xl border-l-4 border-orange-500">
                      <p className="text-gray-600 text-sm font-semibold">Pending</p>
                      <p className="text-3xl font-bold text-orange-600">{filteredAssignments.length - filteredCompleted.length}</p>
                      <span className="text-2xl">⏳</span>
                    </div>
                    <div className="glass-effect p-6 rounded-xl border-l-4 border-blue-500">
                      <p className="text-gray-600 text-sm font-semibold">Credit Points</p>
                      <p className="text-3xl font-bold text-blue-600">{earnedPoints}</p>
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>

                  {/* Assignments List */}
                  {filteredAssignments.length === 0 ? (
                    <div className="glass-effect p-12 rounded-2xl text-center">
                      <span className="text-6xl mb-4 block">📭</span>
                      <p className="text-xl text-gray-600">No assignments available yet</p>
                      <p className="text-gray-500 mt-2">Your instructor will upload assignments soon</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredAssignments.map((assignment) => {
                  const assignmentId = assignment.id || assignment._id?.toString();
                  const isCompleted = assignment.completion_status === 'completed';
                  const dueDate = new Date(assignment.dueDate || assignment.due_date);
                  const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={assignmentId}
                      className={`glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                        isCompleted ? 'border-green-500 bg-green-50' : 
                        daysLeft < 0 ? 'border-red-500' :
                        daysLeft <= 3 ? 'border-orange-500' :
                        'border-blue-500'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <span className="text-4xl">
                              {assignment.type === 'assignment' && '📝'}
                              {assignment.type === 'project' && '🚀'}
                              {assignment.type === 'lab' && '🧪'}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                  {assignment.subjectCode}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                  🏆 {assignment.creditPoints} Points
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  assignment.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                  assignment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {assignment.difficulty}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  isCompleted ? 'bg-green-100 text-green-700' :
                                  daysLeft < 0 ? 'bg-red-100 text-red-700' :
                                  daysLeft <= 3 ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {isCompleted ? '✅ Completed' :
                                   daysLeft < 0 ? '❌ Overdue' :
                                   daysLeft === 0 ? '⏰ Due Today' :
                                   daysLeft === 1 ? '⏰ Due Tomorrow' :
                                   `📅 ${daysLeft} days left`}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">{assignment.description}</p>
                              <p className="text-sm text-gray-500">
                                📎 {assignment.fileName || 'Document'} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              console.log('📋 Opening assignment:', assignment);
                              console.log('📎 File info:', { fileUrl: assignment.fileUrl, fileName: assignment.fileName });
                              setSelectedAssignment(assignment)
                              setShowAssignmentModal(true)
                              setAiAnalysis('')
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold shadow-lg"
                          >
                            👁️ View & Analyze
                          </button>
                          {!isCompleted && (
                            <button
                              onClick={() => handleCompleteAssignment(assignment.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg"
                            >
                              ✅ Mark Complete
                            </button>
                          )}
                          {isCompleted && (
                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                              ✓ Done
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        );
      })()}
    </div>
  )}

        {activeTab === 'progress' && (
          <div className={`space-y-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Progress */}
              <div className="glass-effect p-6 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Overall Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">Course Completion</span>
                      <span className="font-bold text-indigo-600">{Math.round((studentData.creditsCompleted / studentData.totalCredits) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full"
                        style={{ width: `${(studentData.creditsCompleted / studentData.totalCredits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <p className="text-3xl font-bold text-blue-600">{studentData.gpa}</p>
                      <p className="text-sm text-gray-600">Current GPA</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <p className="text-3xl font-bold text-green-600">{studentData.attendance}</p>
                      <p className="text-sm text-gray-600">Attendance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Progress */}
              <div className="glass-effect p-6 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Skill Development</h3>
                <div className="flex flex-wrap gap-3">
                  {studentData.skills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (window.confirm(`🗑️ Remove "${skill}" from your skills?`)) {
                          const updatedSkills = studentData.skills.filter((_, i) => i !== index)
                          setStudentData(prev => ({
                            ...prev,
                            skills: updatedSkills
                          }))
                          console.log('❌ Skill Removed:', {
                            removedSkill: skill,
                            remainingSkills: updatedSkills,
                            totalSkills: updatedSkills.length,
                            timestamp: new Date().toISOString()
                          })
                          alert(`✅ Skill "${skill}" removed successfully!`)
                        }
                      }}
                      className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
                      title="Click to remove this skill"
                    >
                      <span>{skill}</span>
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                    </button>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const newSkill = prompt('🎯 Enter new skill name:\n\nExamples: JavaScript, Docker, AWS, React Native')
                    if (newSkill && newSkill.trim()) {
                      const trimmedSkill = newSkill.trim()
                      
                      // Validate skill name
                      if (trimmedSkill.length < 2) {
                        alert('❌ Skill name must be at least 2 characters long')
                        return
                      }
                      
                      if (trimmedSkill.length > 30) {
                        alert('❌ Skill name is too long (max 30 characters)')
                        return
                      }
                      
                      // Check for duplicates
                      if (studentData.skills.some(skill => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
                        alert('⚠️ This skill already exists in your profile!')
                        return
                      }
                      
                      // Add skill
                      const updatedSkills = [...studentData.skills, trimmedSkill]
                      setStudentData(prev => ({
                        ...prev,
                        skills: updatedSkills
                      }))
                      
                      // Log the skill addition
                      console.log('✅ Skill Added:', {
                        skill: trimmedSkill,
                        totalSkills: updatedSkills.length,
                        allSkills: updatedSkills,
                        timestamp: new Date().toISOString()
                      })
                      
                      alert(`✅ Skill "${trimmedSkill}" added successfully!\n\nTotal skills: ${updatedSkills.length}`)
                    } else if (newSkill !== null) {
                      alert('⚠️ Please enter a valid skill name')
                    }
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                >
                  ➕ Add New Skill
                </button>
              </div>
            </div>

            {/* Blockchain Verification Stats */}
            {isConnected && blockchainStats && (
              <div className="glass-effect p-6 rounded-2xl shadow-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="text-2xl mr-2">🔗</span>
                    Blockchain Verified Records
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    ✓ VERIFIED
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Your academic achievements are permanently recorded on the blockchain</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-200">
                    <p className="text-3xl font-bold text-indigo-600">{blockchainStats.totalCredits}</p>
                    <p className="text-xs text-gray-600 mt-1">Credits On-Chain</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">{blockchainStats.quizzesTaken}</p>
                    <p className="text-xs text-gray-600 mt-1">Quizzes Verified</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-xl text-center border border-pink-200">
                    <p className="text-3xl font-bold text-pink-600">{blockchainStats.completedSchedules}</p>
                    <p className="text-xs text-gray-600 mt-1">Schedules Verified</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                    <p className="text-2xl font-bold text-green-600">
                      {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Wallet Address</p>
                  </div>
                </div>
                {blockchainStats.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Last updated: {new Date(blockchainStats.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {!isConnected && (
              <div className="glass-effect p-6 rounded-2xl shadow-xl border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🔐</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Connect Wallet for Blockchain Verification</h3>
                    <p className="text-sm text-gray-600">Connect your wallet to record achievements permanently on the blockchain</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subject-wise Progress */}
            <div className="glass-effect p-6 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Subject-wise Progress</h3>
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{subject.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-green-600">{subject.grade}</span>
                        <span className="text-sm font-bold text-indigo-600">{subject.progress}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${subject.bgColor} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className={`glass-effect p-6 rounded-2xl shadow-xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Schedule</h3>
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 rounded-xl flex flex-wrap md:flex-nowrap items-center justify-between border-l-4 ${subject.borderColor} gap-4`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${subject.bgColor} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {(subject.code || 'GEN').slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{subject.name}</p>
                      <p className="text-sm text-gray-600">{subject.code || 'Code TBD'}</p>
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-gray-600 space-y-1">
                    {subject.instructor && <p className="flex items-center gap-2">👩‍🏫 <span>{subject.instructor}</span></p>}
                    {subject.location && <p className="flex items-center gap-2">📍 <span>{subject.location}</span></p>}
                    {subject.semester && <p className="flex items-center gap-2">📘 <span>{subject.semester}</span></p>}
                  </div>
                  <div className="text-right flex flex-col items-end space-y-2">
                    <div>
                      <p className="font-bold text-indigo-600">{subject.nextClass}</p>
                      <p className="text-xs text-gray-500">🎓 {subject.credits} credits</p>
                    </div>
                    {subject.resourceUrl && (
                      <a
                        href={subject.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>🔗</span>
                        <span>Open Resource</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleScheduleComplete(subject.scheduleId, subject.credits, subject.completionStatus === 'completed')}
                      disabled={subject.completionStatus === 'completed' || completingSchedule === subject.scheduleId}
                      className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        subject.completionStatus === 'completed'
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : completingSchedule === subject.scheduleId
                            ? 'bg-gray-200 text-gray-600 cursor-wait'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {subject.completionStatus === 'completed'
                        ? '✅ Credits Claimed'
                        : completingSchedule === subject.scheduleId
                          ? 'Claiming...'
                          : 'Claim Credits'}
                    </button>
                    {subject.completionStatus === 'completed' && subject.completedAt && (
                      <p className="text-[11px] text-green-600">
                        Completed {new Date(subject.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* Profile Editor Modal */}
      {showProfileEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ animation: 'scaleIn 0.3s ease-out' }}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <span>📝</span>
                  <span>Update Profile</span>
                </h2>
                <button
                  onClick={() => setShowProfileEditor(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-indigo-100 mt-2">Edit your information and the dashboard will update automatically</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!studentData.profileCompleted && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-1">Complete Your Profile</h4>
                      <p className="text-sm text-yellow-700">
                        Some required fields are missing. Please fill them in to unlock all features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault()
                
                try {
                  // Prepare update data
                  const updateData = {
                    name: editFormData.name?.trim(),
                    enrollmentId: editFormData.enrollmentId?.trim(),
                    course: editFormData.course?.trim(),
                    college: editFormData.college?.trim(),
                    semester: editFormData.semester?.trim(),
                    year: editFormData.year?.trim(),
                    gpa: editFormData.gpa,
                    phone: editFormData.phone?.trim(),
                    address: editFormData.address?.trim(),
                    bio: editFormData.bio?.trim(),
                    socialLinks: editFormData.socialLinks,
                    selectedSubjects: editFormData.selectedSubjects || studentData.selectedSubjects || []
                  }
                  
                  // Remove undefined/empty fields
                  Object.keys(updateData).forEach(key => {
                    if (!updateData[key] || updateData[key] === '') {
                      delete updateData[key]
                    }
                  })
                  
                  console.log('📤 Updating profile:', updateData)
                  
                  const response = await studentAPI.updateProfile(updateData)
                  console.log('✅ Profile updated:', response.data)
                  
                  // Update local state - backend returns user data directly, not nested
                  const updatedProfile = {
                    name: response.data?.name || studentData?.name || '',
                    email: response.data?.email || studentData?.email || '',
                    enrollmentId: response.data?.enrollmentId || studentData?.enrollmentId || '',
                    course: response.data?.course || studentData?.course || '',
                    college: response.data?.college || studentData?.college || '',
                    semester: response.data?.semester || studentData?.semester || '',
                    year: response.data?.year || studentData?.year || '',
                    gpa: response.data?.gpa || studentData?.gpa || '',
                    creditsCompleted: response.data?.creditsCompleted || studentData?.creditsCompleted || 0,
                    totalCredits: response.data?.totalCredits || studentData?.totalCredits || 160,
                    skills: response.data?.skills || studentData?.skills || [],
                    selectedSubjects: response.data?.selectedSubjects || studentData?.selectedSubjects || [],
                    joinedDate: response.data?.joinedDate || studentData?.joinedDate || '',
                    phone: response.data?.phone || studentData?.phone || '',
                    address: response.data?.address || studentData?.address || '',
                    bio: response.data?.bio || studentData?.bio || '',
                    profileImage: response.data?.profileImage || studentData?.profileImage || '',
                    socialLinks: response.data?.socialLinks || studentData?.socialLinks || { linkedin: '', github: '', twitter: '' },
                    profileCompleted: response.data?.profileCompleted || false
                  }
                  
                  setStudentData(updatedProfile)
                  
                  alert('✅ Profile updated successfully!')
                  setShowProfileEditor(false)
                } catch (error) {
                  console.error('Failed to update profile:', error)
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
                      value={editFormData.name || studentData.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={studentData.email || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enrollment ID *
                      {!studentData.enrollmentId && profileSuggestions.suggestedEnrollmentId && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Suggested: {profileSuggestions.suggestedEnrollmentId})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={editFormData.enrollmentId || studentData.enrollmentId || ''}
                      onChange={(e) => setEditFormData({...editFormData, enrollmentId: e.target.value})}
                      placeholder={profileSuggestions.suggestedEnrollmentId || 'Enter enrollment ID'}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        !studentData.enrollmentId ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || studentData.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  {/* Academic Information */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>🏫</span>
                      <span>Academic Information</span>
                    </h3>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                    <input
                      type="text"
                      value={editFormData.course || studentData.course || ''}
                      onChange={(e) => setEditFormData({...editFormData, course: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        !studentData.course ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      placeholder="B.Tech Computer Science & Engineering"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      College/University *
                      {!studentData.college && profileSuggestions.suggestedCollege && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Suggested: {profileSuggestions.suggestedCollege})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={editFormData.college || studentData.college || ''}
                      onChange={(e) => setEditFormData({...editFormData, college: e.target.value})}
                      placeholder={profileSuggestions.suggestedCollege || 'Enter college/university name'}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        !studentData.college ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                    <select
                      value={editFormData.year || studentData.year || ''}
                      onChange={(e) => setEditFormData({...editFormData, year: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        !studentData.year ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Semester *</label>
                    <select
                      value={editFormData.semester || studentData.semester || ''}
                      onChange={(e) => setEditFormData({...editFormData, semester: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        !studentData.semester ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GPA (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={editFormData.gpa || studentData.gpa || ''}
                      onChange={(e) => setEditFormData({...editFormData, gpa: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="8.7"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Credits Completed (Auto-calculated)</label>
                    <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold">
                      {studentData.creditsCompleted || 0} / {studentData.totalCredits || 160}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>📝</span>
                      <span>Additional Information</span>
                    </h3>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address || studentData.address || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="City, State, Country"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={editFormData.bio || studentData.bio || ''}
                      onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                  </div>
                  
                  {/* Social Links */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>🔗</span>
                      <span>Social Links</span>
                    </h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={editFormData.socialLinks?.linkedin || studentData.socialLinks?.linkedin || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        socialLinks: { ...editFormData.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={editFormData.socialLinks?.github || studentData.socialLinks?.github || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        socialLinks: { ...editFormData.socialLinks, github: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={editFormData.socialLinks?.twitter || studentData.socialLinks?.twitter || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        socialLinks: { ...editFormData.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>

                  {/* Subject Selection for AI Quiz */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>🧠</span>
                      <span>AI Quiz Subjects Selection</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Select the subjects you want to practice in the AI Quiz system. These will be your available quiz topics.</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                      {allQuizSubjects.map((subject) => {
                        const isSelected = (editFormData.selectedSubjects || studentData.selectedSubjects || []).includes(subject.code)
                        return (
                          <label
                            key={subject.code}
                            className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                              isSelected
                                ? `${subject.color} text-white border-transparent`
                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentSelected = editFormData.selectedSubjects || studentData.selectedSubjects || []
                                const newSelected = e.target.checked
                                  ? [...currentSelected, subject.code]
                                  : currentSelected.filter(code => code !== subject.code)
                                setEditFormData({...editFormData, selectedSubjects: newSelected})
                              }}
                              className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{subject.code}</p>
                              <p className="text-xs opacity-90 truncate">{subject.name}</p>
                              <p className="text-xs opacity-75">{subject.semester} Sem</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {(editFormData.selectedSubjects || studentData.selectedSubjects || []).length} subjects
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowProfileEditor(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    💾 Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal with AI Analysis */}
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedAssignment.title}</h2>
                  <p className="text-blue-100">{selectedAssignment.subject} • {selectedAssignment.subjectCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Assignment Details */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Assignment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-bold text-gray-800 capitalize">{selectedAssignment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className={`font-bold ${
                      selectedAssignment.difficulty === 'Easy' ? 'text-green-600' :
                      selectedAssignment.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{selectedAssignment.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Credit Points</p>
                    <p className="font-bold text-purple-600">🏆 {selectedAssignment.creditPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-bold text-gray-800">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{selectedAssignment.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Document</p>
                  {selectedAssignment.fileUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-gray-200">
                        <span className="text-2xl">📎</span>
                        <span className="font-semibold text-gray-700 flex-1">{selectedAssignment.fileName || 'Assignment File'}</span>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={selectedAssignment.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-center font-semibold"
                        >
                          👁️ View Document
                        </a>
                        <a 
                          href={selectedAssignment.fileUrl} 
                          download={selectedAssignment.fileName || 'assignment'}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-center font-semibold"
                        >
                          📥 Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                      <span className="text-2xl">📄</span>
                      <span className="text-gray-500 italic">No file attached to this assignment</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>🤖</span>
                    <span>AI Assistant</span>
                  </h3>
                  {!aiAnalysis && !isAnalyzing && (
                    <button
                      onClick={() => analyzeWithAI(selectedAssignment)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
                    >
                      ✨ Analyze with AI
                    </button>
                  )}
                </div>

                {!aiAnalysis && !isAnalyzing && (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🤖</span>
                    <p className="text-gray-600 mb-2">Get AI-powered insights for this assignment</p>
                    <p className="text-sm text-gray-500">Click "Analyze with AI" to get recommendations, tips, and resources</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="animate-spin text-6xl mb-4">🔄</div>
                    <p className="text-gray-600 font-semibold">Analyzing assignment...</p>
                    <p className="text-sm text-gray-500 mt-2">AI is reviewing the content and generating insights</p>
                  </div>
                )}

                {aiAnalysis && (
                  <div className="bg-white p-6 rounded-lg shadow-inner">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {aiAnalysis}
                    </pre>
                    <button
                      onClick={() => analyzeWithAI(selectedAssignment)}
                      className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                    >
                      🔄 Regenerate Analysis
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedAssignment.completion_status !== 'completed' && (
                  <button
                    onClick={() => {
                      const assignmentId = selectedAssignment.id || selectedAssignment._id?.toString();
                      handleCompleteAssignment(assignmentId);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  >
                    ✅ Mark as Complete (+{selectedAssignment.creditPoints} pts)
                  </button>
                )}
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && attendanceStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">📅 Monthly Attendance Tracker</h2>
                <button
                  type="button"
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-green-100 mt-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="p-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{attendanceStats.presentDays}</div>
                    <div className="text-sm text-gray-600 mt-1">Present Days</div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{attendanceStats.absentDays}</div>
                    <div className="text-sm text-gray-600 mt-1">Absent Days</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{attendanceStats.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{getAttendanceStreak()}</div>
                    <div className="text-sm text-gray-600 mt-1">Current Streak</div>
                  </div>
                </div>
              </div>

              {/* Today's Status */}
              <div className={`mb-6 p-4 rounded-xl border-2 ${
                hasLoggedInToday() 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-3xl">{hasLoggedInToday() ? '✅' : '⏰'}</div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {hasLoggedInToday() 
                        ? '✅ Attendance Marked for Today!' 
                        : '⏰ Login to mark today\'s attendance'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Last login: {attendanceStats.lastLoginDate 
                        ? new Date(attendanceStats.lastLoginDate).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })
                        : 'Never'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📆 Monthly Calendar</h3>
                <MonthlyCalendar />
              </div>

              {/* Info */}
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">How it works:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Login once per day to mark attendance (multiple logins count as one)</li>
                      <li>Attendance resets automatically at the end of each month</li>
                      <li>Percentage calculated based on days elapsed this month</li>
                      <li>Build your streak by logging in consecutively</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Monthly Calendar Component
const MonthlyCalendar = () => {
  const calendarData = getMonthCalendarData()
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="bg-white rounded-xl p-4">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm font-semibold
              ${day.status === 'empty' ? 'bg-transparent' : ''}
              ${day.status === 'present' ? 'bg-green-500 text-white shadow-md' : ''}
              ${day.status === 'absent' ? 'bg-red-500 text-white shadow-md' : ''}
              ${day.status === 'future' ? 'bg-gray-100 text-gray-400' : ''}
              ${day.isToday ? 'ring-4 ring-blue-400' : ''}
            `}
          >
            {day.day > 0 && (
              <div className="text-center">
                <div>{day.day}</div>
                {day.status === 'present' && <div className="text-xs">✓</div>}
                {day.status === 'absent' && <div className="text-xs">✗</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-600">Future</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-4 border-blue-400 rounded"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

