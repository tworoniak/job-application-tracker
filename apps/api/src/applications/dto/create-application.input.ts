import { Field, Float, InputType } from '@nestjs/graphql'
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'
import { LocationType, Outcome, RoleType, SalaryType } from '../enums'

@InputType()
export class CreateApplicationInput {
  @Field()
  @IsString()
  @MinLength(1)
  companyName: string

  @Field()
  @IsString()
  @MinLength(1)
  positionTitle: string

  @Field(() => RoleType)
  @IsEnum(RoleType)
  roleType: RoleType

  @Field(() => LocationType)
  @IsEnum(LocationType)
  locationType: LocationType

  @Field(() => Outcome)
  @IsEnum(Outcome)
  outcome: Outcome

  @Field()
  @IsDateString()
  dateApplied: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  interviewDate?: string

  @Field(() => SalaryType, { nullable: true })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  salaryMin?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  salaryMax?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contactName?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contactInfo?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string
}
