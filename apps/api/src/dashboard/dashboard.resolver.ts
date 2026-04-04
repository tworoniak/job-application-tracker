import { Query, Resolver } from '@nestjs/graphql'
import { DashboardService } from './dashboard.service'
import { DashboardMetrics } from './models/dashboard-metrics.model'

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardMetrics)
  dashboardMetrics() {
    return this.dashboardService.getMetrics()
  }
}
