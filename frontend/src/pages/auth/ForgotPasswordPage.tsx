/**
 * Forgot Password Page
 * 
 * Purpose: Password reset request page
 * Why it exists: Allows users to request password reset email
 * Features: Email input, form validation, success state
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading, error } = useAuth()
  
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    
    // Validation
    if (!email) {
      setLocalError('Please enter your email address')
      return
    }
    
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address')
      return
    }

    try {
      await forgotPassword({ email })
      setIsSubmitted(true)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send reset email')
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                SmartCart
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-8 text-center backdrop-blur-xl dark:bg-gray-900/80">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <FiCheckCircle size={40} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Check your email
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We've sent a password reset link to{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {email}
              </span>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
              >
                Send another email
              </button>
              
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <FiArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              SmartCart
            </span>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-8 backdrop-blur-xl dark:bg-gray-900/80">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Forgot password?
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200/50 bg-white/80 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="rounded-xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <FiArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
