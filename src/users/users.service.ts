import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/users.schema';
import { Role } from './common/enums/roles.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  /**
   * Listar todos los usuarios (solo admin)
   */
  async findAll() {
    return this.userModel
      .find()
      .select('username role createdAt'); // solo devuelve campos públicos
  }

  /**
   * 🔍 Buscar usuario por username (login)
   */
  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  /**
   * 👑 Seed automático del admin (solo una vez)
   */
  async createAdminIfNotExists() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPin = process.env.ADMIN_PIN || '1234';

    const exists = await this.userModel.findOne({ username: adminUsername });
    if (exists) {
      return;
    }

    const hashedPin = await bcrypt.hash(adminPin, 10);

    await this.userModel.create({
      username: adminUsername,
      pin: hashedPin,
      role: Role.ADMIN,
    });

    console.log(`✅ Admin creado automáticamente: ${adminUsername}`);
  }

  /**
   * ➕ Crear usuario (solo admin)
   */
  async create(username: string, pin: string, role: Role = Role.USER) {
    const hashedPin = await bcrypt.hash(pin, 10);
    return this.userModel.create({
      username,
      pin: hashedPin,
      role,
    });
  }

  /**
   * ❌ Eliminar usuario (solo admin)
   */
  async remove(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { message: 'Usuario eliminado' };
  }

  /**
   * 🔁 Cambiar PIN del usuario autenticado
   */
  async updatePin(userId: string, pin: string) {
    const hashedPin = await bcrypt.hash(pin, 10);
    return this.userModel.findByIdAndUpdate(
      userId,
      { pin: hashedPin },
      { new: true },
    );
  }

  /**
   * 📋 Listar usuarios por rol (admin)
   */
  findByRole(role: Role) {
    return this.userModel.find({ role }).select('username role createdAt');
  }

  /**
   * 🔐 Resetear PIN de un usuario (solo admin)
   * @param username Username del usuario
   * @param tempPin PIN temporal, por defecto '0000'
   */
  async resetPinByUsername(username: string, tempPin = '0000') {
    const hashedPin = await bcrypt.hash(tempPin, 10);

    const user = await this.userModel.findOneAndUpdate(
      { username },
      { pin: hashedPin },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      message: `PIN de ${username} reseteado`,
      tempPin,
    };
  }
}
