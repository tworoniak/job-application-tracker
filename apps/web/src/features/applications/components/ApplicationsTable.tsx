import { useState } from 'react'
import { toast } from 'sonner'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { RoleTypeBadge, LocationTypeBadge, ConfirmDialog, TableSkeleton, Checkbox } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useDeleteApplication } from '../hooks/useDeleteApplication'
import { useUpdateApplication } from '../hooks/useUpdateApplication'
import type { JobApplication, Outcome, SortField, SortDirection } from '../types'
import { OUTCOMES, OUTCOME_LABELS } from '../types'
import { formatDate, formatSalary } from '../lib/formatters'
import { ApplicationCard, outcomeSelectStyle } from './ApplicationCard'
import { RowMenu } from './RowMenu'

interface Props {
  data: JobApplication[]
  loading: boolean
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onRowClick: (app: JobApplication) => void
  onEditClick: (app: JobApplication) => void
}

const SortBtn = ({
  label, active, direction, onClick,
}: {
  label: string; field: SortField; active: boolean; direction: SortDirection; onClick: () => void
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      fontSize: '12px', fontWeight: '600',
      color: active ? '#1d1d1f' : 'rgba(0,0,0,0.48)',
      letterSpacing: '0.02em', textTransform: 'uppercase',
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    }}
  >
    {label}
    <span style={{ opacity: active ? 1 : 0.4 }}>
      {active ? (direction === 'ASC' ? '↑' : '↓') : '↕'}
    </span>
  </button>
)

export const ApplicationsTable = ({
  data, loading, sortField, sortDirection, onSortChange,
  selectedIds, onSelectionChange, onRowClick, onEditClick,
}: Props) => {
  const navigate = useNavigate()
  const { deleteApplication, loading: deleteLoading } = useDeleteApplication()
  const { updateApplication } = useUpdateApplication()
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)
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
          onChange={async (e) => {
            e.stopPropagation()
            try {
              await updateApplication(row.original.id, { outcome: e.target.value as Outcome }, row.original)
              toast.success('Status updated')
            } catch {
              toast.error('Something went wrong')
            }
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
          {formatSalary(row.original.salaryMin, row.original.salaryMax, row.original.salaryType) ?? '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <RowMenu
            onEdit={() => onEditClick(row.original)}
            onDelete={() => setDeleteTarget(row.original)}
          />
        </div>
      ),
    },
  ]

  const table = useReactTable({ data, columns, manualSorting: true, getCoreRowModel: getCoreRowModel() })

  if (loading && data.length === 0) return <TableSkeleton />

  if (!loading && data.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', background: '#ffffff', borderRadius: '12px' }}>
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
      {/* ── Mobile: card list ─────────────────────────────────── */}
      <div className="block sm:hidden" style={{ paddingBottom: '16px' }}>
        {data.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            selected={selectedIds.has(app.id)}
            onSelect={() => toggleRow(app.id)}
            onRowClick={() => onRowClick(app)}
            onEdit={() => onEditClick(app)}
            onDelete={() => setDeleteTarget(app)}
            onOutcomeChange={async (outcome) => {
              try {
                await updateApplication(app.id, { outcome }, app)
                toast.success('Status updated')
              } catch {
                toast.error('Something went wrong')
              }
            }}
          />
        ))}
      </div>

      {/* ── Desktop: table ────────────────────────────────────── */}
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
                      textAlign: 'left', background: '#fafafc',
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
                onClick={() => onRowClick(row.original)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onRowClick(row.original)
                  if (e.key === 'e' || e.key === 'E') onEditClick(row.original)
                  if (e.key === 'Delete' || e.key === 'Backspace') setDeleteTarget(row.original)
                }}
                className='focus:outline-none focus-visible:outline-2 focus-visible:outline-apple-blue focus-visible:-outline-offset-2'
                style={{
                  borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s',
                  background: selectedIds.has(row.original.id) ? 'rgba(0,113,227,0.04)' : 'transparent',
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
                    style={{ padding: cell.column.id === 'select' ? '14px 8px 14px 16px' : '14px 16px' }}
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
          try {
            await deleteApplication(deleteTarget.id)
            toast.success('Application deleted')
          } catch {
            toast.error('Something went wrong')
          }
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
