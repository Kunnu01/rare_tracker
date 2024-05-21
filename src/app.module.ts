import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { TrackerModule } from './tracker/tracker.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, UserModule, TrackerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
