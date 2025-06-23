import React, { useState, useRef } from 'react'
import { AdminProvider, useAdmin } from './contexts/AdminContext'
import { OrderProvider } from './contexts/OrderContext'
import NotificationSystem, { useNotifications } from './components/NotificationSystem'
import Header from './components/Header'
import Hero from './components/Hero'
import PlatformGrid from './components/PlatformGrid'
import PriceCalculator from './components/PriceCalculator'
import HowToUse from './components/HowToUse'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import FloatingKakao from './components/FloatingKakao'
import EnhancedOrderForm from './components/EnhancedOrderForm'
import PlatformOrderForm from './components/PlatformOrderForm'
import NaverServiceForm from './components/NaverServiceForm'
import UserDashboard from './components/UserDashboard'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import AdminRoute from './components/AdminRoute'
import OrderTracker from './components/OrderTracker'
import PaymentModal from './components/PaymentModal'
import OrderDashboard from './components/OrderDashboard'
import AddFunds from './components/AddFunds'
import TestPage from './components/TestPage'
import NewAuthModal from './components/NewAuthModal'
import { useAuth } from './hooks/useAuth'
import { useRouter } from './hooks/useRouter'

// Create a separate component to use admin context
function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showTestPage, setShowTestPage] = useState(false)

  const { isAdmin } = useAdmin()
  const { user, isAuthenticated } = useAuth()
  const { notifications, removeNotification, showSuccess, showInfo } = useNotifications()
  const hasShownWelcome = useRef(false)

  // Show welcome notification on mount
  React.useEffect(() => {
    if (!hasShownWelcome.current) {
      showInfo('INSTAUP에 오신 것을 환영합니다!', '실제 한국인 팔로워로 SNS를 성장시키세요', 7000)
      hasShownWelcome.current = true
    }
  }, [showInfo])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {
          setAuthMode('login')
          setShowAuthModal(true)
        }}
        onSignupClick={() => {
          setAuthMode('signup')
          setShowAuthModal(true)
        }}
        onDashboardClick={() => setShowDashboard(true)}
        onOrdersClick={() => setShowTestPage(true)}
      />
      <Hero onOrderClick={() => setShowOrderForm(true)} />
      <PlatformGrid
        onOrderClick={() => setShowOrderForm(true)}
        onPlatformOrderClick={(platform: string) => {
          setShowOrderForm(true)
        }}
      />

      {/* Price Calculator Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PriceCalculator onOrderClick={() => setShowOrderForm(true)} />
        </div>
      </div>

      <HowToUse />
      <Footer />
      <FloatingKakao />

      {/* Test Page Modal */}
      {showTestPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">새로운 주문 시스템 (베타)</h2>
                <button
                  onClick={() => setShowTestPage(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <TestPage />
            </div>
          </div>
        </div>
      )}

      {/* New Auth Modal */}
      <NewAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  )
}

function App() {
  return (
    <OrderProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </OrderProvider>
  )
}

export default App
