import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const SettingsPage = () => {
  const { user, changePassword, isLoading } = useAuth()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      await changePassword(form.currentPassword, form.newPassword)
      setMessage('Password updated successfully')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
      >
        <FiArrowLeft size={16} />
        Back to home
      </Link>

      <div className="glass-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
          Manage your account settings
        </p>

        <div className="mt-8">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Signed in as <strong className="text-gray-900 dark:text-gray-100">{user?.email}</strong>
            </p>
          </div>

          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <FiLock size={18} />
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-200/50 bg-white/80 px-4 py-3 text-sm backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              required
            />
            <input
              type="password"
              placeholder="New password (min 8 characters)"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-200/50 bg-white/80 px-4 py-3 text-sm backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-200/50 bg-white/80 px-4 py-3 text-sm backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              required
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 disabled:opacity-50 sm:w-auto"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
