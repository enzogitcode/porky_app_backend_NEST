import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/users.schema';
import { Role } from './common/enums/roles.enums';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Buscar usuario por nombre (login)
   */
  async findByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  /**
   * Crear usuario (solo admin)
   */
  async create(name: string, pin: string, role: Role = Role.USER): Promise<User> {
    const hashedPin = await bcrypt.hash(pin, 10);
    const createdUser = new this.userModel({
      name,
      pin: hashedPin,
      role,
    });
    return createdUser.save();
  }

  /**
   * Eliminar usuario (solo admin)
   */
  async remove(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(userId).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { message: 'Usuario eliminado' };
  }

  /**
   * Cambiar PIN del usuario autenticado
   */
  async updatePin(userId: string, newPin: string): Promise<User> {
    const hashedPin = await bcrypt.hash(newPin, 10);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { pin: hashedPin }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updatedUser;
  }

  /**
   * Resetear PIN de un usuario (solo admin)
   */
  async resetPin(name: string, tempPin: string = '0000'): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const hashedPin = await bcrypt.hash(tempPin, 10);
    user.pin = hashedPin;
    await user.save();

    return { message: `PIN de ${name} actualizado a temporal` };
  }

  /**
   * Listar usuarios por rol – admin
   */
  async findByRole(role: Role): Promise<User[]> {
    return this.userModel
      .find({ role })
      .select('name role createdAt')
      .exec();
  }

  /**
   * Listar todos los usuarios – admin
   */
  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select('name role createdAt')
      .exec();
  }
}
