import { registerEnumType } from '@nestjs/graphql'
import { LocationType, Outcome, RoleType } from '@prisma/client'

registerEnumType(RoleType, { name: 'RoleType', description: 'Employment role type' })
registerEnumType(LocationType, { name: 'LocationType', description: 'Work location arrangement' })
registerEnumType(Outcome, { name: 'Outcome', description: 'Current application status' })

export enum SortField {
  DATE_APPLIED = 'dateApplied',
  COMPANY_NAME = 'companyName',
  POSITION_TITLE = 'positionTitle',
  OUTCOME = 'outcome',
  SALARY_MIN = 'salaryMin',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortField, { name: 'SortField' })
registerEnumType(SortDirection, { name: 'SortDirection' })

export { RoleType, LocationType, Outcome }
