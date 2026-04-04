import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { LocationType, Outcome, RoleType, SalaryType } from '../enums';

@InputType()
export class UpdateApplicationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  companyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  positionTitle?: string;

  @Field(() => RoleType, { nullable: true })
  @IsOptional()
  @IsEnum(RoleType)
  roleType?: RoleType;

  @Field(() => LocationType, { nullable: true })
  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @Field(() => Outcome, { nullable: true })
  @IsOptional()
  @IsEnum(Outcome)
  outcome?: Outcome;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateApplied?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @Field(() => SalaryType, { nullable: true })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contactName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
