import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { OutcomeBadge, RoleTypeBadge, LocationTypeBadge, ConfirmDialog, TableSkeleton } from '@/components/ui'
import { useDeleteApplication } from '../hooks/useDeleteApplication'
import type { JobApplication, SortField, SortDirection } from '../types'

interface Props {
  data: JobApplication[]
  loading: boolean
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
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

export const ApplicationsTable = ({ data, loading, sortField, sortDirection, onSortChange }: Props) => {
  const navigate = useNavigate()
  const { deleteApplication, loading: deleteLoading } = useDeleteApplication()
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)

  const columns: ColumnDef<JobApplication>[] = [
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
      cell: ({ getValue }) => <OutcomeBadge outcome={getValue() as JobApplication['outcome']} />,
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
      <div style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {hg.headers.map((header) => (
                  <th key={header.id} style={{ padding: '12px 16px', textAlign: 'left', background: '#fafafc' }}>
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
                onClick={() => navigate(`/applications/${row.original.id}`)}
                style={{
                  borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: '14px 16px' }}>
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
