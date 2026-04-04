import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalApplications,
      byOutcomeRaw,
      byRoleTypeRaw,
      byLocationTypeRaw,
      upcomingInterviews,
      applicationsByWeekRaw,
    ] = await Promise.all([
      this.prisma.jobApplication.count(),
      this.prisma.jobApplication.groupBy({ by: ['outcome'], _count: { _all: true } }),
      this.prisma.jobApplication.groupBy({ by: ['roleType'], _count: { _all: true } }),
      this.prisma.jobApplication.groupBy({ by: ['locationType'], _count: { _all: true } }),
      this.prisma.jobApplication.findMany({
        where: { interviewDate: { gte: new Date() } },
        orderBy: { interviewDate: 'asc' },
        take: 5,
      }),
      this.prisma.$queryRaw<{ week: string; count: number }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('week', "dateApplied"), 'IYYY-"W"IW') AS week,
          COUNT(*)::int AS count
        FROM job_applications
        WHERE "dateApplied" >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', "dateApplied")
        ORDER BY DATE_TRUNC('week', "dateApplied") ASC
      `,
    ])

    return {
      totalApplications,
      byOutcome: byOutcomeRaw.map((r) => ({ outcome: r.outcome, count: r._count._all })),
      byRoleType: byRoleTypeRaw.map((r) => ({ roleType: r.roleType, count: r._count._all })),
      byLocationType: byLocationTypeRaw.map((r) => ({ locationType: r.locationType, count: r._count._all })),
      upcomingInterviews,
      applicationsByWeek: applicationsByWeekRaw,
    }
  }
}
