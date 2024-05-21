import { Injectable } from '@nestjs/common'
import { SleepSession, Sleep } from '@prisma/client'

import { PrismaService } from '../../prisma.service'
import {
  calculateAverageTime,
  getDate,
  getDateFromTime,
  getDuration,
  isNextDay,
} from '../../util/date'
import { BadRequestError } from '../../util/error'

import { ICreateSleepSessionInput, IUpdateSleepSessionInput } from './sleep.input'

@Injectable()
export class SleepService {
  constructor(private prisma: PrismaService) {}

  async getSleepByDate(userId: string, date?: string): Promise<Sleep> {
    const sleepDate = date && getDate(date)

    return this.prisma.sleep.findFirst({
      where: {
        ...(date && { date: sleepDate }),
        userId,
      },
      include: {
        sessions: true,
      },
    })
  }

  async getStatsOfLast7Days(userId: string) {
    const today = new Date()

    // Get the date 7 days ago
    const last7thDay = new Date()
    last7thDay.setDate(today.getDate() - 7)

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const todayFormatted = today.toLocaleDateString(undefined, options as any)
    const last7thDayFormatted = last7thDay.toLocaleDateString(
      undefined,
      options as any,
    )

    const [averageDuration, { averageWakeupTime, averageSleepTime }] =
      await Promise.all([
        this.getAverageSleepByRange(
          last7thDayFormatted,
          todayFormatted,
          userId,
        ),
        this.getAverageSleepAndWakeupTimeByRange(
          last7thDayFormatted,
          todayFormatted,
          userId,
        ),
      ])

    return { averageDuration, averageWakeupTime, averageSleepTime }
  }

  async getStatsByRange(startDate: string, endDate: string, userId: string) {
    const [averageDuration, { averageWakeupTime, averageSleepTime }] =
      await Promise.all([
        this.getAverageSleepByRange(startDate, endDate, userId),
        this.getAverageSleepAndWakeupTimeByRange(startDate, endDate, userId),
      ])

    return { averageDuration, averageWakeupTime, averageSleepTime }
  }

  async getAverageSleepOfLast7Days(userId: string) {
    const today = new Date()

    // Get the date 7 days ago
    const last7thDay = new Date()
    last7thDay.setDate(today.getDate() - 7)

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const todayFormatted = today.toLocaleDateString(undefined, options as any)
    const last7thDayFormatted = last7thDay.toLocaleDateString(
      undefined,
      options as any,
    )

    return this.getAverageSleepByRange(
      last7thDayFormatted,
      todayFormatted,
      userId,
    )
  }

  async getAverageSleepByRange(
    startDate: string,
    endDate: string,
    userId: string,
  ) {
    const start = getDate(startDate)
    const end = getDate(endDate)

    const averageDuration = await this.prisma.sleep.aggregate({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        userId,
      },
      _avg: {
        totalDuration: true,
      },
    })

    return averageDuration._avg.totalDuration
  }

  async getAverageSleepAndWakeupTimeByRange(
    startDate: string,
    endDate: string,
    userId: string,
  ): Promise<{ averageWakeupTime: string; averageSleepTime: string }> {
    const start = getDate(startDate)
    const end = getDate(endDate)

    const sleeps = await this.prisma.sleep.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        userId,
      },
      include: {
        sessions: {
          orderBy: {
            startTime: 'desc',
          },
          take: 1,
        },
      },
    })

    const wakeupTimes = sleeps.map((sleep) => {
      return sleep.sessions[0].endTime.toLocaleTimeString()
    })

    const sleepTimes = sleeps.map((sleep) => {
      return sleep.sessions[0].startTime.toLocaleTimeString()
    })

    const averageWakeupTime = calculateAverageTime(wakeupTimes)
    const averageSleepTime = calculateAverageTime(sleepTimes)

    return { averageWakeupTime, averageSleepTime }
  }

  async deleteSleepById(sleepId: string, userId: string) {
    await this.prisma.sleep.delete({
      where: { id: sleepId, userId },
    })

    return { message: 'Sleep session deleted successfully' }
  }

  async deleteSleepByDate(date: string, userId: string) {
    const sleepDate = getDate(date)

    await this.prisma.sleep.deleteMany({
      where: {
        date: sleepDate,
        userId,
      },
    })

    return { message: 'Sleep session deleted successfully' }
  }

  async deleteSessionById(sessionId: string, userId: string) {
    await this.prisma.sleepSession.delete({
      where: { id: sessionId, sleep: { userId } },
    })

    return { message: 'Sleep session deleted successfully' }
  }

  async updateSessionById(input: IUpdateSleepSessionInput, sessionId: string, userId: string) {
    try {
      const { startTime, endTime } = input

      if (!startTime && !endTime) {
        throw new BadRequestError('Missing required fields')
      }
      
      const session = await this.prisma.sleepSession.findFirst({
        where: {
          id: sessionId,
          sleep: {
            userId,
          },
        },
        include: {
          sleep: {
            include: {
              sessions: true,
            }
          },
        },
      })

      if (!session) {
        throw new BadRequestError('Sleep session not found')
      }

      const sleepDate = session.sleep.date
      const sessionStartTime = startTime ? getDateFromTime(sleepDate, startTime) : session.startTime
      const sessionEndTime = endTime ? getDateFromTime(sleepDate, endTime) : session.endTime

      const previousDuration = session.duration
      const calculatedDuration = getDuration(sessionStartTime, sessionEndTime)

      const diff = calculatedDuration - previousDuration

      const hasOverlap = this.validateOverlap(session.sleep.sessions, sessionStartTime, sessionEndTime)

      if (hasOverlap) {
        throw new BadRequestError(
          'Sleep session overlaps with existing sleep session.',
        )
      }

      return this.prisma.sleepSession.update({
        where: { id: sessionId },
        data: {
          startTime: sessionStartTime,
          endTime: sessionEndTime,
          duration: calculatedDuration,
          sleep: {
            update: {
              totalDuration: session.sleep.totalDuration + diff,
            }
          },
        },
      })
      
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async create({
    input,
    userId,
  }: {
    input: ICreateSleepSessionInput
    userId: string
  }) {
    try {
      const { date, startTime, endTime, duration } = input

      if (!date || !startTime || !endTime) {
        throw new BadRequestError('Missing required fields')
      }

      const sleepDate = getDate(date)
      const sessionStartTime = getDateFromTime(sleepDate, startTime)
      const sessionEndTime = getDateFromTime(
        sleepDate,
        endTime,
        isNextDay(startTime, endTime),
      )
      const calculatedDuration = getDuration(sessionStartTime, sessionEndTime)

      if (duration && duration !== calculatedDuration) {
        throw new BadRequestError(
          'Duration you provided does not match sleep timings.',
        )
      }

      let sleep = await this.prisma.sleep.findFirst({
        where: {
          userId,
          date: sleepDate,
        },
        include: {
          sessions: true,
        },
      })

      const hasOverlap =
        !!sleep &&
        this.validateOverlap(sleep.sessions, sessionStartTime, sessionEndTime)

      if (hasOverlap) {
        throw new BadRequestError(
          'Sleep session overlaps with existing sleep session.',
        )
      }

      if (!sleep) {
        sleep = await this.prisma.sleep.create({
          data: {
            date: sleepDate,
            totalDuration: 0,
            user: {
              connect: { id: userId },
            },
          },
          include: {
            sessions: true,
          },
        })
      }

      const updatedSleep = await this.prisma.sleep.update({
        where: { id: sleep.id },
        data: {
          totalDuration: sleep.totalDuration + calculatedDuration,
          sessions: {
            create: {
              startTime: sessionStartTime,
              endTime: sessionEndTime,
              duration: calculatedDuration,
            },
          },
        },
        include: {
          sessions: true,
        },
      })

      return updatedSleep
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private validateOverlap(
    sessions: SleepSession[],
    newStartTime: Date,
    newEndTime: Date,
  ) {
    return sessions.some(({ startTime, endTime }) => {
      return (
        (newStartTime >= startTime && newStartTime < endTime) ||
        (newEndTime > startTime && newEndTime <= endTime) ||
        (newStartTime <= startTime && newEndTime >= endTime)
      )
    })
  }
}
