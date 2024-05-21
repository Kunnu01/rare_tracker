import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { SleepModule } from './sleep/sleep.module'
import { WeightModule } from './weight/weight.module'

@Module({
  imports: [SleepModule, WeightModule],
  controllers: [],
  providers: [PrismaService],
})
export class TrackerModule {}
