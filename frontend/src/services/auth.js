import { authAPI } from './api'

class AuthService {
  async login(credentials) {
    const response = await authAPI.login(credentials)
    return response.data
  }

  async register(userData) {
    const response = await authAPI.register(userData)
    return response.data
  }

  async blockchainLogin(message, signature, userType) {
    const response = await authAPI.blockchainLogin({
      message,
      signature,
      userType
    })
    return response.data
  }

  async verifyToken() {
    try {
      const response = await authAPI.verifyToken()
      return response.data.user
    } catch (error) {
      throw new Error('Token verification failed')
    }
  }

  async logout() {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('kramik_token')
    }
  }

  async updateProfile(profileData) {
    const response = await authAPI.updateProfile(profileData)
    return response.data
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('kramik_token')
  }

  // Utility method to get stored token
  getToken() {
    return localStorage.getItem('kramik_token')
  }
}

export default new AuthService()