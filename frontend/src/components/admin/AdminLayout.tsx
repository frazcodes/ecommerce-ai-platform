import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMenu, FiGrid } from 'react-icons/fi'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--border-glass)] bg-white/80 px-4 py-3 backdrop-blur-xl dark:bg-gray-900/80 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <FiGrid size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Admin
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
