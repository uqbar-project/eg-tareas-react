import { useState } from 'react'

export interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'warning' | 'info' 
  duration?: number 
}
export const useToast = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const showToast = (message: string, type: ToastMessage['type'], duration = 4000) => {
    setToast({ message, type, duration })
    
    setTimeout(() => {
      setToast(null)
    }, duration)
  }
  return {
    toast,
    showToast,
  }
}