import { useEffect, useState } from 'react'
import type { DashboardMetrics } from './useDashboardMetrics'

type Interview = DashboardMetrics['upcomingInterviews'][number]

const SESSION_KEY = 'interview-reminders-fired'

const getFiredIds = (): string[] => {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '[]') } catch { return [] }
}

const markFired = (id: string) => {
  const fired = getFiredIds()
  if (!fired.includes(id)) sessionStorage.setItem(SESSION_KEY, JSON.stringify([...fired, id]))
}

const daysUntil = (iso: string) => {
  const todayUtc = new Date()
  todayUtc.setUTCHours(0, 0, 0, 0)
  return Math.ceil((new Date(iso).getTime() - todayUtc.getTime()) / (1000 * 60 * 60 * 24))
}

const fireNotifications = (interviews: Interview[]) => {
  if (Notification.permission !== 'granted') return
  const fired = getFiredIds()
  interviews.forEach((interview) => {
    if (!interview.interviewDate) return
    const days = daysUntil(interview.interviewDate)
    if (days > 1 || days < 0) return
    if (fired.includes(interview.id)) return
    const when = days === 0 ? 'Today' : 'Tomorrow'
    new Notification(`Interview ${when}: ${interview.positionTitle}`, {
      body: `${interview.companyName} — ${new Date(interview.interviewDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })}`,
      icon: '/apple-touch-icon.png',
    })
    markFired(interview.id)
  })
}

export const useInterviewReminders = (interviews: Interview[]) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  )

  useEffect(() => {
    if (permission === 'granted') fireNotifications(interviews)
  }, [permission, interviews])

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  const supported = typeof Notification !== 'undefined'

  return { permission, requestPermission, supported }
}
