// Production API with fallback
const API_BASE_URL = 'https://instaup-backend-production.up.railway.app/api'
const FALLBACK_API_URL = 'http://localhost:3001/api'

// Auto-detect working API endpoint
let activeApiUrl = API_BASE_URL

class APIService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${activeApiUrl}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        // 토큰 만료 또는 인증 실패
        if (response.status === 401) {
          this.logout()
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }

        // 서버 에러
        if (response.status >= 500) {
          throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }

        // 응답 데이터 파싱 시도
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `요청 실패 (${response.status})`)
        } catch {
          throw new Error(`요청 실패 (${response.status})`)
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      // 네트워크 에러 또는 기타 에러
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('네트워크 연결을 확인해주세요.')
        }
        throw error
      }
      throw new Error('알 수 없는 오류가 발생했습니다.')
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
    }

    return data
  }

  async register(email: string, password: string, nickname: string, referralCode?: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, referralCode })
    })

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
    }

    return data
  }

  async getCurrentUser() {
    try {
      return await this.request('/auth/me')
    } catch (error) {
      // Token expired or invalid
      this.logout()
      throw error
    }
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  // Orders
  async createOrder(serviceId: string, quantity: number, targetUrl: string) {
    return await this.request('/order', {
      method: 'POST',
      body: JSON.stringify({ serviceId, quantity, targetUrl })
    })
  }

  async getOrders() {
    return await this.request('/order')
  }

  // Payments
  async topUpBalance(amount: number) {
    return await this.request('/payment/topup', {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  }

  // Services
  async getServices() {
    return await this.request('/services')
  }

  // User
  async getUserProfile() {
    return await this.request('/user/profile')
  }

  // Referral System
  async getReferralStats() {
    return await this.request('/referral/stats')
  }

  async getReferralCode() {
    return await this.request('/referral/code')
  }

  async getReferralHistory(page = 1, limit = 20) {
    return await this.request(`/referral/history?page=${page}&limit=${limit}`)
  }

  async getReferralCommissions(page = 1, limit = 20, status?: string) {
    const statusParam = status ? `&status=${status}` : ''
    return await this.request(`/referral/commissions?page=${page}&limit=${limit}${statusParam}`)
  }

  async claimCommissions(commissionIds: string[]) {
    return await this.request('/referral/claim', {
      method: 'POST',
      body: JSON.stringify({ commissionIds })
    })
  }

  // Generic request method for other endpoints
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${activeApiUrl}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      })

      if (!response.ok) {
        // 토큰 만료 또는 인증 실패
        if (response.status === 401) {
          this.logout()
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }

        // 서버 에러
        if (response.status >= 500) {
          throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }

        // 응답 데이터 파싱 시도
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `요청 실패 (${response.status})`)
        } catch {
          throw new Error(`요청 실패 (${response.status})`)
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      // 네트워크 에러 또는 기타 에러
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('네트워크 연결을 확인해주세요.')
        }
        throw error
      }
      throw new Error('알 수 없는 오류가 발생했습니다.')
    }
  }
}

export const apiService = new APIService()
export default apiService
