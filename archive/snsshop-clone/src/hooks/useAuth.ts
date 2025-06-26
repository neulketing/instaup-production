import { useState, useEffect } from 'react'
import apiService from '../services/api'

interface User {
  id: string
  email: string
  nickname: string
  balance: number
  totalSpent: number
  totalOrders?: number
  joinDate?: string
  createdAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await apiService.getCurrentUser()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Token invalid, clear storage
      apiService.logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      if (response.success) {
        setUser(response.data.user)
        return true
      }
      throw new Error(response.error || '로그인에 실패했습니다.')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, nickname: string, referralCode?: string) => {
    try {
      const response = await apiService.register(email, password, nickname, referralCode)
      if (response.success) {
        setUser(response.data.user)
        return true
      }
      throw new Error(response.error || '회원가입에 실패했습니다.')
    } catch (error) {
      console.error('Register failed:', error)
      throw error
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Refresh user failed:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser
  }
}
