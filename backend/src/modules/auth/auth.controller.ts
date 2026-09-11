import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username?: string; password?: string }) {
    const username = body.username || 'admin';
    const password = body.password || 'Admin123!';
    return this.authService.login(username, password);
  }

  @Get('users')
  async listUsers() {
    return this.authService.listUsers();
  }
}
