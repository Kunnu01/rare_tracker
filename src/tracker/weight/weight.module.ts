import { Module } from '@nestjs/common'

import { PrismaService } from '../../prisma.service'

import { WeightController } from './weight.controller'
import { WeightService } from './weight.service'

@Module({
  imports: [],
  controllers: [WeightController],
  providers: [WeightService, PrismaService],
})
export class WeightModule {}
