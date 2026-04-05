import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { LocationType, Outcome, RoleType, SalaryType } from '../enums';

@ObjectType()
export class JobApplication {
  @Field(() => ID)
  id: string;

  @Field()
  companyName: string;

  @Field()
  positionTitle: string;

  @Field(() => RoleType)
  roleType: RoleType;

  @Field(() => LocationType)
  locationType: LocationType;

  @Field(() => Outcome)
  outcome: Outcome;

  @Field()
  dateApplied: Date;

  @Field(() => Date, { nullable: true })
  interviewDate?: Date | null;

  @Field(() => SalaryType, { nullable: true })
  salaryType: SalaryType | null;

  @Field(() => Float, { nullable: true })
  salaryMin: number | null;

  @Field(() => Float, { nullable: true })
  salaryMax: number | null;

  @Field(() => String, { nullable: true })
  contactName: string | null;

  @Field(() => String, { nullable: true })
  contactInfo: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
