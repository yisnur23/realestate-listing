import { Controller, Get, Query, Session } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/google/login')
  googleLogin(): string {
    return this.authService.getGoogleAuthUrl();
  }
  @Get('/google/redirect')
  googleRedired(@Query() query, @Session() session) {
    const code = query.code;
    return this.authService.googleRedirect(code, session);
  }
  @Get('/ls')
  list(@Session() session) {
    console.log(session);
    return this.authService.listUsers();
  }
}
