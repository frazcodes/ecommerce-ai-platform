import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

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
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          to="/admin/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-brand-600"
        >
          <FiArrowLeft size={16} />
          Back to dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Manage your admin account settings
        </p>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-1 font-semibold text-[var(--text-primary)]">Account</h2>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          Signed in as <strong>{user?.email}</strong> ({user?.role})
        </p>

        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <FiLock size={18} />
          Change Password
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-sm"
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
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage
