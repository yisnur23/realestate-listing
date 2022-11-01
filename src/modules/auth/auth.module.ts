import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AbilityModule } from '../ability/ability.module';
import { ProfileModule } from '../profile/profile.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './auth.strategy';
import { SessionSerializer } from './session-serializer';

@Module({
  imports: [ProfileModule, PassportModule, AbilityModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
})
export class AuthModule {}
