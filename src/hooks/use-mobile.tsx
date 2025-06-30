
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with false to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return

    const checkIsMobile = () => {
      // Use multiple methods to detect mobile devices
      const width = window.innerWidth < MOBILE_BREAKPOINT
      const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Consider it mobile if width is small OR it's a mobile user agent with touch support
      return width || (userAgent && touchSupport)
    }

    // Set initial value
    setIsMobile(checkIsMobile())

    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
