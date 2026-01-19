import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './common/enums/roles.enums';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un usuario (solo admin)
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: { name: string; pin: string; role?: Role }) {
    return this.usersService.create(body.name, body.pin, body.role);
  }

  /**
   * Listar todos los usuarios (solo admin)
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * Listar usuarios por rol (solo admin)
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('role/:role')
  async findByRole(@Param('role') role: Role) {
    return this.usersService.findByRole(role);
  }

  /**
   * Resetear PIN de un usuario (solo admin)
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':name/reset-pin')
  async resetPin(@Param('name') name: string) {
    return this.usersService.resetPinByName(name);
  }

  /**
   * Cambiar PIN propio (usuario autenticado)
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch('me/pin')
  async updateMyPin(@Request() req, @Body() body: { pin: string }) {
    return this.usersService.updatePin(req.user.userId, body.pin);
  }

  /**
   * Eliminar un usuario (solo admin)
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
