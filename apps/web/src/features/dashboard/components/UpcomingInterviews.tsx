import { Link } from 'react-router-dom'
import type { DashboardMetrics } from '../hooks/useDashboardMetrics'

type Interview = DashboardMetrics['upcomingInterviews'][number]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })

const daysUntil = (iso: string) => {
  const todayUtc = new Date()
  todayUtc.setUTCHours(0, 0, 0, 0)
  const diff = new Date(iso).getTime() - todayUtc.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export const UpcomingInterviews = ({ interviews }: { interviews: Interview[] }) => {
  if (!interviews.length) {
    return <p className="text-sm text-gray-400 py-4 text-center">No upcoming interviews</p>
  }

  return (
    <ul className="divide-y divide-gray-100">
      {interviews.map((interview) => (
        <li key={interview.id} className="py-3">
          <Link
            to={`/applications/${interview.id}`}
            className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{interview.positionTitle}</p>
              <p className="text-xs text-gray-500">{interview.companyName}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-xs font-medium text-blue-600">{daysUntil(interview.interviewDate!)}</p>
              <p className="text-xs text-gray-400">{formatDate(interview.interviewDate!)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
