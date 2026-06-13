import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiCalendar, FiShield, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const ProfilePage = () => {
  const { user } = useAuth()

  if (!user) {
    return null
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
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-purple-500/20 sm:h-24 sm:w-24"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white ring-4 ring-purple-500/20 sm:h-24 sm:w-24 sm:text-3xl">
              {user.fullName.charAt(0)}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {user.fullName}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
            <FiUser size={20} className="shrink-0 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.username || user.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
            <FiMail size={20} className="shrink-0 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
            <FiShield size={20} className="shrink-0 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="font-medium capitalize text-gray-900 dark:text-gray-100">
                {user.role === 'superadmin' ? 'Super Admin' : user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
            <FiCalendar size={20} className="shrink-0 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Member since</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
