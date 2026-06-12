import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'

export type MessageType = 'user' | 'ai'

export interface Message {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  products?: Product[]
}

interface AIChatContextType {
  isOpen: boolean
  messages: Message[]
  isTyping: boolean
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => void
  clearChat: () => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

/**
 * AIChatProvider Component
 * 
 * Purpose: Provide chat state and actions to all components
 * Why it exists: Centralized chat state management without prop drilling
 * Features: Chat open/close, messages array, typing state, mock AI responses
 */
export const AIChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const openChat = useCallback(() => {
    setIsOpen(true)
    
    // Add welcome message if first time
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "Hi! I'm your AI Shopping Assistant. I can help you find products, compare prices, and give personalized recommendations. What are you looking for today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI typing
    setIsTyping(true)

    // Mock AI response (will be replaced with real API later)
    setTimeout(() => {
      setIsTyping(false)
      
      const aiResponses = [
        "I'd be happy to help you with that! Let me search for some options.",
        "Great choice! I found several products that might interest you.",
        "Based on your preferences, I recommend checking out our latest arrivals.",
        "I can help you compare prices across different categories. What's your budget?",
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiMessage])
    }, 1500)
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <AIChatContext.Provider
      value={{
        isOpen,
        messages,
        isTyping,
        openChat,
        closeChat,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </AIChatContext.Provider>
  )
}

/**
 * useAIChat Hook
 * 
 * Purpose: Consume AI chat context in components
 * Why it exists: Easy access to chat state and actions
 * Features: Type-safe chat context consumption
 */
export const useAIChat = () => {
  const context = useContext(AIChatContext)
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider')
  }
  return context
}
