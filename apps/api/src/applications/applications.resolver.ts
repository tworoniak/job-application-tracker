import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApplicationsService } from './applications.service'
import { CreateApplicationInput } from './dto/create-application.input'
import { UpdateApplicationInput } from './dto/update-application.input'
import { PaginatedApplicationsArgs } from './dto/paginated-applications.args'
import { JobApplication } from './models/job-application.model'
import { JobApplicationConnection } from './models/job-application-connection.model'

@Resolver(() => JobApplication)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => JobApplicationConnection)
  jobApplications(@Args() args: PaginatedApplicationsArgs) {
    return this.applicationsService.findAll(args)
  }

  @Query(() => JobApplication, { nullable: true })
  jobApplication(@Args('id', { type: () => ID }) id: string) {
    return this.applicationsService.findOne(id)
  }

  @Mutation(() => JobApplication)
  createJobApplication(@Args('input') input: CreateApplicationInput) {
    return this.applicationsService.create(input)
  }

  @Mutation(() => JobApplication)
  updateJobApplication(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateApplicationInput,
  ) {
    return this.applicationsService.update(id, input)
  }

  @Mutation(() => Boolean)
  deleteJobApplication(@Args('id', { type: () => ID }) id: string) {
    return this.applicationsService.delete(id)
  }
}
