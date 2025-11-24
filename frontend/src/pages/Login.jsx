import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useBlockchain } from '../contexts/BlockchainContext'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login, blockchainLogin, register } = useAuth()
  const { connectWallet, isConnected, signMessage } = useBlockchain()
  const [activeTab, setActiveTab] = useState('student')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [detectedWallets, setDetectedWallets] = useState([])
  const [showWalletGuide, setShowWalletGuide] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Wallet options for installation
  const walletOptions = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet',
      installUrl: 'https://metamask.io/download/',
      chromeUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefoxUrl: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      recommended: true
    },
    {
      name: 'Coinbase Wallet',
      icon: '💼',
      description: 'Trusted wallet by Coinbase',
      installUrl: 'https://www.coinbase.com/wallet',
      chromeUrl: 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      recommended: false
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Secure multi-chain wallet',
      installUrl: 'https://trustwallet.com/browser-extension',
      chromeUrl: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      recommended: false
    },
    {
      name: 'Phantom',
      icon: '👻',
      description: 'Solana & Ethereum wallet',
      installUrl: 'https://phantom.app/',
      chromeUrl: 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      recommended: false
    }
  ]

  // Check for crypto wallets on component mount
  useEffect(() => {
    detectAllWallets()
    
    // Re-check every 2 seconds in case wallet gets installed
    const interval = setInterval(detectAllWallets, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const detectAllWallets = () => {
    const wallets = []
    
    // MetaMask detection
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      wallets.push({
        name: 'MetaMask',
        icon: '🦊',
        provider: window.ethereum,
        type: 'injected'
      })
    }
    
    // Coinbase Wallet detection  
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
      wallets.push({
        name: 'Coinbase Wallet',
        icon: '💼',
        provider: window.ethereum,
        type: 'injected'
      })
    }
    
    // Trust Wallet detection
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isTrust) {
      wallets.push({
        name: 'Trust Wallet',
        icon: '🛡️',
        provider: window.ethereum,
        type: 'injected'
      })
    }
    
    // Phantom detection
    if (typeof window.phantom !== 'undefined' && window.phantom.ethereum) {
      wallets.push({
        name: 'Phantom',
        icon: '👻',
        provider: window.phantom.ethereum,
        type: 'injected'
      })
    }
    
    // Generic Ethereum provider (fallback)
    if (wallets.length === 0 && typeof window.ethereum !== 'undefined') {
      wallets.push({
        name: 'Web3 Wallet',
        icon: '🔐',
        provider: window.ethereum,
        type: 'generic'
      })
    }
    
    if (wallets.length > 0 && detectedWallets.length !== wallets.length) {
      console.log('🔍 Detected wallets:', wallets)
      setDetectedWallets(wallets)
    } else if (wallets.length === 0 && detectedWallets.length > 0) {
      setDetectedWallets([])
    }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (isRegisterMode) {
        // Registration
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all fields')
          toast.error('Please fill in all fields')
          setIsLoading(false)
          return
        }
        
        await register({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          userType: activeTab 
        })
        toast.success('Account created successfully!')
        navigate(activeTab === 'admin' ? '/admin' : '/dashboard')
      } else {
        // Login
        if (!formData.email || !formData.password) {
          setError('Please enter both email and password')
          toast.error('Please enter both email and password')
          setIsLoading(false)
          return
        }
        
        await login({ email: formData.email, password: formData.password, userType: activeTab })
        toast.success('Login successful!')
        navigate(activeTab === 'admin' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed. Please try again.'
      setError(errorMessage)
      
      // Check if user not found error
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('User') || !isRegisterMode) {
        toast.error('User not found! Please create an account.', {
          duration: 4000,
          icon: '👤'
        })
        // Auto-switch to register mode
        setTimeout(() => {
          setIsRegisterMode(true)
          setError('')
        }, 1500)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = async (wallet = null) => {
    // Require explicit wallet selection
    if (!wallet) {
      toast.error('Please select a wallet to continue', {
        duration: 3000,
        icon: '🔐'
      })
      return
    }
    
    const walletToUse = wallet
    
    if (!walletToUse) {
      setShowWalletGuide(true)
      toast.error('No wallet detected. Please install a crypto wallet first.', {
        duration: 5000,
        icon: '🔐'
      })
      return
    }

    setIsLoading(true)
    setSelectedWallet(walletToUse)
    setError('')
    
    try {
      // Check if there's already a pending request
      if (walletToUse.provider._state?.isUnlocked === false) {
        toast.error(`${walletToUse.name} is locked. Please unlock your wallet first.`, {
          duration: 5000,
          icon: '🔒'
        })
        setIsLoading(false)
        return
      }

      toast.loading(`Connecting to ${walletToUse.name}...`, { id: 'wallet-connect' })
      
      // Request wallet connection with timeout
      const connectionPromise = walletToUse.provider.request({
        method: 'eth_requestAccounts'
      })

      // Add 30 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout - please open your wallet and approve the request')), 30000)
      )

      const accounts = await Promise.race([connectionPromise, timeoutPromise])
      
      if (!accounts || accounts.length === 0) {
        toast.error(`No accounts found in ${walletToUse.name}`, { id: 'wallet-connect' })
        throw new Error(`No accounts found in ${walletToUse.name}. Please create an account first.`)
      }
      
      const account = accounts[0]
      console.log(`👛 Connected to ${walletToUse.name}:`, account)

      toast.success(`${walletToUse.name} connected!`, { id: 'wallet-connect' })
      toast.loading(`Please sign the message in ${walletToUse.name}...`, { id: 'wallet-sign' })

      // Create a message to sign
      const message = `Login to Kramik Hub\nWallet: ${account}\nTimestamp: ${Date.now()}`
      
      // Sign the message with timeout
      const signPromise = walletToUse.provider.request({
        method: 'personal_sign',
        params: [message, account]
      })

      const signTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signing timeout - please open your wallet and sign the message')), 30000)
      )

      const signature = await Promise.race([signPromise, signTimeoutPromise])
      
      if (!signature) {
        toast.error('Message signing cancelled', { id: 'wallet-sign' })
        throw new Error('Signature required for authentication')
      }

      toast.success('Message signed!', { id: 'wallet-sign' })
      toast.loading('Authenticating with blockchain...', { id: 'wallet-auth' })
      
      console.log('🔐 Sending blockchain login request:', { 
        messageLength: message.length, 
        signatureLength: signature.length,
        userType: 'student'
      })
      
      // Authenticate with backend
      const userData = await blockchainLogin(message, signature, 'student')
      
      console.log('✅ Blockchain login successful:', userData)
      
      toast.success(`🎉 Welcome ${userData.name}!`, { id: 'wallet-auth', duration: 2000 })
      
      // Navigate to dashboard
      setTimeout(() => navigate('/dashboard'), 500)
      
    } catch (err) {
      console.error(`${walletToUse?.name || 'Wallet'} login error:`, err)
      
      // User-friendly error messages
      let errorMessage = 'Wallet authentication failed'
      let helpText = ''
      
      if (err.code === 4001) {
        errorMessage = 'You rejected the connection request'
        helpText = 'Click the wallet button again to retry'
      } else if (err.code === -32002) {
        errorMessage = `A request is already pending in ${walletToUse.name}`
        helpText = `Please open ${walletToUse.name} extension, approve or reject the pending request, then try again`
      } else if (err.message?.includes('timeout')) {
        errorMessage = err.message
        helpText = `Open ${walletToUse.name} and check for pending requests`
      } else if (err.message?.includes('No accounts')) {
        errorMessage = err.message
        helpText = `Create an account in ${walletToUse.name} first`
      } else if (err.message?.includes('rejected') || err.message?.includes('denied')) {
        errorMessage = 'Request rejected by user'
        helpText = 'Try again and approve the request in your wallet'
      } else if (err.message?.includes('sign')) {
        errorMessage = 'Message signing failed'
        helpText = 'Sign the message in your wallet to continue'
      } else if (err.message?.includes('locked')) {
        errorMessage = `${walletToUse.name} is locked`
        helpText = 'Unlock your wallet and try again'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage + (helpText ? `\n${helpText}` : ''))
      
      toast.dismiss('wallet-connect')
      toast.dismiss('wallet-sign')
      toast.dismiss('wallet-auth')
      
      // Show error with help text
      if (helpText) {
        toast.error(
          <div>
            <div className="font-bold">{errorMessage}</div>
            <div className="text-sm mt-1">{helpText}</div>
          </div>,
          { duration: 6000 }
        )
      } else {
        toast.error(errorMessage, { duration: 4000 })
      }
    } finally {
      setIsLoading(false)
      setSelectedWallet(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <span className="text-5xl">🎓</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">Kramik Hub</h1>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              The next generation educational platform powered by AI and Blockchain technology.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold">AI-Powered Learning</h3>
                  <p className="text-sm text-indigo-200">Personalized skill analysis & recommendations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <span className="text-2xl">🔗</span>
                <div>
                  <h3 className="font-semibold">Blockchain Verified</h3>
                  <p className="text-sm text-indigo-200">Secure & immutable academic records</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-gray-50">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isRegisterMode ? 'Sign up to get started' : 'Please sign in to continue'}
            </p>

            {/* Role Tabs */}
            <div className="flex p-1 bg-gray-200 rounded-xl mb-8">
              <button
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'student'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('student')}
              >
                Student
              </button>
              <button
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
                {error}
              </div>
            )}

            {/* Demo Credentials for Admin */}
            {activeTab === 'admin' && !isRegisterMode && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔑</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Demo Admin Credentials</p>
                    <p className="text-xs text-amber-700">
                      <strong>Email:</strong> admin<br />
                      <strong>Password:</strong> admin123
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder={activeTab === 'admin' ? "Enter admin username" : "Enter your email"}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 text-white font-bold rounded-xl transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                  </span>
                ) : (
                  isRegisterMode ? 'Create Account' : 'Sign In'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode)
                    setError('')
                    setFormData({ name: '', email: '', password: '' })
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>

            {activeTab === 'student' && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  {detectedWallets.length > 0 ? (
                    <div className="space-y-3">
                      {detectedWallets.map((wallet, index) => (
                        <button
                          key={index}
                          onClick={() => handleWalletLogin(wallet)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-3 border border-indigo-300 shadow-sm text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 text-gray-700"
                        >
                          {isLoading && selectedWallet?.name === wallet.name ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Connecting to {wallet.name}...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl mr-3">{wallet.icon}</span>
                              <span className="font-semibold">Login with {wallet.name}</span>
                              <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">✓ Detected</span>
                            </>
                          )}
                        </button>
                      ))}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        <span className="flex items-center justify-center">
                          <span className="text-green-500 mr-1">✓</span>
                          {detectedWallets.length} wallet{detectedWallets.length > 1 ? 's' : ''} detected • Secure blockchain authentication
                        </span>
                      </p>
                      {error && error.includes('pending') && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800 flex items-start">
                            <span className="text-base mr-2">⚠️</span>
                            <span>
                              <strong>Pending Request:</strong> Open your wallet extension and approve or reject the pending request before trying again.
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowWalletGuide(true)}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl transition-all duration-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
                      >
                        <span className="text-xl mr-3">🔐</span>
                        <span className="font-semibold">Install Crypto Wallet</span>
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Not Detected</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        <span className="text-amber-600">Crypto wallet required for blockchain login</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Installation Guide Modal */}
      {showWalletGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">🔐</span>
                  <h2 className="text-2xl font-bold">Install Crypto Wallet</h2>
                </div>
                <button
                  onClick={() => setShowWalletGuide(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-indigo-100 mt-2">Choose a wallet and follow the installation steps to enable blockchain login</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Wallet Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletOptions.map((wallet, index) => (
                  <div key={index} className={`relative p-5 rounded-xl border-2 transition-all hover:shadow-lg ${wallet.recommended ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}`}>
                    {wallet.recommended && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{wallet.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{wallet.description}</p>
                        <div className="space-y-2">
                          {wallet.chromeUrl && (
                            <a
                              href={wallet.chromeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all text-center"
                            >
                              Install for Chrome
                            </a>
                          )}
                          {wallet.firefoxUrl && (
                            <a
                              href={wallet.firefoxUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-all text-center"
                            >
                              Install for Firefox
                            </a>
                          )}
                          {!wallet.chromeUrl && wallet.installUrl && (
                            <a
                              href={wallet.installUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-all text-center"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Installation Steps */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                  <span className="text-2xl mr-2">📝</span>
                  Setup Instructions
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</span>
                    <span><strong>Click Install:</strong> Choose a wallet above and click the install button for your browser</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</span>
                    <span><strong>Add Extension:</strong> Follow the browser prompts to add the wallet extension</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</span>
                    <span><strong>Create Account:</strong> Open the wallet and create a new wallet account (save your recovery phrase securely!)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">4</span>
                    <span><strong>Reload Page:</strong> After installation, reload this page and the wallet will be detected automatically</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">5</span>
                    <span><strong>Login:</strong> Click the wallet login button to connect and sign in securely</span>
                  </li>
                </ol>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Security Warning</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Never share your recovery phrase with anyone</li>
                      <li>• Keep your recovery phrase in a safe, offline location</li>
                      <li>• Only download wallets from official websites</li>
                      <li>• Kramik will never ask for your recovery phrase or private keys</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    detectAllWallets()
                    setShowWalletGuide(false)
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  ✓ I've Installed a Wallet
                </button>
                <button
                  onClick={() => setShowWalletGuide(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login