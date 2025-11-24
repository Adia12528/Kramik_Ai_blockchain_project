import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen text="Authenticating..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute