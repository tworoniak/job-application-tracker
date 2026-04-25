import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CommandPalette } from '@/components/ui';
import { Plus } from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/applications', label: 'Applications' },
];

export const AppLayout = () => {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Apple-style translucent dark glass nav */}
      <nav
        className='sticky top-0 z-40 h-12 flex items-center px-6 shrink-0'
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <span
          className='text-white text-md font-semibold tracking-tight shrink-0 italic'
          style={{ letterSpacing: '-0.374px' }}
        >
          JobTrack
        </span>

        <div className='flex items-center gap-1 mx-auto'>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className='text-xs px-3 py-1 rounded-full transition-colors'
              style={{
                color: pathname.startsWith(to)
                  ? '#ffffff'
                  : 'rgba(255,255,255,0.72)',
                background: pathname.startsWith(to)
                  ? 'rgba(255,255,255,0.12)'
                  : 'transparent',
                letterSpacing: '-0.12px',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className='shrink-0 flex items-center gap-2'>
          {/* ⌘K hint button */}
          <button
            onClick={() => setPaletteOpen(true)}
            className='md:flex hidden'
            style={{
              // display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.48)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '-0.12px',
              transition: 'color 0.1s, background 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.48)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <span>Commands</span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              ⌘K
            </span>
          </button>

          <Link
            to='/applications/new'
            className='flex shrink-0 text-white text-sm px-4 rounded-lg transition-opacity hover:opacity-80'
            style={{
              background: '#0071e3',
              padding: '6px 14px',
              fontSize: '14px',
              letterSpacing: '-0.224px',
              lineHeight: '1',
              borderRadius: '8px',
            }}
          >
            <Plus size={16} /> <span className='hidden sm:block'>New</span>
          </Link>
        </div>
      </nav>
      {/* max-w-245 */}
      <main className='flex-1 px-6 py-8 mx-auto w-full'>
        <Outlet />
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
};
