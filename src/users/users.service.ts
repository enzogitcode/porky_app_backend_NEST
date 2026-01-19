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
    .select('name role createdAt'); // solo devuelve campos públicos
}


  /**
   * 🔍 Buscar usuario por nombre (login)
   */
  findByName(name: string) {
    return this.userModel.findOne({ name });
  }

  /**
   * 👑 Seed automático del admin (solo una vez)
   */
  async createAdminIfNotExists() {
    const adminName = process.env.ADMIN_NAME || 'admin';
    const adminPin = process.env.ADMIN_PIN || '1234';

    const exists = await this.userModel.findOne({ name: adminName });
    if (exists) {
      return;
    }

    const hashedPin = await bcrypt.hash(adminPin, 10);

    await this.userModel.create({
      name: adminName,
      pin: hashedPin,
      role: Role.ADMIN,
    });

    console.log(`✅ Admin creado automáticamente: ${adminName}`);
  }

  /**
   * ➕ Crear usuario (solo admin)
   */
  async create(name: string, pin: string, role: Role = Role.USER) {
    const hashedPin = await bcrypt.hash(pin, 10);
    return this.userModel.create({
      name,
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
    return this.userModel.find({ role }).select('name role createdAt');
  }
  /**
   * 🔐 Resetear PIN de un usuario (solo admin)
   * @param name Nombre del usuario
   * @param tempPin PIN temporal, por defecto '0000'
   */
  async resetPinByName(name: string, tempPin = '0000') {
    const hashedPin = await bcrypt.hash(tempPin, 10);

    const user = await this.userModel.findOneAndUpdate(
      { name },
      { pin: hashedPin },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      message: `PIN de ${name} reseteado`,
      tempPin,
    };
  }
}
