
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with server-safe default (false for SSR compatibility)
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Mobile detection with multiple checks for better accuracy
    const checkIsMobile = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // More comprehensive mobile detection
      const mobileCheck = width < MOBILE_BREAKPOINT || (isTouchDevice && width < 1024) || isMobileUA
      
      console.log(`📱 Mobile detection - Width: ${width}, Touch: ${isTouchDevice}, UA: ${isMobileUA}, Result: ${mobileCheck}`)
      
      return mobileCheck
    }

    // Set initial value immediately when component mounts
    const initialIsMobile = checkIsMobile()
    setIsMobile(initialIsMobile)
    setIsInitialized(true)

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const newIsMobile = checkIsMobile()
      console.log(`📱 Mobile state changed: ${newIsMobile}`)
      setIsMobile(newIsMobile)
    }
    
    mql.addEventListener("change", onChange)
    
    // Also listen for orientation changes on mobile
    const handleOrientationChange = () => {
      setTimeout(() => {
        const newIsMobile = checkIsMobile()
        console.log(`📱 Orientation changed, mobile: ${newIsMobile}`)
        setIsMobile(newIsMobile)
      }, 100) // Small delay to ensure window dimensions are updated
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  // Return false during SSR, true mobile state after hydration
  return isInitialized ? isMobile : false
}
