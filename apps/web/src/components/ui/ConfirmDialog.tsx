interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.48)' }}
        onClick={onCancel}
      />
      <div
        className="relative w-full mx-4"
        style={{
          maxWidth: '320px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display, -apple-system)',
            fontSize: '17px',
            fontWeight: '600',
            color: '#1d1d1f',
            lineHeight: '1.24',
            letterSpacing: '-0.374px',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginTop: '8px',
            fontSize: '14px',
            color: 'rgba(0,0,0,0.72)',
            lineHeight: '1.43',
            letterSpacing: '-0.224px',
          }}
        >
          {description}
        </p>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              fontWeight: '400',
              color: '#0071e3',
              background: 'transparent',
              border: '1px solid #0071e3',
              borderRadius: '980px',
              cursor: 'pointer',
              letterSpacing: '-0.224px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              fontWeight: '400',
              color: '#ffffff',
              background: '#1d1d1f',
              border: '1px solid transparent',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              letterSpacing: '-0.224px',
            }}
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
