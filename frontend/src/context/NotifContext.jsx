import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const NotifContext = createContext(null)

export function NotifProvider({ children }) {
  const { user, isLoggedIn }  = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount,   setUnreadCount]   = useState(0)
  const [isOpen,        setIsOpen]        = useState(false)
  const socketRef = useRef(null)
  const pollRef   = useRef(null)

  // ── Fetch notifications from server ────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const { data } = await axios.get('/notifications')
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch (err) {
      console.error('fetchNotifications error:', err.message)
    }
  }, [isLoggedIn])

  // ── Connect socket & start polling when user logs in ──────────────────────
  useEffect(() => {
    if (!isLoggedIn || !user?._id) {
      // Clean up on logout
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null }
      if (pollRef.current)   { clearInterval(pollRef.current); pollRef.current = null }
      setNotifications([])
      setUnreadCount(0)
      return
    }

    // Initial fetch
    fetchNotifications()

    // Socket.io real-time
    const socket = io('/', { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', user._id)
    })

    socket.on('newNotification', (notif) => {
      // Only if user has notifications enabled
      if (user?.notificationsEnabled === false) return

      setNotifications(prev => [{
        _id:       Date.now().toString(),
        title:     notif.title,
        message:   notif.message,
        type:      notif.type || 'system',
        read:      false,
        createdAt: new Date().toISOString()
      }, ...prev])

      setUnreadCount(prev => prev + 1)

      // Browser notification (if permission granted)
      if (Notification?.permission === 'granted') {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/favicon.svg'
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected — falling back to polling')
    })

    // Polling fallback every 30 seconds
    pollRef.current = setInterval(fetchNotifications, 30_000)

    return () => {
      socket.disconnect()
      socketRef.current = null
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [isLoggedIn, user?._id]) // re-run only when login state changes

  // ── Mark one as read ───────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('markAsRead error:', err.message)
    }
  }, [])

  // ── Mark all as read ───────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/notifications/read-all/mark')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('markAllAsRead error:', err.message)
    }
  }, [])

  // ── Clear all ──────────────────────────────────────────────────────────────
  const clearAll = useCallback(async () => {
    try {
      await axios.delete('/notifications/clear-all')
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('clearAll error:', err.message)
    }
  }, [])

  // ── Toggle panel ──────────────────────────────────────────────────────────
  const togglePanel  = useCallback(() => setIsOpen(p => !p), [])
  const closePanel   = useCallback(() => setIsOpen(false),   [])

  // ── Request browser notification permission ────────────────────────────────
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  return (
    <NotifContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      clearAll,
      togglePanel,
      closePanel,
      requestPermission,
    }}>
      {children}
    </NotifContext.Provider>
  )
}

// ── Custom hook ───────────────────────────────────────────────────────────────
export function useNotif() {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotif must be used inside <NotifProvider>')
  return ctx
}
