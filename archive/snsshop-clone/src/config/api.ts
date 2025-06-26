// API 설정
export const API_CONFIG = {
  // 개발 환경에서는 로컬 서버, 프로덕션에서는 실제 서버
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.instaup.kr',

  // API 엔드포인트들
  ENDPOINTS: {
    // 인증
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',

    // 서비스
    SERVICES: '/api/services',
    SERVICE_DETAIL: (id: string) => `/api/services/${id}`,

    // 주문
    ORDERS: '/api/orders',
    ORDER_DETAIL: (id: string) => `/api/orders/${id}`,

    // 결제
    KAKAO_PAY_READY: '/api/payments/kakao/ready',
    KAKAO_PAY_APPROVE: '/api/payments/kakao/approve',
    TOSS_PAY_CONFIRM: '/api/payments/toss/confirm',

    // 관리자
    ADMIN_DASHBOARD: '/api/admin/dashboard',

    // 분석
    USER_STATS: '/api/analytics/user-stats'
  }
}

// API 호출 헬퍼 함수
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  // 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('instaup_token')
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.')
    }

    return data
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}

// 개발 환경 확인
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
