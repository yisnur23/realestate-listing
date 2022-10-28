import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ProfileModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
