import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationsTable } from '../components/ApplicationsTable'
import { useApplications } from '../hooks/useApplications'
import { useExportCsv } from '../hooks/useExportCsv'
import type { ApplicationFilters, ApplicationSort, SortField, Outcome, RoleType, LocationType } from '../types'
import { OUTCOME_LABELS, ROLE_TYPE_LABELS, LOCATION_TYPE_LABELS } from '../types'

const OUTCOMES: Outcome[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
]
const ROLE_TYPES: RoleType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']
const LOCATION_TYPES: LocationType[] = ['ON_SITE', 'HYBRID', 'REMOTE']

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
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: '#0071e3',
  color: '#ffffff',
  border: '1px solid #0071e3',
}

export const ApplicationsPage = () => {
  const navigate = useNavigate()
  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [filters, setFilters] = useState<ApplicationFilters>({})
  const [sort, setSort] = useState<ApplicationSort>({ field: 'DATE_APPLIED', direction: 'DESC' })
  const [searchInput, setSearchInput] = useState('')

  const { applications, totalCount, hasNextPage, loading, loadMore } = useApplications(filters, sort)
  const { exportCsv, loading: exporting } = useExportCsv()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.target as HTMLElement).isContentEditable) return
      if (e.key === 'n' || e.key === 'N') navigate('/applications/new')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'ASC' ? 'DESC' : 'ASC' }
        : { field, direction: 'DESC' },
    )
  }, [])

  const handleSearch = (value: string) => {
    setSearchInput(value)
    clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: value || undefined }))
    }, 300)
  }

  const toggleFilter = <T extends string>(key: 'outcomes' | 'roleTypes' | 'locationTypes', value: T) => {
    setFilters((prev) => {
      const current = (prev[key] as T[] | undefined) ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [key]: next.length ? next : undefined }
    })
  }

  const clearFilters = () => { setFilters({}); setSearchInput('') }

  const hasActiveFilters =
    !!filters.search || !!filters.outcomes?.length || !!filters.roleTypes?.length || !!filters.locationTypes?.length

  return (
    <div>
      {/* Page header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display,-apple-system)', fontSize: '28px', fontWeight: '600', color: '#1d1d1f', lineHeight: '1.14', letterSpacing: '-0.28px' }}>
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
            style={{ padding: '8px 15px', fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,0.72)', background: '#ffffff', border: '1px solid rgba(0,0,0,0.16)', borderRadius: '8px', cursor: exporting ? 'not-allowed' : 'pointer', letterSpacing: '-0.224px', opacity: exporting ? 0.5 : 1 }}
          >
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button
            onClick={() => navigate('/applications/new')}
            style={{ padding: '8px 15px', fontSize: '14px', fontWeight: '400', color: '#ffffff', background: '#0071e3', border: '1px solid transparent', borderRadius: '8px', cursor: 'pointer', letterSpacing: '-0.224px' }}
          >
            + New Application
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 20px', marginBottom: '12px', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search company or position…"
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

        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {[
            { key: 'outcomes' as const, label: 'Status', items: OUTCOMES, labels: OUTCOME_LABELS, active: filters.outcomes },
            { key: 'roleTypes' as const, label: 'Type', items: ROLE_TYPES, labels: ROLE_TYPE_LABELS, active: filters.roleTypes },
            { key: 'locationTypes' as const, label: 'Location', items: LOCATION_TYPES, labels: LOCATION_TYPE_LABELS, active: filters.locationTypes },
          ].map(({ key, label, items, labels, active }) => (
            <div key={key}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,0,0,0.40)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                {label}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(items as string[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleFilter(key, item as never)}
                    style={(active as string[] | undefined)?.includes(item) ? pillActive : pillBase}
                  >
                    {(labels as Record<string, string>)[item]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{ marginTop: '12px', fontSize: '12px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}
          >
            Clear all filters
          </button>
        )}
      </div>

      <ApplicationsTable
        data={applications}
        loading={loading}
        sortField={sort.field}
        sortDirection={sort.direction}
        onSortChange={handleSortChange}
      />

      {hasNextPage && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            style={{ fontSize: '14px', color: '#0071e3', background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, letterSpacing: '-0.224px' }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
