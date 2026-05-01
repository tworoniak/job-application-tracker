import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Briefcase } from 'lucide-react';
import { CommandPalette } from '@/components/ui';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className='flex min-h-screen'>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 md:hidden'
          onClick={() => setSidebarOpen(false)}
          aria-hidden='true'
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSearchClick={() => setPaletteOpen(true)}
      />

      <div className='flex-1 flex flex-col min-w-0 overflow-x-hidden'>
        {/* Mobile top bar */}
        <header className='md:hidden sticky top-0 z-30 h-12 bg-white border-b border-neutral-200 flex items-center px-4 gap-3 shrink-0'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='p-1 -ml-1 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors'
            aria-label='Open menu'
          >
            <Menu size={20} />
          </button>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center'>
              <Briefcase size={12} color='white' />
            </div>
            <span className='font-display font-semibold text-sm text-neutral-900'>
              JobTrack
            </span>
          </div>
        </header>

        <main className='flex-1 px-4 py-6 md:px-8 md:py-8'>
          <Outlet />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
};
