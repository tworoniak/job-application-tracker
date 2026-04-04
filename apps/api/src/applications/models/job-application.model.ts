import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LocationType, Outcome, RoleType } from '../enums'

@ObjectType()
export class JobApplication {
  @Field(() => ID)
  id: string

  @Field()
  companyName: string

  @Field()
  positionTitle: string

  @Field(() => RoleType)
  roleType: RoleType

  @Field(() => LocationType)
  locationType: LocationType

  @Field(() => Outcome)
  outcome: Outcome

  @Field()
  dateApplied: Date

  @Field({ nullable: true })
  interviewDate: Date | null

  @Field(() => Int, { nullable: true })
  salaryMin: number | null

  @Field(() => Int, { nullable: true })
  salaryMax: number | null

  @Field({ nullable: true })
  contactName: string | null

  @Field({ nullable: true })
  contactInfo: string | null

  @Field({ nullable: true })
  notes: string | null

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
