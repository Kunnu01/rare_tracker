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

import { BadRequestError, UnauthorizedError } from '../../util/error'

import { ICreateSleepSessionInput } from './sleep.input'
import { SleepService } from './sleep.service'

@ApiTags('Tracker')
@Controller('track/sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Post('/session')
  create(
    @Req() { user_id }: { user_id: string },
    @Body() input: ICreateSleepSessionInput,
  ) {
    if (!user_id) {
      throw new UnauthorizedError()
    }

    return this.sleepService.create({ input, userId: user_id })
  }

  @Patch('/session/:sessionId')
  update(
    @Param('sessionId') sessionId: string,
    @Req() { user_id }: { user_id: string },
    @Body() input: ICreateSleepSessionInput,
  ) {
    if (!sessionId) {
      throw new BadRequestError('SessionId is required')
    }

    return this.sleepService.updateSessionById(input, sessionId, user_id)
  }

  @Delete('/:sleepId')
  deleteSleep(
    @Param('sleepId') sleepId: string,
    @Req() { user_id }: { user_id: string },
  ) {
    if (!sleepId) {
      throw new BadRequestError('SleepId is required')
    }
    return this.sleepService.deleteSleepById(sleepId, user_id)
  }

  @Delete()
  deleteSleepByDate(
    @Query('date') date: string,
    @Req() { user_id }: { user_id: string },
  ) {
    if (!date) {
      throw new BadRequestError('Date is required')
    }
    return this.sleepService.deleteSleepByDate(date, user_id)
  }

  @Delete('/session/:sessionId')
  deleteSession(
    @Param('sessionId') sessionId: string,
    @Req() { user_id }: { user_id: string },
  ) {
    if (!sessionId) {
      throw new BadRequestError('SessionId is required')
    }
    return this.sleepService.deleteSessionById(sessionId, user_id)
  }

  @Get()
  getSleepByDate(
    @Req() { user_id }: { user_id: string },
    @Query('date') date?: string,
  ) {
    return this.sleepService.getSleepByDate(user_id, date)
  }

  @Get('stats/average-of-week')
  getAverageSleep(@Req() { user_id }: { user_id: string }) {
    return this.sleepService.getAverageSleepOfLast7Days(user_id)
  }

  @Get('stats/average')
  getAverageSleepByDatRange(
    @Req() { user_id }: { user_id: string },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.sleepService.getStatsByRange(startDate, endDate, user_id)
  }
}
