import { useEffect } from 'react'

export const useOnInit = (initialCallback: () => void) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: It's only meant to run once
  useEffect(() => {
    initialCallback()
  }, [])
}
