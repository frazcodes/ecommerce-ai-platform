/**
 * Toast Notification Component
 * 
 * Purpose: Display success/error messages as popups
 * Why it exists: Provide user feedback for actions
 * Features: Auto-dismiss, success/error styling
 */

import { useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const Icon = type === 'success' ? FiCheckCircle : FiXCircle

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} flex items-center gap-3 rounded-lg px-6 py-4 text-white shadow-lg`}>
        <Icon size={20} />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
