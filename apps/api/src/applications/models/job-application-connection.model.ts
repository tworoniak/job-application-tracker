import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PageInfo } from '../../common/pagination/page-info.model'
import { JobApplication } from './job-application.model'

@ObjectType()
export class JobApplicationEdge {
  @Field()
  cursor: string

  @Field(() => JobApplication)
  node: JobApplication
}

@ObjectType()
export class JobApplicationConnection {
  @Field(() => [JobApplicationEdge])
  edges: JobApplicationEdge[]

  @Field(() => PageInfo)
  pageInfo: PageInfo

  @Field(() => Int)
  totalCount: number
}
