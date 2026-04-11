import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationsTable } from '../components/ApplicationsTable';
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
  RoleType,
  LocationType,
} from '../types';
import {
  OUTCOME_LABELS,
  ROLE_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
} from '../types';
import { Download, Plus, SlidersHorizontal } from 'lucide-react';

const OUTCOMES: Outcome[] = [
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED',
  'OFFER_ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
  'NO_RESPONSE',
  'GHOSTED',
];
const ROLE_TYPES: RoleType[] = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'FREELANCE',
  'INTERNSHIP',
];
const LOCATION_TYPES: LocationType[] = ['ON_SITE', 'HYBRID', 'REMOTE'];

const pillBase: React.CSSProperties = {
  padding: '4px 14px',
  borderRadius: '980px',
  fontSize: '12px',
  fontWeight: '400',
  letterSpacing: '-0.12px',
  border: '1px solid rgba(0,0,0,0.16)',
  cursor: 'pointer',
  transition: 'all 0.1s',
  background: 'transparent',
  color: 'rgba(0,0,0,0.72)',
  whiteSpace: 'nowrap',
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: '#0071e3',
  color: '#ffffff',
  border: '1px solid #0071e3',
};

const dateInputStyle: React.CSSProperties = {
  background: '#fafafc',
  border: '3px solid rgba(0,0,0,0.04)',
  borderRadius: '8px',
  padding: '4px 10px',
  fontSize: '13px',
  color: '#1d1d1f',
  letterSpacing: '-0.12px',
  outline: 'none',
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  color: 'rgba(0,0,0,0.40)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '8px',
};

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [sort, setSort] = useState<ApplicationSort>({
    field: 'DATE_APPLIED',
    direction: 'DESC',
  });
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkOutcome, setBulkOutcome] = useState<Outcome>('APPLIED');
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const { applications, totalCount, loading, loadMore } = useApplications(
    filters,
    sort,
  );
  const { exportCsv, loading: exporting } = useExportCsv();
  const { bulkDelete, loading: bulkDeleting } = useBulkDeleteApplications();
  const { bulkUpdateOutcome, loading: bulkUpdating } = useBulkUpdateOutcome();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
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

  const toggleFilter = <T extends string>(
    key: 'outcomes' | 'roleTypes' | 'locationTypes',
    value: T,
  ) => {
    setFilters((prev) => {
      const current = (prev[key] as T[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next.length ? next : undefined };
    });
  };

  const handleDateFrom = (value: string) => {
    setDateFrom(value);
    setFilters((f) => ({ ...f, dateAppliedFrom: value || undefined }));
  };

  const handleDateTo = (value: string) => {
    setDateTo(value);
    setFilters((f) => ({ ...f, dateAppliedTo: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
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

  const hasActiveFilters =
    !!filters.search ||
    !!filters.outcomes?.length ||
    !!filters.roleTypes?.length ||
    !!filters.locationTypes?.length ||
    !!filters.dateAppliedFrom ||
    !!filters.dateAppliedTo;

  // Count of non-search active filters (for the mobile Filters button badge)
  const activeFilterCount =
    (filters.outcomes?.length ?? 0) +
    (filters.roleTypes?.length ?? 0) +
    (filters.locationTypes?.length ?? 0) +
    (filters.dateAppliedFrom ? 1 : 0) +
    (filters.dateAppliedTo ? 1 : 0);

  const selectionCount = selectedIds.size;

  return (
    <div>
      {/* Page header */}
      <div className='flex items-baseline justify-between mb-6'>
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
          <p
            style={{
              marginTop: '4px',
              fontSize: '14px',
              color: 'rgba(0,0,0,0.48)',
              letterSpacing: '-0.224px',
            }}
          >
            {totalCount} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportCsv}
            disabled={exporting}
            className='flex gap-1 items-center hover:opacity-80'
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              fontWeight: '400',
              color: 'rgba(0,0,0,0.72)',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.16)',
              borderRadius: '8px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.224px',
              opacity: exporting ? 0.5 : 1,
            }}
          >
            <Download size={16} />{' '}
            <span className='hidden sm:block'>
              {exporting ? 'Exporting…' : 'Export CSV'}
            </span>
          </button>
          <button
            onClick={() => navigate('/applications/new')}
            className='flex gap-1 items-center hover:opacity-80'
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              fontWeight: '400',
              color: '#ffffff',
              background: '#0071e3',
              border: '1px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              letterSpacing: '-0.224px',
            }}
          >
            <Plus size={16} />{' '}
            <span className='hidden sm:block'>New Application</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE: sticky search + filter trigger ── */}
      <div
        className='sm:hidden sticky z-30'
        style={{
          top: '48px', // below the 48px navbar
          background: 'rgba(245,245,247,0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          marginLeft: '-24px',
          marginRight: '-24px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '8px',
          paddingBottom: '10px',
          marginBottom: '12px',
        }}
      >
        {/* Search input + Filters button */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type='search'
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search company or position…'
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '10px',
              padding: '9px 14px',
              fontSize: '15px',
              color: '#1d1d1f',
              letterSpacing: '-0.224px',
              outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '9px 13px',
              fontSize: '14px',
              fontWeight: activeFilterCount > 0 ? '600' : '400',
              color: activeFilterCount > 0 ? '#0071e3' : 'rgba(0,0,0,0.72)',
              background:
                activeFilterCount > 0 ? 'rgba(0,113,227,0.08)' : '#ffffff',
              border: '1px solid',
              borderColor:
                activeFilterCount > 0
                  ? 'rgba(0,113,227,0.24)'
                  : 'rgba(0,0,0,0.12)',
              borderRadius: '10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.12px',
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0
              ? `Filters (${activeFilterCount})`
              : 'Filters'}
          </button>
        </div>
      </div>

      {/* ── MOBILE: collapsible filter panel (Type, Location, Date) ── */}
      {filtersOpen && (
        <div
          className='sm:hidden'
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '12px',
            boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px',
          }}
        >
          {[
            {
              key: 'outcomes' as const,
              label: 'Status',
              items: OUTCOMES,
              labels: OUTCOME_LABELS,
              active: filters.outcomes,
            },
            {
              key: 'roleTypes' as const,
              label: 'Type',
              items: ROLE_TYPES,
              labels: ROLE_TYPE_LABELS,
              active: filters.roleTypes,
            },
            {
              key: 'locationTypes' as const,
              label: 'Location',
              items: LOCATION_TYPES,
              labels: LOCATION_TYPE_LABELS,
              active: filters.locationTypes,
            },
          ].map(({ key, label, items, labels, active }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <p style={filterLabelStyle}>{label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(items as string[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleFilter(key, item as never)}
                    style={
                      (active as string[] | undefined)?.includes(item)
                        ? pillActive
                        : pillBase
                    }
                  >
                    {(labels as Record<string, string>)[item]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <p style={filterLabelStyle}>Applied From</p>
              <input
                type='date'
                value={dateFrom}
                onChange={(e) => handleDateFrom(e.target.value)}
                style={dateInputStyle}
              />
            </div>
            <div>
              <p style={filterLabelStyle}>Applied To</p>
              <input
                type='date'
                value={dateTo}
                onChange={(e) => handleDateTo(e.target.value)}
                style={dateInputStyle}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: '14px',
                fontSize: '13px',
                color: '#0071e3',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.12px',
                padding: 0,
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── DESKTOP: full filter card ── */}
      <div
        className='hidden sm:block'
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '12px',
          boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px',
        }}
      >
        <input
          type='search'
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search company or position…'
          style={{
            width: '100%',
            background: '#fafafc',
            border: '3px solid rgba(0,0,0,0.04)',
            borderRadius: '11px',
            padding: '8px 14px',
            fontSize: '14px',
            color: '#1d1d1f',
            letterSpacing: '-0.224px',
            outline: 'none',
          }}
        />

        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {[
            {
              key: 'outcomes' as const,
              label: 'Status',
              items: OUTCOMES,
              labels: OUTCOME_LABELS,
              active: filters.outcomes,
            },
            {
              key: 'roleTypes' as const,
              label: 'Type',
              items: ROLE_TYPES,
              labels: ROLE_TYPE_LABELS,
              active: filters.roleTypes,
            },
            {
              key: 'locationTypes' as const,
              label: 'Location',
              items: LOCATION_TYPES,
              labels: LOCATION_TYPE_LABELS,
              active: filters.locationTypes,
            },
          ].map(({ key, label, items, labels, active }) => (
            <div key={key}>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.40)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                }}
              >
                {label}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(items as string[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleFilter(key, item as never)}
                    style={
                      (active as string[] | undefined)?.includes(item)
                        ? pillActive
                        : pillBase
                    }
                  >
                    {(labels as Record<string, string>)[item]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(0,0,0,0.40)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              Applied From
            </p>
            <input
              type='date'
              value={dateFrom}
              onChange={(e) => handleDateFrom(e.target.value)}
              style={dateInputStyle}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(0,0,0,0.40)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              Applied To
            </p>
            <input
              type='date'
              value={dateTo}
              onChange={(e) => handleDateTo(e.target.value)}
              style={dateInputStyle}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#0071e3',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.12px',
            }}
          >
            Clear all filters
          </button>
        )}
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
          <span
            style={{
              fontSize: '13px',
              color: '#0071e3',
              fontWeight: '600',
              letterSpacing: '-0.12px',
              marginRight: '4px',
            }}
          >
            {selectionCount} selected
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={bulkOutcome}
              onChange={(e) => setBulkOutcome(e.target.value as Outcome)}
              style={{
                fontSize: '13px',
                color: '#1d1d1f',
                background: '#fafafc',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '6px',
                padding: '4px 8px',
                letterSpacing: '-0.12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>
                  {OUTCOME_LABELS[o]}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdateOutcome}
              disabled={bulkUpdating}
              style={{
                fontSize: '13px',
                color: '#ffffff',
                background: '#0071e3',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                cursor: bulkUpdating ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.12px',
                opacity: bulkUpdating ? 0.6 : 1,
              }}
            >
              {bulkUpdating ? 'Updating…' : 'Update Status'}
            </button>
          </div>

          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'rgba(0,0,0,0.10)',
              margin: '0 2px',
            }}
          />

          <button
            onClick={() => setConfirmBulkDelete(true)}
            style={{
              fontSize: '13px',
              color: 'rgba(0,0,0,0.48)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.12px',
            }}
          >
            Delete {selectionCount}
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              marginLeft: 'auto',
              fontSize: '13px',
              color: 'rgba(0,0,0,0.40)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.12px',
            }}
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
      />

      <div ref={sentinelRef} style={{ height: '1px' }} />

      <ConfirmDialog
        open={confirmBulkDelete}
        title={`Delete ${selectionCount} application${selectionCount === 1 ? '' : 's'}?`}
        description={`This will permanently remove ${selectionCount} application${selectionCount === 1 ? '' : 's'}. This cannot be undone.`}
        confirmLabel={`Delete ${selectionCount}`}
        loading={bulkDeleting}
        onCancel={() => setConfirmBulkDelete(false)}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
};
