import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserResponseDto implements User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string
}
