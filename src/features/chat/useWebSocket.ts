import { useCallback, useEffect, useRef, useState } from 'react'

export interface ChatMessage {
  id: string
  text: string
  direction: 'sent' | 'received'
  timestamp: number
}

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => setIsConnected(true)
    socket.onclose = () => setIsConnected(false)
    socket.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: String(event.data),
          direction: 'received',
          timestamp: Date.now(),
        },
      ])
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [url])

  const sendMessage = useCallback((text: string) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) return

    socket.send(text)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, direction: 'sent', timestamp: Date.now() },
    ])
  }, [])

  return { messages, isConnected, sendMessage }
}
