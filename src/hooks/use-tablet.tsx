
import * as React from "react"

const TABLET_BREAKPOINT_MIN = 768
const TABLET_BREAKPOINT_MAX = 1024

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= TABLET_BREAKPOINT_MIN && width < TABLET_BREAKPOINT_MAX)
    }

    checkIsTablet()
    window.addEventListener('resize', checkIsTablet)
    return () => window.removeEventListener('resize', checkIsTablet)
  }, [])

  return !!isTablet
}
