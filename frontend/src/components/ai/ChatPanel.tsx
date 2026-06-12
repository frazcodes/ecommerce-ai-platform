import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend } from 'react-icons/fi'
import { useAIChat } from '../../contexts/AIChatContext'
import Message from './Message'
import TypingIndicator from './TypingIndicator'

/**
 * ChatPanel Component
 * 
 * Purpose: Main chat interface container
 * Why it exists: Container for all chat UI elements
 * Features: Slide-up panel, header, message list, input area, glassmorphism styling
 */
const ChatPanel = () => {
  const { isOpen, closeChat, messages, isTyping, sendMessage } = useAIChat()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-[400px] h-[60vh] max-h-[500px] flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-gray-700/30 dark:bg-gray-900/90 sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[400px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 dark:border-gray-700/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Shopping Assistant</h3>
              <p className="text-xs text-white/70">Online</p>
            </div>
          </div>
          <motion.button
            onClick={closeChat}
            className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX size={18} />
          </motion.button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-3 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/20 p-4 dark:border-gray-700/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-xl transition-all focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            />
            <motion.button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ChatPanel
