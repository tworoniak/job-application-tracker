import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardMetrics } from './models/dashboard-metrics.model'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { JwtPayload } from '../auth/auth.service'

@UseGuards(JwtAuthGuard)
@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardMetrics)
  dashboardMetrics(@CurrentUser() user: JwtPayload) {
    return this.dashboardService.getMetrics(user.id)
  }
}
