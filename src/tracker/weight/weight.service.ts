import { Injectable } from '@nestjs/common'
import { Weight } from '@prisma/client'

import { PrismaService } from '../../prisma.service'

import { ICreateWeightInput } from './weight.input'
import { getDate } from 'src/util/date'
import { BadRequestError } from 'src/util/error'

@Injectable()
export class WeightService {
  constructor(private prisma: PrismaService) {}

  async create(input: ICreateWeightInput, userId: string): Promise<Weight> {
    if (!input.date || !input.weight) {
      throw new BadRequestError('Missing required fields - date and weight')
    }
    
    return this.prisma.weight.create({
      data: {
        weight: input.weight,
        date: getDate(input.date),
        user: {
          connect: { id: userId },
        },
      },
    })
  }

  async getAllWeights(userId: string): Promise<Weight[]> {
    return this.prisma.weight.findMany({
      where: {
        userId,
      },
    })
  }

  async deleteWeight(weightId: string, userId: string): Promise<Weight> {
    return this.prisma.weight.delete({
      where: {
        id: weightId,
        userId,
      },
    })
  }

  async updateWeight(
    weightId: string,
    weight: number,
    userId: string,
  ): Promise<Weight> {
    return this.prisma.weight.update({
      where: {
        id: weightId,
        userId,
      },
      data: {
        weight,
      },
    })
  }

  async getAverageWeight(startDate: string, endDate: string, userId: string): Promise<number> {
    if (!startDate || !endDate) {
      throw new BadRequestError('Missing required query params - startDate and endDate')
    }
    
    const start = getDate(startDate)
    const end = getDate(endDate)

    const weights = await this.prisma.weight.aggregate({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        userId,
      },
      _avg: {
        weight: true,
      },
    })

    return weights._avg.weight
  }
}
