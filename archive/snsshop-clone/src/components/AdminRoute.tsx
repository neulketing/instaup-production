import { useState, useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

export default function AdminRoute() {
  const { isAdmin } = useAdmin()
  const [showLogin, setShowLogin] = useState(!isAdmin)

  useEffect(() => {
    setShowLogin(!isAdmin)
  }, [isAdmin])

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Admin Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">⚙️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INSTAUP 관리자</h1>
            <p className="text-gray-600">시스템 관리 및 서비스 설정</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <AdminLogin
              onClose={() => {
                // Redirect to main page if closed
                window.location.href = '/'
              }}
              onSuccess={() => setShowLogin(false)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanel onClose={() => {
        // Redirect to main page when admin panel is closed
        window.location.href = '/'
      }} />
    </div>
  )
}
