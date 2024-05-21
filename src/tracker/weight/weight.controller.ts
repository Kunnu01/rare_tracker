import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  Delete,
  Param,
  Patch,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UnauthorizedError } from '../../util/error'

import { ICreateWeightInput } from './weight.input'
import { WeightService } from './weight.service'

@ApiTags('Tracker')
@Controller('track/weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  create(
    @Req() { user_id }: { user_id: string },
    @Body() input: ICreateWeightInput,
  ) {
    if (!user_id) {
      throw new UnauthorizedError()
    }

    return this.weightService.create(input, user_id)
  }

  @Get()
  getAllWeights(@Req() { user_id }: { user_id: string }) {
    return this.weightService.getAllWeights(user_id)
  }

  @Delete('/:id')
  deleteWeight(
    @Req() { user_id }: { user_id: string },
    @Param('id') weightId: string,
  ) {
    return this.weightService.deleteWeight(weightId, user_id)
  }

  @Patch('/:id')
  updateWeight(
    @Req() { user_id }: { user_id: string },
    @Param('id') weightId: string,
    @Query('weight') weight: number,
  ) {
    return this.weightService.updateWeight(weightId, weight, user_id)
  }

  @Get('/average')
  getAverageWeight(
    @Req() { user_id }: { user_id: string },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.weightService.getAverageWeight(startDate, endDate, user_id)
  }
}
