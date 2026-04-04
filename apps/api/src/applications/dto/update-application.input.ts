import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { LocationType, Outcome, RoleType } from '../enums';

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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
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
