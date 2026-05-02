import { Link, useLocation } from 'react-router-dom';
import { getCurrentISOWeek } from '@/lib/date';
import {
  Home,
  LayoutList,
  Workflow,
  Calendar,
  BarChart3,
  Search,
  LogOut,
  Briefcase,
  X,
} from 'lucide-react';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';
import { useAuth } from '@/features/auth/AuthContext';

const WEEKLY_GOAL = 6;

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/applications', label: 'Applications', icon: LayoutList },
  { to: '/pipeline', label: 'Pipeline', icon: Workflow, placeholder: true },
  { to: '/interviews', label: 'Interviews', icon: Calendar, placeholder: true },
  { to: '/insights', label: 'Insights', icon: BarChart3, soon: true },
] as const;

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: () => void;
};

export const Sidebar = ({ isOpen, onClose, onSearchClick }: SidebarProps) => {
  const { pathname } = useLocation();
  const { metrics } = useDashboardMetrics();
  const { user, logout } = useAuth();

  const emailPrefix = user?.email.split('@')[0] ?? ''
  const initials = emailPrefix.slice(0, 2).toUpperCase()

  const thisWeekCount =
    metrics?.applicationsByWeek.find((w) => w.week === getCurrentISOWeek())
      ?.count ?? 0;
  const progress = Math.min((thisWeekCount / WEEKLY_GOAL) * 100, 100);


  return (
    <aside
      className={[
        // Mobile: fixed full-height drawer that slides in from the left
        'fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-neutral-200 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: sticky viewport-height column so bottom section stays visible on tall pages
        'md:sticky md:top-0 md:h-screen md:overflow-y-auto md:inset-auto md:z-auto md:translate-x-0',
      ].join(' ')}
    >
      {/* Logo */}
      <div className='px-4 pt-5 pb-3 flex items-center gap-2.5'>
        <div className='w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0'>
          <Briefcase size={14} color='white' />
        </div>
        <span className='font-display font-semibold text-sm text-neutral-900 tracking-tight'>
          JobTrack
        </span>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className='ml-auto p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 md:hidden'
          aria-label='Close menu'
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className='px-3 pb-3'>
        <button
          onClick={() => {
            onSearchClick();
            onClose();
          }}
          className='w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-200/60 hover:bg-neutral-200 transition-colors text-left'
        >
          <Search size={13} className='text-neutral-400 shrink-0' />
          <span className='flex-1 text-sm text-neutral-400'>
            Quick-add or search
          </span>
          <kbd className='flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs text-neutral-400 bg-neutral-300/60 font-mono leading-none'>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className='px-2 flex flex-col gap-0.5'>
        {NAV_ITEMS.map(({ to, label, icon: Icon, ...flags }) => {
          const isSoon = 'soon' in flags && flags.soon;
          const isPlaceholder = 'placeholder' in flags && flags.placeholder;
          const isDisabled = isSoon || isPlaceholder;
          const isActive = !isDisabled && pathname.startsWith(to);

          if (isDisabled) {
            return (
              <span
                key={to}
                aria-disabled='true'
                className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-400 cursor-default select-none'
              >
                <Icon size={16} className='shrink-0' />
                <span className='flex-1'>{label}</span>
                {isSoon && (
                  <span className='text-xs text-neutral-400'>Soon</span>
                )}
              </span>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-apple-blue font-semibold border-l-2 border-apple-blue pl-2.5'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              ].join(' ')}
            >
              <Icon size={16} className='shrink-0' />
              <span className='flex-1'>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='flex-1' />

      {/* This Week card */}
      <div className='mx-3 mb-3 p-3.5 rounded-xl bg-white border border-neutral-200'>
        <p className='text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2'>
          ✦ This week
        </p>
        <p className='text-3xl font-bold text-neutral-900 leading-none'>
          {thisWeekCount}
        </p>
        <p className='text-xs text-neutral-400 mt-1'>
          applications · goal {WEEKLY_GOAL}
        </p>
        <div className='mt-2.5 h-1 bg-neutral-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-blue-500 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* User section */}
      <div className='px-3 pb-4 flex items-center gap-2.5'>
        <div className='w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center shrink-0'>
          <span className='text-white text-xs font-semibold'>{initials}</span>
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-neutral-900 truncate leading-tight'>
            {emailPrefix}
          </p>
          <p className='text-xs text-neutral-400 truncate leading-tight'>
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          aria-label='Log out'
          className='p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0'
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
};
