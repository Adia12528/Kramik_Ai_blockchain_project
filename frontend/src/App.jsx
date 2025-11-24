import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { BlockchainProvider } from './contexts/BlockchainContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/common/Header'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'

const AuthenticatedApp = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              !user ? (
                <Login />
              ) : user.userType === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login />
              ) : user.userType === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BlockchainProvider>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </BlockchainProvider>
  )
}

export default App