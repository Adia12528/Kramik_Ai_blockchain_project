import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useBlockchain } from '../../contexts/BlockchainContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { currentAccount, isConnected, connectWallet, loading: blockchainLoading } = useBlockchain()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleConnectWallet = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet. Make sure MetaMask is installed!')
    }
  }

  // Only show header content if user is logged in
  if (!user) {
    return (
      <header className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
             {/* Just the Logo for unauthenticated users */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl"></span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
                Kramik
              </span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link to={user.userType === 'admin' ? "/admin" : "/dashboard"} className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg">
              <span className="text-xl sm:text-2xl"></span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-wider group-hover:text-indigo-300 transition-colors">
              Kramik
            </span>
          </Link>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Blockchain Wallet Connection - Mobile Friendly */}
            {user.userType === 'student' && (
              <div className="hidden lg:block">
                {isConnected ? (
                  <div className="px-3 py-2 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-xs font-mono hidden xl:inline">
                        {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                      </span>
                      <span className="text-green-300 text-xs font-mono xl:hidden">
                        ✓
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectWallet}
                    disabled={blockchainLoading}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs flex items-center space-x-1 disabled:opacity-50"
                  >
                    <span className="text-sm">🔗</span>
                    <span className="hidden sm:inline">{blockchainLoading ? 'Connecting...' : 'Connect'}</span>
                  </button>
                )}
              </div>
            )}
            
            <div className="hidden md:block text-right">
              <p className="text-white font-semibold text-xs sm:text-sm">{user.name}</p>
              <p className="text-indigo-300 text-xs capitalize">{user.userType}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-xs sm:text-sm flex items-center space-x-1"
            >
              <span className="text-sm"></span>
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
