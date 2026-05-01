import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { CreateApplicationInput } from './dto/create-application.input'
import { UpdateApplicationInput } from './dto/update-application.input'
import { PaginatedApplicationsArgs } from './dto/paginated-applications.args'
import { JobApplication } from './models/job-application.model'
import { JobApplicationConnection } from './models/job-application-connection.model'
import { Outcome } from './enums'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { JwtPayload } from '../auth/auth.service'

@UseGuards(JwtAuthGuard)
@Resolver(() => JobApplication)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => JobApplicationConnection)
  jobApplications(
    @Args() args: PaginatedApplicationsArgs,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.findAll(args, user.id)
  }

  @Query(() => JobApplication, { nullable: true })
  jobApplication(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.findOne(id, user.id)
  }

  @Mutation(() => JobApplication)
  createJobApplication(
    @Args('input') input: CreateApplicationInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.create(input, user.id)
  }

  @Mutation(() => JobApplication)
  updateJobApplication(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateApplicationInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.update(id, input, user.id)
  }

  @Mutation(() => Boolean)
  deleteJobApplication(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.delete(id, user.id)
  }

  @Mutation(() => Int)
  deleteJobApplications(
    @Args('ids', { type: () => [ID] }) ids: string[],
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.deleteMany(ids, user.id)
  }

  @Mutation(() => Int)
  updateJobApplicationsOutcome(
    @Args('ids', { type: () => [ID] }) ids: string[],
    @Args('outcome', { type: () => Outcome }) outcome: Outcome,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.updateManyOutcome(ids, outcome, user.id)
  }
}
