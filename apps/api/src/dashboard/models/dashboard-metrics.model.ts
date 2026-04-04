import { Field, Int, ObjectType } from '@nestjs/graphql'
import { LocationType, Outcome, RoleType } from '../../../applications/enums'
import { JobApplication } from '../../../applications/models/job-application.model'

@ObjectType()
export class OutcomeCount {
  @Field(() => Outcome)
  outcome: Outcome

  @Field(() => Int)
  count: number
}

@ObjectType()
export class RoleTypeCount {
  @Field(() => RoleType)
  roleType: RoleType

  @Field(() => Int)
  count: number
}

@ObjectType()
export class LocationTypeCount {
  @Field(() => LocationType)
  locationType: LocationType

  @Field(() => Int)
  count: number
}

@ObjectType()
export class WeeklyCount {
  @Field()
  week: string

  @Field(() => Int)
  count: number
}

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  totalApplications: number

  @Field(() => [OutcomeCount])
  byOutcome: OutcomeCount[]

  @Field(() => [RoleTypeCount])
  byRoleType: RoleTypeCount[]

  @Field(() => [LocationTypeCount])
  byLocationType: LocationTypeCount[]

  @Field(() => [JobApplication])
  upcomingInterviews: JobApplication[]

  @Field(() => [WeeklyCount])
  applicationsByWeek: WeeklyCount[]
}
