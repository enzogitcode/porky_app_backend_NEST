import { Injectable } from '@nestjs/common';
import { CreateVacunaDto } from './dto/create-vacuna.dto';
import { UpdateVacunaDto } from './dto/update-vacuna.dto';
import { Vacuna } from './schema/vacuna.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VacunasService {
    constructor(
    @InjectModel(Vacuna.name)
    private readonly vacunaModel: Model<Vacuna>,
  ) {}
  async create(createVacunaDto: CreateVacunaDto):Promise<Vacuna> {
    const newVacuna = await this.vacunaModel.create({
      ...createVacunaDto
    })
    try {
      return await newVacuna.save()
    } catch (error) {
      console.log(error)
      throw new Error
    }
  }

  async findAll() {
    const vacunas= await this.vacunaModel.find()
    try {
      
      return vacunas
    } catch (error) {
      console.log(error)
      throw new Error
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} vacuna`;
  }

  update(id: number, updateVacunaDto: UpdateVacunaDto) {
    return `This action updates a #${id} vacuna`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacuna`;
  }
}
