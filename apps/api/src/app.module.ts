import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { PrismaModule } from './prisma/prisma.module'
import { ApplicationsModule } from './applications/applications.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
    PrismaModule,
    ApplicationsModule,
    DashboardModule,
  ],
})
export class AppModule {}
