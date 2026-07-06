import { useCallback, useEffect, useRef, useState } from 'react'

export interface ChatMessage {
  id: string
  text: string
  direction: 'sent' | 'received'
  timestamp: number
}

// A custom hook is React's equivalent of a Vue "composable" — a plain
// function that calls other hooks internally and returns whatever state/
// actions the component needs, so the WebSocket lifecycle logic isn't tangled
// into ChatPage's JSX.
export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // The live WebSocket instance is stored in a ref, not state: reconnecting
  // or sending a message shouldn't itself trigger a re-render, and the
  // callbacks below need a stable reference to "whatever socket is currently
  // open" without recreating themselves.
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

    // Cleanup function: runs on unmount, and would run before the effect
    // re-runs if `url` ever changed. Without this, navigating away from the
    // chat page and back would leave the old socket open while opening a
    // second one — a classic useEffect-cleanup bug.
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
