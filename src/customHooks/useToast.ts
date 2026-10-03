import { useSyncExternalStore } from 'react'

export interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

let currentToast: ToastMessage | null = null
let hideTimeout: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) {
    listener()
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => currentToast

export const showToast = (
  message: string,
  type: ToastMessage['type'],
  duration = 4000
) => {
  currentToast = { message, type, duration }
  emit()

  clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    currentToast = null
    emit()
  }, duration)
}

export const useToast = () => ({
  toast: useSyncExternalStore(subscribe, getSnapshot),
  showToast,
})
