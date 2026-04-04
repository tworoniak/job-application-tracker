import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { LocationType, Outcome, RoleType } from '../enums'

@InputType()
export class ApplicationFiltersInput {
  @Field(() => [Outcome], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Outcome, { each: true })
  outcomes?: Outcome[]

  @Field(() => [RoleType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roleTypes?: RoleType[]

  @Field(() => [LocationType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(LocationType, { each: true })
  locationTypes?: LocationType[]

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateAppliedFrom?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateAppliedTo?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string
}
