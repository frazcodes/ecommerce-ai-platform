import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AIChatButton from '../ai/AIChatButton'
import ChatPanel from '../ai/ChatPanel'

/**
 * MainLayout Component
 *
 * Purpose: Wraps all pages with consistent header, ambient background, and footer
 * Why it exists: Ensures every page shares the same navigation structure and visual foundation
 */
const MainLayout = () => {
  return (
    <>
      {/* Ambient mesh gradient background */}
      <div className="app-bg" aria-hidden="true" />

      <div className="relative flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />

        <AIChatButton />
        <ChatPanel />
      </div>
    </>
  )
}

export default MainLayout
