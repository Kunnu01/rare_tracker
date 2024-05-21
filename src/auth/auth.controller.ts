import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { UserResponseDto } from '../user/user.dto'
import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(
    @Body()
    {
      email,
      name,
      password,
    }: {
      email: string
      name: string
      password: string
    },
  ) {
    return this.authService.signUp(email, name, password)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    const user = await this.userService.getMe(req.user_id)
    return plainToInstance(UserResponseDto, user)
  }
}
