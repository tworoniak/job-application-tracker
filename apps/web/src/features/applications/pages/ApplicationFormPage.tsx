import { useNavigate, useParams } from 'react-router-dom'
import { ApplicationForm, mapApplicationToFormValues } from '../components/ApplicationForm'
import { useApplication } from '../hooks/useApplication'
import { useCreateApplication } from '../hooks/useCreateApplication'
import { useUpdateApplication } from '../hooks/useUpdateApplication'
import { Skeleton } from '@/components/ui'
import type { ApplicationFormValues } from '../schemas/application.schema'

export const ApplicationFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const { application, loading: fetchLoading } = useApplication(id ?? '')
  const { createApplication, loading: createLoading } = useCreateApplication()
  const { updateApplication, loading: updateLoading } = useUpdateApplication()

  const handleSubmit = async (values: ApplicationFormValues) => {
    if (isEdit && id) {
      await updateApplication(id, values)
    } else {
      await createApplication(values)
    }
    navigate('/applications')
  }

  if (isEdit && fetchLoading) {
    return (
      <div style={{ maxWidth: '640px' }}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
        </div>
      </div>
    )
  }

  const defaultValues = isEdit && application ? mapApplicationToFormValues(application) : undefined

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Back + heading */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ fontSize: '14px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.224px', marginBottom: '8px', display: 'block' }}
        >
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display,-apple-system)', fontSize: '28px', fontWeight: '600', color: '#1d1d1f', lineHeight: '1.14', letterSpacing: '-0.28px' }}>
          {isEdit ? 'Edit Application' : 'New Application'}
        </h1>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
        <ApplicationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={createLoading || updateLoading}
          submitLabel={isEdit ? 'Save Changes' : 'Add Application'}
        />
      </div>
    </div>
  )
}
