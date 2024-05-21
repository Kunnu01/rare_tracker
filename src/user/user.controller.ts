import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { UserResponseDto } from './user.dto'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getAllUsers()
    return users.map((user) => plainToInstance(UserResponseDto, user))
  }
}
