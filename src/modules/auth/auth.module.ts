import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from '../profile/profile.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './auth.strategy';
import { SessionSerializer } from './session-serializer';

@Module({
  imports: [ProfileModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
})
export class AuthModule {}
