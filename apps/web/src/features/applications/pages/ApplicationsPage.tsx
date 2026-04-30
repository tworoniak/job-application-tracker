import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { FilterPanel } from '../components/FilterPanel';
import { ApplicationDetailDrawer } from '../components/ApplicationDetailDrawer';
import { useApplications } from '../hooks/useApplications';
import { useExportCsv } from '../hooks/useExportCsv';
import { useBulkDeleteApplications } from '../hooks/useBulkDeleteApplications';
import { useBulkUpdateOutcome } from '../hooks/useBulkUpdateOutcome';
import { ConfirmDialog } from '@/components/ui';
import type {
  ApplicationFilters,
  ApplicationSort,
  SortField,
  Outcome,
  JobApplication,
} from '../types';
import { OUTCOME_LABELS } from '../types';
import { Download, Plus, SlidersHorizontal } from 'lucide-react';

type QuickFilter = 'all' | 'active' | 'interviewing' | 'offers' | 'closed';

const QUICK_FILTER_OUTCOMES: Record<Exclude<QuickFilter, 'all'>, Outcome[]> = {
  active: ['APPLIED', 'PHONE_SCREEN'],
  interviewing: ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED'],
  offers: ['OFFER_RECEIVED', 'OFFER_ACCEPTED'],
  closed: ['REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED'],
};

const QUICK_FILTER_LABELS: Record<QuickFilter, string> = {
  all: 'All',
  active: 'Active',
  interviewing: 'Interviewing',
  offers: 'Offers',
  closed: 'Closed',
};

const OUTCOMES: Outcome[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
];

function deriveQuickFilter(outcomes: Outcome[] | undefined): QuickFilter {
  if (!outcomes?.length) return 'all';
  for (const [key, values] of Object.entries(QUICK_FILTER_OUTCOMES) as [Exclude<QuickFilter, 'all'>, Outcome[]][]) {
    if (outcomes.length === values.length && values.every((v) => outcomes.includes(v))) {
      return key;
    }
  }
  return 'all';
}

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [sort, setSort] = useState<ApplicationSort>({ field: 'DATE_APPLIED', direction: 'DESC' });
  const [searchInput, setSearchInput] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Detail drawer
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [drawerEditMode, setDrawerEditMode] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkOutcome, setBulkOutcome] = useState<Outcome>('APPLIED');
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const { applications, totalCount, loading, loadMore } = useApplications(filters, sort);
  const { exportCsv, loading: exporting } = useExportCsv();
  const { bulkDelete, loading: bulkDeleting } = useBulkDeleteApplications();
  const { bulkUpdateOutcome, loading: bulkUpdating } = useBulkUpdateOutcome();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.target as HTMLElement).isContentEditable) return;
      if (e.key === 'n' || e.key === 'N') navigate('/applications/new');
      if (e.key === 'Escape') setSelectedIds(new Set());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'ASC' ? 'DESC' : 'ASC' }
        : { field, direction: 'DESC' },
    );
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: value || undefined }));
    }, 300);
  };

  const handleQuickFilter = (qf: QuickFilter) => {
    setFilters((f) => ({
      ...f,
      outcomes: qf === 'all' ? undefined : QUICK_FILTER_OUTCOMES[qf],
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
  };

  const handleRowClick = (app: JobApplication) => {
    setSelectedAppId(app.id);
    setDrawerEditMode(false);
  };

  const handleEditClick = (app: JobApplication) => {
    setSelectedAppId(app.id);
    setDrawerEditMode(true);
  };

  const handleBulkDelete = async () => {
    await bulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setConfirmBulkDelete(false);
  };

  const handleBulkUpdateOutcome = async () => {
    await bulkUpdateOutcome(Array.from(selectedIds), bulkOutcome);
    setSelectedIds(new Set());
  };

  const activeQuickFilter = deriveQuickFilter(filters.outcomes);

  const popupFilterCount =
    (filters.outcomes?.length ?? 0) +
    (filters.roleTypes?.length ?? 0) +
    (filters.locationTypes?.length ?? 0) +
    (filters.dateAppliedFrom ? 1 : 0);

  const selectionCount = selectedIds.size;

  return (
    <div>
      {/* Page header */}
      <div className='flex items-baseline justify-between mb-5'>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display,-apple-system)',
              fontSize: '28px',
              fontWeight: '600',
              color: '#1d1d1f',
              lineHeight: '1.14',
              letterSpacing: '-0.28px',
            }}
          >
            Applications
          </h1>
          <p style={{ marginTop: '4px', fontSize: '14px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.224px' }}>
            {totalCount} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportCsv}
            disabled={exporting}
            className='flex gap-1 items-center hover:opacity-80'
            style={{
              padding: '8px 15px', fontSize: '14px', fontWeight: '400',
              color: 'rgba(0,0,0,0.72)', background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.16)', borderRadius: '8px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.224px', opacity: exporting ? 0.5 : 1,
            }}
          >
            <Download size={16} />
            <span className='hidden sm:block'>{exporting ? 'Exporting…' : 'Export'}</span>
          </button>
          <button
            onClick={() => navigate('/applications/new')}
            className='flex gap-1 items-center hover:opacity-80'
            style={{
              padding: '8px 15px', fontSize: '14px', fontWeight: '400',
              color: '#ffffff', background: '#0071e3',
              border: '1px solid transparent', borderRadius: '8px',
              cursor: 'pointer', letterSpacing: '-0.224px',
            }}
          >
            <Plus size={16} />
            <span className='hidden sm:block'>New Application</span>
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Quick-filter pills */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: '1 1 auto' }}>
          {(Object.keys(QUICK_FILTER_LABELS) as QuickFilter[]).map((qf) => {
            const active = activeQuickFilter === qf;
            return (
              <button
                key={qf}
                onClick={() => handleQuickFilter(qf)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '980px',
                  fontSize: '13px',
                  fontWeight: active ? '600' : '400',
                  letterSpacing: '-0.12px',
                  border: active ? '1px solid #0071e3' : '1px solid rgba(0,0,0,0.14)',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  background: active ? '#0071e3' : 'transparent',
                  color: active ? '#ffffff' : 'rgba(0,0,0,0.72)',
                  whiteSpace: 'nowrap',
                }}
              >
                {QUICK_FILTER_LABELS[qf]}
              </button>
            );
          })}
        </div>

        {/* Search + Filter button */}
        <div style={{ display: 'flex', gap: '8px', position: 'relative', flexShrink: 0 }}>
          <input
            type='search'
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search company, role…'
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '14px',
              color: '#1d1d1f',
              letterSpacing: '-0.224px',
              outline: 'none',
              width: '200px',
            }}
          />
          <button
            ref={filterBtnRef}
            onClick={() => setFilterPanelOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 13px',
              fontSize: '13px',
              fontWeight: popupFilterCount > 0 ? '600' : '400',
              color: popupFilterCount > 0 ? '#0071e3' : 'rgba(0,0,0,0.72)',
              background: popupFilterCount > 0 ? 'rgba(0,113,227,0.06)' : '#ffffff',
              border: '1px solid',
              borderColor: popupFilterCount > 0 ? 'rgba(0,113,227,0.30)' : 'rgba(0,0,0,0.14)',
              borderRadius: '10px',
              cursor: 'pointer',
              letterSpacing: '-0.12px',
              whiteSpace: 'nowrap',
            }}
          >
            <SlidersHorizontal size={14} />
            {popupFilterCount > 0 ? `Filter (${popupFilterCount})` : 'Filter'}
          </button>

          {filterPanelOpen && (
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setFilterPanelOpen(false)}
              triggerRef={filterBtnRef}
            />
          )}
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectionCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            marginBottom: '8px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px',
            border: '1px solid rgba(0,113,227,0.18)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '13px', color: '#0071e3', fontWeight: '600', letterSpacing: '-0.12px', marginRight: '4px' }}>
            {selectionCount} selected
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={bulkOutcome}
              onChange={(e) => setBulkOutcome(e.target.value as Outcome)}
              style={{
                fontSize: '13px', color: '#1d1d1f', background: '#fafafc',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: '6px',
                padding: '4px 8px', letterSpacing: '-0.12px', outline: 'none', cursor: 'pointer',
              }}
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>{OUTCOME_LABELS[o]}</option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdateOutcome}
              disabled={bulkUpdating}
              style={{
                fontSize: '13px', color: '#ffffff', background: '#0071e3',
                border: 'none', borderRadius: '6px', padding: '5px 12px',
                cursor: bulkUpdating ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.12px', opacity: bulkUpdating ? 0.6 : 1,
              }}
            >
              {bulkUpdating ? 'Updating…' : 'Update Status'}
            </button>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.10)', margin: '0 2px' }} />

          <button
            onClick={() => setConfirmBulkDelete(true)}
            style={{ fontSize: '13px', color: 'rgba(0,0,0,0.48)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}
          >
            Delete {selectionCount}
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(0,0,0,0.40)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}
          >
            Clear
          </button>
        </div>
      )}

      <ApplicationsTable
        data={applications}
        loading={loading}
        sortField={sort.field}
        sortDirection={sort.direction}
        onSortChange={handleSortChange}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={handleRowClick}
        onEditClick={handleEditClick}
      />

      <div ref={sentinelRef} style={{ height: '1px' }} />

      {selectedAppId && (
        <ApplicationDetailDrawer
          appId={selectedAppId}
          initialEditMode={drawerEditMode}
          onClose={() => setSelectedAppId(null)}
        />
      )}

      <ConfirmDialog
        open={confirmBulkDelete}
        title={`Delete ${selectionCount} application${selectionCount === 1 ? '' : 's'}?`}
        description={`This will permanently remove ${selectionCount} application${selectionCount === 1 ? '' : 's'}. This cannot be undone.`}
        confirmLabel={`Delete ${selectionCount}`}
        loading={bulkDeleting}
        onCancel={() => setConfirmBulkDelete(false)}
        onConfirm={handleBulkDelete}
      />

      {(!!filters.search || popupFilterCount > 0) && !filterPanelOpen && (
        <button
          onClick={clearFilters}
          style={{ marginTop: '8px', fontSize: '12px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px', padding: 0 }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};
