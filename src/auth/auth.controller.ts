import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login de usuario
   */
  @Post('login')
  async login(@Body() body: LoginDto) {
    // 1. Validar usuario con PIN
    const user = await this.authService.validateUser(body.name, body.pin);

    // 2. Retornar JWT
    return this.authService.login({
      id: user._id.toString(), // user._id de Mongoose
      name: user.name,
      role: user.role,
    });
  }
}
