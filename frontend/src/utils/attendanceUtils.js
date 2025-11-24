// Attendance Tracking Utility Functions

/**
 * Get current month key (format: YYYY-MM)
 */
export const getCurrentMonthKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Get today's date key (format: YYYY-MM-DD)
 */
export const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get total days in current month
 */
export const getDaysInCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get total working days until today in current month
 */
export const getWorkingDaysUntilToday = () => {
  const now = new Date()
  const currentDay = now.getDate()
  return currentDay
}

/**
 * Initialize attendance data structure
 */
export const initializeAttendance = () => {
  const monthKey = getCurrentMonthKey()
  const storedData = localStorage.getItem('kramik_attendance')
  
  if (storedData) {
    const attendance = JSON.parse(storedData)
    
    // Check if we need to reset for new month
    if (attendance.currentMonth !== monthKey) {
      console.log('🔄 New month detected! Resetting attendance...')
      const newAttendance = createNewMonthAttendance()
      localStorage.setItem('kramik_attendance', JSON.stringify(newAttendance))
      return newAttendance
    }
    
    return attendance
  }
  
  // First time initialization
  const newAttendance = createNewMonthAttendance()
  localStorage.setItem('kramik_attendance', JSON.stringify(newAttendance))
  return newAttendance
}

/**
 * Create new month attendance structure
 */
const createNewMonthAttendance = () => {
  const monthKey = getCurrentMonthKey()
  return {
    currentMonth: monthKey,
    presentDays: [],
    lastLoginDate: null,
    totalDaysInMonth: getDaysInCurrentMonth(),
    createdAt: new Date().toISOString()
  }
}

/**
 * Mark attendance for today (only once per day)
 */
export const markTodayAttendance = () => {
  const todayKey = getTodayKey()
  const attendance = initializeAttendance()
  
  // Check if already marked present today
  if (attendance.presentDays.includes(todayKey)) {
    console.log('✅ Already marked present for today:', todayKey)
    return {
      success: true,
      alreadyMarked: true,
      attendance
    }
  }
  
  // Mark present for today
  attendance.presentDays.push(todayKey)
  attendance.lastLoginDate = todayKey
  
  // Save to localStorage
  localStorage.setItem('kramik_attendance', JSON.stringify(attendance))
  
  console.log('🎉 Attendance marked for:', todayKey)
  console.log('📊 Total present days this month:', attendance.presentDays.length)
  
  return {
    success: true,
    alreadyMarked: false,
    attendance
  }
}

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = () => {
  const attendance = initializeAttendance()
  const workingDays = getWorkingDaysUntilToday()
  const presentDays = attendance.presentDays.length
  
  if (workingDays === 0) return 0
  
  const percentage = (presentDays / workingDays) * 100
  return Math.round(percentage)
}

/**
 * Get attendance statistics
 */
export const getAttendanceStats = () => {
  const attendance = initializeAttendance()
  const workingDays = getWorkingDaysUntilToday()
  const presentDays = attendance.presentDays.length
  const absentDays = workingDays - presentDays
  const percentage = calculateAttendancePercentage()
  const totalDaysInMonth = attendance.totalDaysInMonth
  
  return {
    currentMonth: attendance.currentMonth,
    presentDays,
    absentDays,
    workingDays,
    totalDaysInMonth,
    percentage,
    lastLoginDate: attendance.lastLoginDate,
    allPresentDates: attendance.presentDays
  }
}

/**
 * Get calendar view data for current month
 */
export const getMonthCalendarData = () => {
  const attendance = initializeAttendance()
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = getDaysInCurrentMonth()
  const today = now.getDate()
  
  const calendar = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendar.push({ day: null, status: 'empty' })
  }
  
  // Add all days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    let status = 'future'
    
    if (day < today) {
      // Past days
      status = attendance.presentDays.includes(dateKey) ? 'present' : 'absent'
    } else if (day === today) {
      // Today
      status = attendance.presentDays.includes(dateKey) ? 'present-today' : 'absent-today'
    }
    
    calendar.push({ day, date: dateKey, status })
  }
  
  return {
    calendar,
    monthName: new Date(year, month).toLocaleString('default', { month: 'long' }),
    year
  }
}

/**
 * Check if user logged in today
 */
export const hasLoggedInToday = () => {
  const attendance = initializeAttendance()
  const todayKey = getTodayKey()
  return attendance.presentDays.includes(todayKey)
}

/**
 * Get attendance streak (consecutive days)
 */
export const getAttendanceStreak = () => {
  const attendance = initializeAttendance()
  const presentDays = attendance.presentDays.sort().reverse() // Most recent first
  
  if (presentDays.length === 0) return 0
  
  let streak = 0
  let currentDate = new Date()
  
  for (let i = 0; i < presentDays.length; i++) {
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    
    if (presentDays.includes(dateKey)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }
  
  return streak
}
