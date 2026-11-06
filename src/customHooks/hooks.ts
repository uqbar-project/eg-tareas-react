import { useEffect, useRef } from 'react'

export const useOnInit = (initialCallback: () => void) => {
  const hasRun = useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: It's only meant to run once
  useEffect(() => {
    if (hasRun.current) {
      return
    }

    hasRun.current = true
    initialCallback()
  }, [])
}
