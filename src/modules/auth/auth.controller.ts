import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard, isAuthenticated } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return 'google login';
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleRedirect() {
    return 'google redirect';
  }

  @Get('/protected')
  @UseGuards(isAuthenticated)
  protected(@Req() req) {
    console.log('user', req.user);
    return "u've got access";
  }
}
