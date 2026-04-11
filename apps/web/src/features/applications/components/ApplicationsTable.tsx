import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { RoleTypeBadge, LocationTypeBadge, ConfirmDialog, TableSkeleton } from '@/components/ui'
import { useDeleteApplication } from '../hooks/useDeleteApplication'
import { useUpdateApplication } from '../hooks/useUpdateApplication'
import type { JobApplication, Outcome, SortField, SortDirection } from '../types'
import { OUTCOME_LABELS } from '../types'

const OUTCOMES: Outcome[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
]

const outcomeSelectStyle = (outcome: Outcome): React.CSSProperties => {
  const styles: Record<Outcome, { bg: string; color: string }> = {
    APPLIED:              { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    PHONE_SCREEN:         { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    INTERVIEW_SCHEDULED:  { bg: 'rgba(0,113,227,0.12)', color: '#0071e3' },
    INTERVIEW_COMPLETED:  { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    OFFER_RECEIVED:       { bg: 'rgba(29,29,31,0.08)',  color: '#1d1d1f' },
    OFFER_ACCEPTED:       { bg: 'rgba(29,29,31,0.10)',  color: '#1d1d1f' },
    REJECTED:             { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.48)' },
    WITHDRAWN:            { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.48)' },
    NO_RESPONSE:          { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.40)' },
    GHOSTED:              { bg: 'rgba(0,0,0,0.03)',     color: 'rgba(0,0,0,0.32)' },
  }
  const { bg, color } = styles[outcome]
  return {
    background: bg,
    color,
    border: 'none',
    borderRadius: '980px',
    padding: '2px 8px',
    fontSize: '12px',
    letterSpacing: '-0.12px',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
  }
}

interface Props {
  data: JobApplication[]
  loading: boolean
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

const formatSalary = (min: number | null, max: number | null, type: JobApplication['salaryType']) => {
  if (!min && !max) return '—'
  if (type === 'HOURLY') {
    const fmt = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(2)}/hr`
    if (min && max) return `${fmt(min)}–${fmt(max)}`
    return min ? `${fmt(min)}+` : `up to ${fmt(max!)}`
  }
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  return min ? `${fmt(min)}+` : `up to ${fmt(max!)}`
}

const SortBtn = ({
  label,
  field,
  active,
  direction,
  onClick,
}: {
  label: string
  field: SortField
  active: boolean
  direction: SortDirection
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: active ? '#1d1d1f' : 'rgba(0,0,0,0.48)',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    }}
  >
    {label}
    <span style={{ opacity: active ? 1 : 0.4 }}>
      {active ? (direction === 'ASC' ? '↑' : '↓') : '↕'}
    </span>
  </button>
)

// Checkbox with indeterminate support
const Checkbox = ({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ width: '15px', height: '15px', accentColor: '#0071e3', cursor: 'pointer' }}
    />
  )
}

// ── Mobile application card ──────────────────────────────────────────────────
interface CardProps {
  app: JobApplication
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onNavigate: () => void
  onOutcomeChange: (outcome: Outcome) => void
}

const ApplicationCard = ({
  app,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onNavigate,
  onOutcomeChange,
}: CardProps) => (
  <div
    onClick={onNavigate}
    style={{
      background: selected ? 'rgba(0,113,227,0.04)' : '#ffffff',
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '8px',
      boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px',
      cursor: 'pointer',
      border: selected ? '1px solid rgba(0,113,227,0.20)' : '1px solid transparent',
      transition: 'background 0.1s, border-color 0.1s',
    }}
  >
    {/* Row 1: Company + status select */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1d1d1f',
            letterSpacing: '-0.3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {app.companyName}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(0,0,0,0.48)',
            marginTop: '2px',
            letterSpacing: '-0.12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {app.positionTitle}
        </div>
      </div>

      {/* Status select — stops propagation so card click doesn't navigate */}
      <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
        <select
          value={app.outcome}
          style={outcomeSelectStyle(app.outcome)}
          onChange={(e) => onOutcomeChange(e.target.value as Outcome)}
        >
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>{OUTCOME_LABELS[o]}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Row 2: Badges + date + actions */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '10px',
        flexWrap: 'wrap',
      }}
    >
      <RoleTypeBadge roleType={app.roleType} />
      <LocationTypeBadge locationType={app.locationType} />

      <span
        style={{
          marginLeft: 'auto',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.36)',
          letterSpacing: '-0.12px',
          whiteSpace: 'nowrap',
        }}
      >
        {formatDate(app.dateApplied)}
      </span>
    </div>

    {/* Row 3: Actions + checkbox — stops propagation */}
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Checkbox checked={selected} onChange={onSelect} />

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
        <button
          onClick={onEdit}
          style={{
            fontSize: '13px',
            color: '#0071e3',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.12px',
            padding: '2px 0',
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            fontSize: '13px',
            color: 'rgba(0,0,0,0.36)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.12px',
            padding: '2px 0',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)
// ────────────────────────────────────────────────────────────────────────────

export const ApplicationsTable = ({ data, loading, sortField, sortDirection, onSortChange, selectedIds, onSelectionChange }: Props) => {
  const navigate = useNavigate()
  const { deleteApplication, loading: deleteLoading } = useDeleteApplication()
  const { updateApplication } = useUpdateApplication()
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const allVisibleSelected = data.length > 0 && data.every((r) => selectedIds.has(r.id))
  const someVisibleSelected = data.some((r) => selectedIds.has(r.id))

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  const toggleAll = (checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) data.forEach((r) => next.add(r.id))
    else data.forEach((r) => next.delete(r.id))
    onSelectionChange(next)
  }

  const columns: ColumnDef<JobApplication>[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={allVisibleSelected}
          indeterminate={!allVisibleSelected && someVisibleSelected}
          onChange={toggleAll}
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedIds.has(row.original.id)}
            onChange={() => toggleRow(row.original.id)}
          />
        </div>
      ),
    },
    {
      accessorKey: 'companyName',
      header: () => (
        <SortBtn label="Company" field="COMPANY_NAME" active={sortField === 'COMPANY_NAME'} direction={sortDirection} onClick={() => onSortChange('COMPANY_NAME')} />
      ),
      cell: ({ row }) => (
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.224px' }}>
            {row.original.companyName}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.48)', marginTop: '1px', letterSpacing: '-0.12px' }}>
            {row.original.positionTitle}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'outcome',
      header: () => (
        <SortBtn label="Status" field="OUTCOME" active={sortField === 'OUTCOME'} direction={sortDirection} onClick={() => onSortChange('OUTCOME')} />
      ),
      cell: ({ row }) => (
        <select
          value={row.original.outcome}
          style={outcomeSelectStyle(row.original.outcome)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation()
            updateApplication(row.original.id, { outcome: e.target.value as Outcome }, row.original)
          }}
        >
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>{OUTCOME_LABELS[o]}</option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: 'roleType',
      header: () => <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(0,0,0,0.48)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Type</span>,
      cell: ({ getValue }) => <RoleTypeBadge roleType={getValue() as JobApplication['roleType']} />,
    },
    {
      accessorKey: 'locationType',
      header: () => <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(0,0,0,0.48)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Location</span>,
      cell: ({ getValue }) => <LocationTypeBadge locationType={getValue() as JobApplication['locationType']} />,
    },
    {
      accessorKey: 'dateApplied',
      header: () => (
        <SortBtn label="Applied" field="DATE_APPLIED" active={sortField === 'DATE_APPLIED'} direction={sortDirection} onClick={() => onSortChange('DATE_APPLIED')} />
      ),
      cell: ({ getValue }) => (
        <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.72)', letterSpacing: '-0.224px' }}>
          {formatDate(getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'salaryMin',
      header: () => (
        <SortBtn label="Salary" field="SALARY_MIN" active={sortField === 'SALARY_MIN'} direction={sortDirection} onClick={() => onSortChange('SALARY_MIN')} />
      ),
      cell: ({ row }) => (
        <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.72)', letterSpacing: '-0.224px' }}>
          {formatSalary(row.original.salaryMin, row.original.salaryMax, row.original.salaryType)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/applications/${row.original.id}/edit`)}
            style={{ fontSize: '14px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.224px' }}
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteTarget(row.original)}
            style={{ fontSize: '14px', color: 'rgba(0,0,0,0.40)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.224px' }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({ data, columns, manualSorting: true, getCoreRowModel: getCoreRowModel() })

  if (loading && data.length === 0) return <TableSkeleton />

  if (!loading && data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0',
          background: '#ffffff',
          borderRadius: '12px',
        }}
      >
        <p style={{ fontSize: '17px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.374px' }}>
          No applications yet.
        </p>
        <button
          onClick={() => navigate('/applications/new')}
          style={{ marginTop: '12px', fontSize: '14px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.224px' }}
        >
          Add your first application →
        </button>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: card list ───────────────────────────────────────────── */}
      <div className="block sm:hidden" style={{ paddingBottom: '16px' }}>
        {data.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            selected={selectedIds.has(app.id)}
            onSelect={() => toggleRow(app.id)}
            onNavigate={() => navigate(`/applications/${app.id}`)}
            onEdit={() => navigate(`/applications/${app.id}/edit`)}
            onDelete={() => setDeleteTarget(app)}
            onOutcomeChange={(outcome) =>
              updateApplication(app.id, { outcome }, app)
            }
          />
        ))}
      </div>

      {/* ── Desktop: table ──────────────────────────────────────────────── */}
      <div className="hidden sm:block" style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: header.id === 'select' ? '12px 8px 12px 16px' : '12px 16px',
                      textAlign: 'left',
                      background: '#fafafc',
                      width: header.id === 'select' ? '40px' : undefined,
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => navigate(`/applications/${row.original.id}`)}
                onFocus={() => setFocusedId(row.original.id)}
                onBlur={() => setFocusedId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/applications/${row.original.id}`)
                  if (e.key === 'e' || e.key === 'E') navigate(`/applications/${row.original.id}/edit`)
                  if (e.key === 'Delete' || e.key === 'Backspace') setDeleteTarget(row.original)
                }}
                style={{
                  borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  background: selectedIds.has(row.original.id) ? 'rgba(0,113,227,0.04)' : 'transparent',
                  outline: focusedId === row.original.id ? '2px solid #0071e3' : 'none',
                  outlineOffset: '-2px',
                }}
                onMouseEnter={(e) => {
                  if (!selectedIds.has(row.original.id)) e.currentTarget.style.background = '#f5f5f7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedIds.has(row.original.id) ? 'rgba(0,113,227,0.04)' : 'transparent'
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: cell.column.id === 'select' ? '14px 8px 14px 16px' : '14px 16px',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete application?"
        description={`Remove ${deleteTarget?.companyName} — ${deleteTarget?.positionTitle}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteApplication(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
