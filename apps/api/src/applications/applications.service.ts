import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateApplicationInput } from './dto/create-application.input'
import { UpdateApplicationInput } from './dto/update-application.input'
import { PaginatedApplicationsArgs } from './dto/paginated-applications.args'
import { Outcome, SortDirection, SortField } from './enums'

const encodeCursor = (id: string) => Buffer.from(id).toString('base64')
const decodeCursor = (cursor: string) => Buffer.from(cursor, 'base64').toString('utf-8')

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(args: PaginatedApplicationsArgs, userId: string) {
    const { filters, sort, first = 30, after } = args

    const where: Prisma.JobApplicationWhereInput = { userId }

    if (filters) {
      if (filters.outcomes?.length) where.outcome = { in: filters.outcomes }
      if (filters.roleTypes?.length) where.roleType = { in: filters.roleTypes }
      if (filters.locationTypes?.length) where.locationType = { in: filters.locationTypes }

      const dateFilter: Prisma.DateTimeFilter = {}
      if (filters.dateAppliedFrom) dateFilter.gte = new Date(filters.dateAppliedFrom)
      if (filters.dateAppliedTo) dateFilter.lte = new Date(filters.dateAppliedTo)
      if (Object.keys(dateFilter).length) where.dateApplied = dateFilter

      if (filters.search) {
        where.OR = [
          { companyName: { contains: filters.search, mode: 'insensitive' } },
          { positionTitle: { contains: filters.search, mode: 'insensitive' } },
        ]
      }
    }

    const field = sort?.field ?? SortField.DATE_APPLIED
    const direction = sort?.direction ?? SortDirection.DESC
    const orderBy: Prisma.JobApplicationOrderByWithRelationInput = { [field]: direction }

    const take = first + 1
    const cursor = after ? { id: decodeCursor(after) } : undefined

    const [applications, totalCount] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        orderBy,
        take,
        cursor,
        skip: cursor ? 1 : 0,
      }),
      this.prisma.jobApplication.count({ where }),
    ])

    const hasNextPage = applications.length > first
    const items = applications.slice(0, first)

    const edges = items.map((node) => ({
      cursor: encodeCursor(node.id),
      node,
    }))

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: !!after,
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges[edges.length - 1]?.cursor ?? null,
      },
      totalCount,
    }
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    })
    if (!application) throw new NotFoundException(`Application ${id} not found`)
    return application
  }

  async create(input: CreateApplicationInput, userId: string) {
    return this.prisma.jobApplication.create({
      data: {
        ...input,
        userId,
        dateApplied: new Date(input.dateApplied),
        interviewDate: input.interviewDate ? new Date(input.interviewDate) : null,
      },
    })
  }

  async update(id: string, input: UpdateApplicationInput, userId: string) {
    await this.findOne(id, userId)
    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        ...input,
        dateApplied: input.dateApplied ? new Date(input.dateApplied) : undefined,
        interviewDate:
          input.interviewDate !== undefined
            ? input.interviewDate
              ? new Date(input.interviewDate)
              : null
            : undefined,
      },
    })
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId)
    await this.prisma.jobApplication.delete({ where: { id } })
    return true
  }

  async deleteMany(ids: string[], userId: string): Promise<number> {
    const { count } = await this.prisma.jobApplication.deleteMany({
      where: { id: { in: ids }, userId },
    })
    return count
  }

  async updateManyOutcome(ids: string[], outcome: Outcome, userId: string): Promise<number> {
    const { count } = await this.prisma.jobApplication.updateMany({
      where: { id: { in: ids }, userId },
      data: { outcome },
    })
    return count
  }
}
