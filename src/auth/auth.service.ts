import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/common/enums/roles.enums';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pin: string) {
    const user = await this.usersService.findByName(name);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(pin, user.pin);
    if (!match) throw new UnauthorizedException('PIN incorrecto');

    return user;
  }

  async login(user: { id: string; name: string; role: Role }) {
    const payload = { sub: user.id, name: user.name, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
