import { useState, useEffect } from 'react'

export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/')

  return {
    currentPath,
    navigate,
    isAdminRoute
  }
}
