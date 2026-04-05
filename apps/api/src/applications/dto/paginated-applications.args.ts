import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsPositive, IsString, Max, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApplicationFiltersInput } from './application-filters.input'
import { ApplicationSortInput } from './application-sort.input'

@ArgsType()
export class PaginatedApplicationsArgs {
  @Field(() => ApplicationFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationFiltersInput)
  filters?: ApplicationFiltersInput

  @Field(() => ApplicationSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationSortInput)
  sort?: ApplicationSortInput

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(10000)
  first?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  after?: string
}
