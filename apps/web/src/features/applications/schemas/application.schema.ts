import { z } from 'zod'

export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  positionTitle: z.string().min(1, 'Position title is required'),
  roleType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']),
  locationType: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']),
  outcome: z.enum([
    'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
    'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
  ]),
  dateApplied: z.string().min(1, 'Date applied is required'),
  interviewDate: z.string().optional(),
  salaryMin: z.coerce.number().int().positive().optional().nullable(),
  salaryMax: z.coerce.number().int().positive().optional().nullable(),
  contactName: z.string().optional(),
  contactInfo: z.string().optional(),
  notes: z.string().optional(),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
