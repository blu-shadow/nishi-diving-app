import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

/**
 * useSocket — manages a Socket.io connection for the logged-in user.
 *
 * Usage:
 *   const { on, emit } = useSocket()
 *   on('newNotification', handler)
 *   emit('join', userId)
 */
export function useSocket() {
  const { user, isLoggedIn } = useAuth()
  const socketRef = useRef(null)

  // ── Connect when logged in ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !user?._id) return

    const socket = io('/', {
      transports:      ['websocket', 'polling'],
      reconnection:    true,
      reconnectionDelay:    1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', user._id)
    })

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [isLoggedIn, user?._id])

  // ── Listen to an event ─────────────────────────────────────────────────────
  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler)
    // Return cleanup
    return () => socketRef.current?.off(event, handler)
  }, [])

  // ── Emit an event ──────────────────────────────────────────────────────────
  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data)
  }, [])

  // ── Is connected ──────────────────────────────────────────────────────────
  const isConnected = () => socketRef.current?.connected ?? false

  return { on, emit, isConnected, socket: socketRef.current }
}
