import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormValues } from '../schemas/application.schema'
import type { JobApplication } from '../types'

interface Props {
  defaultValues?: Partial<ApplicationFormValues>
  onSubmit: (values: ApplicationFormValues) => Promise<void>
  loading: boolean
  submitLabel: string
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1d1d1f',
  marginBottom: '6px',
  letterSpacing: '-0.224px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#fafafc',
  border: '3px solid rgba(0,0,0,0.04)',
  borderRadius: '11px',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#1d1d1f',
  letterSpacing: '-0.224px',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
}

const errorStyle: React.CSSProperties = {
  marginTop: '4px',
  fontSize: '12px',
  color: '#1d1d1f',
  letterSpacing: '-0.12px',
  opacity: 0.6,
}

const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) => (
  <div>
    <label style={labelStyle}>
      {label}{required && <span style={{ color: '#0071e3', marginLeft: '2px' }}>*</span>}
    </label>
    {children}
    {error && <p style={errorStyle}>{error}</p>}
  </div>
)

export const mapApplicationToFormValues = (app: JobApplication): ApplicationFormValues => ({
  companyName: app.companyName,
  positionTitle: app.positionTitle,
  roleType: app.roleType,
  locationType: app.locationType,
  outcome: app.outcome,
  dateApplied: app.dateApplied.slice(0, 10),
  interviewDate: app.interviewDate ? app.interviewDate.slice(0, 10) : undefined,
  salaryType: app.salaryType ?? undefined,
  salaryMin: app.salaryMin ?? undefined,
  salaryMax: app.salaryMax ?? undefined,
  contactName: app.contactName ?? undefined,
  contactInfo: app.contactInfo ?? undefined,
  notes: app.notes ?? undefined,
})

export const ApplicationForm = ({ defaultValues, onSubmit, loading, submitLabel }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      outcome: 'APPLIED',
      roleType: 'FULL_TIME',
      locationType: 'REMOTE',
      dateApplied: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  const salaryType = useWatch({ control, name: 'salaryType' })
  const salaryPlaceholderMin = salaryType === 'HOURLY' ? '45' : '80000'
  const salaryPlaceholderMax = salaryType === 'HOURLY' ? '75' : '120000'

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Company Name" required error={errors.companyName?.message}>
          <input {...register('companyName')} style={inputStyle} placeholder="Acme Corp" />
        </Field>
        <Field label="Position Title" required error={errors.positionTitle?.message}>
          <input {...register('positionTitle')} style={inputStyle} placeholder="Senior Engineer" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Role Type" required error={errors.roleType?.message}>
          <select {...register('roleType')} style={inputStyle}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </Field>
        <Field label="Location" required error={errors.locationType?.message}>
          <select {...register('locationType')} style={inputStyle}>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ON_SITE">On-site</option>
          </select>
        </Field>
        <Field label="Status" required error={errors.outcome?.message}>
          <select {...register('outcome')} style={inputStyle}>
            <option value="APPLIED">Applied</option>
            <option value="PHONE_SCREEN">Phone Screen</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="INTERVIEW_COMPLETED">Interview Completed</option>
            <option value="OFFER_RECEIVED">Offer Received</option>
            <option value="OFFER_ACCEPTED">Offer Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
            <option value="NO_RESPONSE">No Response</option>
            <option value="GHOSTED">Ghosted</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Date Applied" required error={errors.dateApplied?.message}>
          <input {...register('dateApplied')} type="date" style={inputStyle} />
        </Field>
        <Field label="Interview Date" error={errors.interviewDate?.message}>
          <input {...register('interviewDate')} type="date" style={inputStyle} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Salary Type" error={errors.salaryType?.message}>
          <select {...register('salaryType')} style={inputStyle}>
            <option value="">Not specified</option>
            <option value="ANNUAL">Annual</option>
            <option value="HOURLY">Hourly</option>
          </select>
        </Field>
        <Field label="Salary Min" error={errors.salaryMin?.message}>
          <input {...register('salaryMin')} type="number" step="0.01" style={inputStyle} placeholder={salaryPlaceholderMin} />
        </Field>
        <Field label="Salary Max" error={errors.salaryMax?.message}>
          <input {...register('salaryMax')} type="number" step="0.01" style={inputStyle} placeholder={salaryPlaceholderMax} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Contact Name" error={errors.contactName?.message}>
          <input {...register('contactName')} style={inputStyle} placeholder="Jane Smith" />
        </Field>
        <Field label="Contact Info" error={errors.contactInfo?.message}>
          <input {...register('contactInfo')} style={inputStyle} placeholder="jane@acme.com" />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Referred by…, key requirements, compensation notes…"
        />
      </Field>

      <div style={{ paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 15px',
            fontSize: '17px',
            fontWeight: '400',
            color: '#ffffff',
            background: loading ? 'rgba(0,113,227,0.5)' : '#0071e3',
            border: '1px solid transparent',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '-0.374px',
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
