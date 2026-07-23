import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Box, Paper, TextField, IconButton, Typography, Chip, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useWebSocket } from '@/features/chat/useWebSocket'

const CHAT_WS_URL = 'wss://ws.ifelse.io'

export function ChatPage() {
  const { messages, isConnected, sendMessage } = useWebSocket(CHAT_WS_URL)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    sendMessage(draft.trim())
    setDraft('')
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4">Chat</Typography>
        <Chip
          label={isConnected ? 'Connected' : 'Connecting…'}
          color={isConnected ? 'success' : 'default'}
          size="small"
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Connected to the public echo server (wss:
        back.
      </Typography>
      <Paper variant="outlined" sx={{ height: 400, overflowY: 'auto', p: 2, mb: 2 }}>
        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: 'flex',
              justifyContent: m.direction === 'sent' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              sx={{
                px: 1.5,
                py: 0.75,
                bgcolor: m.direction === 'sent' ? 'primary.main' : 'grey.200',
                color: m.direction === 'sent' ? 'primary.contrastText' : 'text.primary',
                maxWidth: '75%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2">{m.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Paper>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={!isConnected}
          />
          <IconButton type="submit" color="primary" disabled={!isConnected || !draft.trim()}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </Box>
  )
}
