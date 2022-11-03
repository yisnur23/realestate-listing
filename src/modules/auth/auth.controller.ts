import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from './auth.decorator';
import { GoogleAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    //
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req) {
    return {
      id: req.user.id,
      display_name: req.user.display_name,
      first_name: req.user.first_name,
    };
  }

  @Get('/logout')
  logout(@Req() req) {
    req.session.destroy();
  }
}
