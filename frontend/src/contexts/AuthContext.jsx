import React, { createContext, useContext, useState, useEffect } from 'react'
import { markTodayAttendance, getAttendanceStats } from '../utils/attendanceUtils'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('kramik_token')
      const storedUser = localStorage.getItem('kramik_user')
      
      if (token && storedUser) {
        // Simulate token verification - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const userData = JSON.parse(storedUser)
        setUser(userData)
        
        // Mark attendance on page refresh/reload if logged in as student
        if (userData.userType === 'student') {
          const attendanceResult = markTodayAttendance()
          if (!attendanceResult.alreadyMarked) {
            console.log('✅ Attendance marked on session restore')
          }
        }
      }
    } catch (error) {
      localStorage.removeItem('kramik_token')
      localStorage.removeItem('kramik_user')
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(credentials)
      const { user: userData, token } = response.data
      
      if (userData.userType === 'student') {
        // Mark attendance on login for students only
        const attendanceResult = markTodayAttendance()
        const stats = getAttendanceStats()
        
        console.log('📅 Login Attendance Update:', {
          markedToday: !attendanceResult.alreadyMarked,
          currentAttendance: `${stats.percentage}%`,
          presentDays: stats.presentDays,
          workingDays: stats.workingDays
        })
      }
      
      setUser(userData)
      localStorage.setItem('kramik_token', token)
      localStorage.setItem('kramik_user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(userData)
      const { user: newUser, token } = response.data
      
      if (newUser.userType === 'student') {
        // Mark attendance on registration for students
        const attendanceResult = markTodayAttendance()
        const stats = getAttendanceStats()
        
        console.log('📅 Registration Attendance Update:', {
          markedToday: !attendanceResult.alreadyMarked,
          currentAttendance: `${stats.percentage}%`,
          presentDays: stats.presentDays,
          workingDays: stats.workingDays
        })
      }
      
      setUser(newUser)
      localStorage.setItem('kramik_token', token)
      localStorage.setItem('kramik_user', JSON.stringify(newUser))
      
      return newUser
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const blockchainLogin = async (message, signature, userType) => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔗 Calling blockchain login API...', { 
        messagePreview: message.substring(0, 50),
        signaturePreview: signature.substring(0, 20),
        userType 
      })
      
      const response = await authAPI.blockchainLogin({ message, signature, userType })
      
      console.log('📦 Blockchain login response:', response.data)
      
      const { user: userData, token } = response.data
      
      if (userData.userType === 'student') {
        // Mark attendance on login for students
        const attendanceResult = markTodayAttendance()
        const stats = getAttendanceStats()
        
        console.log('📅 Blockchain Login Attendance Update:', {
          markedToday: !attendanceResult.alreadyMarked,
          currentAttendance: `${stats.percentage}%`,
          presentDays: stats.presentDays,
          workingDays: stats.workingDays
        })
      }
      
      setUser(userData)
      localStorage.setItem('kramik_token', token)
      localStorage.setItem('kramik_user', JSON.stringify(userData))
      
      console.log('✅ Blockchain login complete, user set in context')
      
      return userData
    } catch (error) {
      console.error('❌ Blockchain login failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      setError(error.message || 'Blockchain authentication failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('kramik_token')
    localStorage.removeItem('kramik_user')
  }

  const updateProfile = async (profileData) => {
    try {
      // Simulate profile update - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = {
        ...user,
        ...profileData
      }
      
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      setError('Profile update failed.')
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    blockchainLogin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.userType === 'admin',
    isStudent: user?.userType === 'student'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}