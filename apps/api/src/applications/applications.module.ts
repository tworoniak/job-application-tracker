import { Module } from '@nestjs/common'
import { ApplicationsResolver } from './applications.resolver'
import { ApplicationsService } from './applications.service'

// Side-effect import: registers GraphQL enums
import './enums'

@Module({
  providers: [ApplicationsResolver, ApplicationsService],
})
export class ApplicationsModule {}
