import { Link } from 'react-router-dom';
import type { DashboardMetrics } from '../hooks/useDashboardMetrics';

type Interview = DashboardMetrics['upcomingInterviews'][number];

type DateBadgeProps = {
  date: string | null;
  isActive?: boolean;
};

export function DateBadge({ date, isActive }: DateBadgeProps) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  const month = d.toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  const day = d.toLocaleDateString('en-US', {
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'w-12 h-12 rounded-lg border',
        'leading-none',
        isActive
          ? 'bg-white border-neutral-300 shadow-sm'
          : 'bg-blue-50 border-blue-200 border-t-blue-400 border-t-3',
      ].join(' ')}
    >
      <span className='text-xs font-medium tracking-wide text-blue-500 uppercase leading-none'>
        {month}
      </span>

      <span className='text-lg font-bold text-neutral-500 leading-none '>
        {day}
      </span>
    </div>
  );
}

// const formatDate = (iso: string) =>
//   new Date(iso).toLocaleDateString('en-US', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     timeZone: 'UTC',
//   });

const daysUntil = (iso: string) => {
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  const diff = new Date(iso).getTime() - todayUtc.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

export const UpcomingInterviews = ({
  interviews,
}: {
  interviews: Interview[];
}) => {
  if (!interviews.length) {
    return (
      <p className='text-sm text-gray-400 py-4 text-center'>
        No upcoming interviews
      </p>
    );
  }

  return (
    <ul className='divide-y divide-gray-100'>
      {interviews.map((interview) => (
        <li key={interview.id} className='py-3'>
          <Link
            to={`/applications/${interview.id}`}
            className='flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors'
          >
            <div className='flex items-center gap-2'>
              <DateBadge date={interview.interviewDate} />
              <div>
                <p className='text-md font-semibold text-gray-900'>
                  {interview.companyName}
                </p>
                <p className='text-xs text-gray-500 -mt-0.5'>
                  {interview.positionTitle}
                </p>
              </div>
            </div>

            <div className='text-right shrink-0 ml-4'>
              <p className='text-xs font-medium text-blue-600'>
                {daysUntil(interview.interviewDate!)}
              </p>
              {/* <p className='text-xs text-gray-400'>
                {formatDate(interview.interviewDate!)}
              </p> */}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
