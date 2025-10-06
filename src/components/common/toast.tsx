import React from 'react'
import { ToastMessage } from 'src/customHooks/useToast'
interface ToastProps {
  toast: ToastMessage | null
}
export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null
  const getToastClass = (type: ToastMessage['type']) => {
    const base = 'toast'
    const types = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info',
    }
    return `${base} ${types[type] || base}`
  }
  return (
    <div className={getToastClass(toast.type)}>
      {toast.message}
    </div>
  )
}