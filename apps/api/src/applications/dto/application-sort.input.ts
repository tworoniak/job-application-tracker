import { Field, InputType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { SortDirection, SortField } from '../enums'

@InputType()
export class ApplicationSortInput {
  @Field(() => SortField)
  @IsEnum(SortField)
  field: SortField

  @Field(() => SortDirection)
  @IsEnum(SortDirection)
  direction: SortDirection
}
