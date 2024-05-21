import { Module } from '@nestjs/common'

import { PrismaService } from '../../prisma.service'

import { SleepController } from './sleep.controller'
import { SleepService } from './sleep.service'

@Module({
  imports: [],
  controllers: [SleepController],
  providers: [SleepService, PrismaService],
})
export class SleepModule {}
