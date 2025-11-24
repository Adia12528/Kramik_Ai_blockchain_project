import React, { createContext, useContext, useState, useEffect } from 'react'
import blockchainService from '../services/blockchain'

const BlockchainContext = createContext()

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider')
  }
  return context
}

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if wallet is connected on component mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        })
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0])
          setIsConnected(true)
          await blockchainService.connectWallet()
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    setLoading(true)
    setError(null)
    try {
      const account = await blockchainService.connectWallet()
      setCurrentAccount(account)
      setIsConnected(true)
      return account
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setCurrentAccount(null)
    setIsConnected(false)
    setError(null)
  }

  const signMessage = async (message) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }
    try {
      return await blockchainService.signMessage(message)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const verifySignature = async (message, signature, userType) => {
    try {
      const response = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature, userType }),
      })
      
      if (!response.ok) {
        throw new Error('Signature verification failed')
      }
      
      return await response.json()
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const registerStudentOnBlockchain = async (studentData) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }
    try {
      return await blockchainService.verifyStudentRegistration(studentData)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    currentAccount,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    verifySignature,
    registerStudentOnBlockchain,
    checkWalletConnection
  }

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  )
}