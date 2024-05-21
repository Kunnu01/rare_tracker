import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../user/user.service'
import { encrypt } from '../util/encrypt'
import { BadRequestError, NotFoundError } from '../util/error'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    email: string,
    name: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      if (!email || !name) {
        throw new BadRequestError('Email and name are required')
      }

      const user = await this.userService.getUserByEmail(email)
      if (user) {
        throw new BadRequestError('Email already exists')
      }

      const encryptedPassword = encrypt(password)

      // Create user
      const newUser = await this.userService.createUser(
        email,
        name,
        encryptedPassword,
      )
      if (!newUser) {
        throw new Error('Failed to register user. Please try again')
      }

      // Generate access token
      const payload = {
        sub: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }
      const accessToken = await this.jwtService.signAsync(payload)

      return {
        access_token: accessToken,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      if (!email) {
        throw new BadRequestError('Email is required')
      }
      if (!password) {
        throw new BadRequestError('Password is required')
      }
      const user = await this.userService.getUserByEmail(email)
      if (!user) {
        throw new NotFoundError('User not found')
      }

      const encryptedPassword = encrypt(password)
      if (user.password !== encryptedPassword) {
        throw new BadRequestError('Invalid password')
      }

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      }

      const accessToken = await this.jwtService.signAsync(payload)
      return {
        access_token: accessToken,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
