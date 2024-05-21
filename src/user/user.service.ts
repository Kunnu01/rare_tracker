import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from '../prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async createUser(
    email: string,
    name: string,
    password: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    })
  }

  async getMe(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany()
  }
}
