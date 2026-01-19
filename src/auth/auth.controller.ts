import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login de usuario – usando cookie HttpOnly
   */
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response, // permite enviar cookie sin bloquear respuesta
  ) {
    // 1️⃣ Validar usuario con PIN
    const user = await this.authService.validateUser(body.username, body.pin);

    // 2️⃣ Crear JWT
    const token = await this.authService.login({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    // 3️⃣ Guardar JWT en cookie HttpOnly
    res.cookie('jwt', token.access_token, {
      httpOnly: true,                               // JS no puede leerla
      secure: process.env.NODE_ENV === 'production', // HTTPS solo en producción
      sameSite: 'strict',                            // protege contra CSRF
      maxAge: 60 * 60 * 1000,                        // 1 hora
    });

    // 4️⃣ Opcional: retornar mensaje sin exponer el token
    return { message: 'Login exitoso' };
  }
}
