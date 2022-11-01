import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return 'google login';
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req) {
    return {
      id: req.user.id,
      display_name: req.user.display_name,
      first_name: req.user.first_name,
    };
  }
}
