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
        className="absolute inset-0 bg-apple-text-tertiary"
        onClick={onCancel}
      />
      <div className="relative w-full mx-4 max-w-[320px] bg-white rounded-xl p-6 shadow-(--shadow-apple-card)">
        <h2 className="font-display text-[17px] font-semibold text-apple-text leading-[1.24] tracking-[-0.374px]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[rgba(0,0,0,0.72)] leading-[1.43] tracking-[-0.224px]">
          {description}
        </p>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-3.75 py-2 text-sm font-normal text-apple-blue bg-transparent border border-apple-blue rounded-full cursor-pointer tracking-[-0.224px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3.75 py-2 text-sm font-normal text-white bg-apple-text border border-transparent rounded-lg tracking-[-0.224px]"
            style={{
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
