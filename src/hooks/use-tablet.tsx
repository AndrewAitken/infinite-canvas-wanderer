
import * as React from "react"

const TABLET_BREAKPOINT_MIN = 768
const TABLET_BREAKPOINT_MAX = 1024

export function useIsTablet() {
  // Initialize with false for SSR compatibility
  const [isTablet, setIsTablet] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Tablet detection: touch device in tablet size range
      const result = width >= TABLET_BREAKPOINT_MIN && width < TABLET_BREAKPOINT_MAX && isTouchDevice
      
      console.log(`📱 Tablet detection - Width: ${width}, Touch: ${isTouchDevice}, Result: ${result}`)
      return result
    }

    const initialIsTablet = checkIsTablet()
    setIsTablet(initialIsTablet)
    setIsInitialized(true)

    const handleResize = () => {
      const newIsTablet = checkIsTablet()
      setIsTablet(newIsTablet)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100)
    })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return isInitialized ? isTablet : false
}
