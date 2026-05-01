import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useApplication } from '../hooks/useApplication'
import { useUpdateApplication } from '../hooks/useUpdateApplication'
import { ApplicationForm, mapApplicationToFormValues } from './ApplicationForm'
import { OutcomeBadge, RoleTypeBadge, LocationTypeBadge, Skeleton } from '@/components/ui'
import { ApplicationField } from './ApplicationField'
import { formatDate, formatSalary } from '../lib/formatters'
import type { ApplicationFormValues } from '../schemas/application.schema'
import { ROLE_TYPE_LABELS, LOCATION_TYPE_LABELS } from '../types'

interface Props {
  appId: string
  initialEditMode?: boolean
  onClose: () => void
}

export const ApplicationDetailDrawer = ({ appId, initialEditMode = false, onClose }: Props) => {
  const { application, loading } = useApplication(appId)
  const { updateApplication, loading: saving } = useUpdateApplication()
  const [editMode, setEditMode] = useState(initialEditMode)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditMode(initialEditMode)
  }, [appId, initialEditMode])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (editMode) setEditMode(false)
      else onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editMode, onClose])

  // Focus trap
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const focusable = () => Array.from(
      el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
    focusable()[0]?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const els = focusable()
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [loading, editMode])

  const handleEditSubmit = async (values: ApplicationFormValues) => {
    if (!application) return
    await updateApplication(appId, values, application)
    setEditMode(false)
  }

  const initials = application
    ? application.companyName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 40,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="animate-slide-in-right"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: '420px',
          maxWidth: '100vw',
          background: '#ffffff',
          zIndex: 50,
          boxShadow: '-4px 0 32px rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {loading ? (
          <div style={{ padding: '24px' }}>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32 mb-6" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          </div>
        ) : !application ? (
          <div style={{ padding: '24px', fontSize: '14px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.224px' }}>
            Application not found.
          </div>
        ) : editMode ? (
          /* ── Edit mode ─────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 id="drawer-title" style={{ fontSize: '17px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Edit Application</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => setEditMode(false)}
                  style={{ fontSize: '13px', color: 'rgba(0,0,0,0.48)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer' }}
                >
                  <X size={14} color="rgba(0,0,0,0.60)" />
                </button>
              </div>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <ApplicationForm
                defaultValues={mapApplicationToFormValues(application)}
                onSubmit={handleEditSubmit}
                loading={saving}
                submitLabel="Save Changes"
              />
            </div>
          </div>
        ) : (
          /* ── View mode ─────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(0,113,227,0.10)', color: '#0071e3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '600', flexShrink: 0, letterSpacing: '-0.3px',
                  }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p id="drawer-title" style={{ fontSize: '17px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.374px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {application.companyName}
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                      {application.positionTitle}
                    </p>
                  </div>
                </div>
                {/* Header actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => setEditMode(true)}
                    style={{ padding: '5px 14px', fontSize: '13px', color: '#0071e3', background: 'transparent', border: '1px solid #0071e3', borderRadius: '7px', cursor: 'pointer', letterSpacing: '-0.12px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="Close drawer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer' }}
                  >
                    <X size={14} color="rgba(0,0,0,0.60)" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                <OutcomeBadge outcome={application.outcome} />
                <RoleTypeBadge roleType={application.roleType} />
                <LocationTypeBadge locationType={application.locationType} />
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Timeline */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,0,0,0.40)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                  Timeline
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1d1d1f', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f', letterSpacing: '-0.12px' }}>Applied</p>
                      <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.12px' }}>{formatDate(application.dateApplied)}</p>
                    </div>
                  </div>
                  {application.interviewDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0071e3', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f', letterSpacing: '-0.12px' }}>Interview</p>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.12px' }}>{formatDate(application.interviewDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail grid */}
              <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <ApplicationField label="Compensation" value={formatSalary(application.salaryMin, application.salaryMax, application.salaryType)} />
                <ApplicationField label="Location" value={LOCATION_TYPE_LABELS[application.locationType]} />
                <ApplicationField label="Role Type" value={ROLE_TYPE_LABELS[application.roleType]} />
                <ApplicationField label="Contact" value={[application.contactName, application.contactInfo].filter(Boolean).join(' · ') || null} />
              </dl>

              {/* Notes */}
              {application.notes && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,0,0,0.40)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Notes
                  </p>
                  <p style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.47', letterSpacing: '-0.224px', whiteSpace: 'pre-wrap' }}>
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
