import { useNavigate, useParams } from 'react-router-dom';
import { useApplication } from '../hooks/useApplication';
import {
  OutcomeBadge,
  RoleTypeBadge,
  LocationTypeBadge,
  Skeleton,
} from '@/components/ui';
import { ApplicationField } from '../components/ApplicationField';
import { formatDate, formatSalary } from '../lib/formatters';

export const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { application, loading, error } = useApplication(id ?? '');

  if (loading) {
    return (
      <div style={{ maxWidth: '640px' }}>
        <Skeleton className='h-8 w-64 mb-2' />
        <Skeleton className='h-5 w-40 mb-6' />
        <div className='grid grid-cols-2 gap-5'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className='h-12' />
          ))}
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <p
        style={{
          fontSize: '14px',
          color: 'rgba(0,0,0,0.48)',
          letterSpacing: '-0.224px',
        }}
      >
        Application not found.{' '}
        <button
          onClick={() => navigate('/applications')}
          style={{
            color: '#0071e3',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Back to list
        </button>
      </p>
    );
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div>
          <button
            onClick={() => navigate('/applications')}
            style={{
              fontSize: '14px',
              color: '#0071e3',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.224px',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            ← Applications
          </button>
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
            {application.positionTitle}
          </h1>
          <p
            style={{
              marginTop: '4px',
              fontSize: '17px',
              color: 'rgba(0,0,0,0.72)',
              letterSpacing: '-0.374px',
            }}
          >
            {application.companyName}
          </p>
        </div>
        <button
          onClick={() => navigate(`/applications/${id}/edit`)}
          style={{
            padding: '8px 15px',
            fontSize: '14px',
            color: '#0071e3',
            background: 'transparent',
            border: '1px solid #0071e3',
            borderRadius: '8px',
            cursor: 'pointer',
            letterSpacing: '-0.224px',
            flexShrink: 0,
          }}
        >
          Edit
        </button>
      </div>

      {/* Detail card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px',
        }}
      >
        <dl className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <ApplicationField
            label='Status'
            value={<OutcomeBadge outcome={application.outcome} />}
          />
          <ApplicationField
            label='Role Type'
            value={<RoleTypeBadge roleType={application.roleType} />}
          />
          <ApplicationField
            label='Location'
            value={
              <LocationTypeBadge locationType={application.locationType} />
            }
          />
          <ApplicationField
            label='Date Applied'
            value={formatDate(application.dateApplied)}
          />
          <ApplicationField
            label='Interview Date'
            value={formatDate(application.interviewDate)}
          />
          <ApplicationField
            label='Salary Range'
            value={formatSalary(
              application.salaryMin,
              application.salaryMax,
              application.salaryType,
            )}
          />
          <ApplicationField label='Contact Name' value={application.contactName} />
          <ApplicationField label='Contact Info' value={application.contactInfo} />
        </dl>

        {application.notes && (
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <dt
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(0,0,0,0.40)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              Notes
            </dt>
            <p
              style={{
                fontSize: '14px',
                color: '#1d1d1f',
                lineHeight: '1.47',
                letterSpacing: '-0.224px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {application.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
