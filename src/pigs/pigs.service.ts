import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pig, PigDocument } from './schema/pigs.schema';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';

@Injectable()
export class PigsService {
  constructor(@InjectModel(Pig.name) private pigModel: Model<PigDocument>) {}

  async create(createPigDto: CreatePigDto): Promise<Pig> {
    const pig = new this.pigModel(createPigDto);
    return pig.save();
  }

  async findAll(): Promise<Pig[]> {
    return this.pigModel.find().exec();
  }

  async findOne(id: string): Promise<Pig | null> {
    return this.pigModel.findById(id).exec();
  }

  async findByCaravana(nroCaravana: number): Promise<Pig | null> {
    return this.pigModel.findOne({ nroCaravana }).exec();
  }

  async update(id: string, updateData: UpdatePigDto): Promise<Pig> {
    return this.pigModel
      .findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async addParicion(id: string, paricion: ParicionDto): Promise<Pig> {
    paricion.fechaActualizacion = new Date();
    return this.pigModel
      .findByIdAndUpdate(
        id,
        { $push: { pariciones: paricion }, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async updateParicion(
  pigId: string,
  paricionIndex: number,
  paricion: Partial<ParicionDto>,
): Promise<Pig> {
  const pig = await this.pigModel.findById(pigId);
  if (!pig || !pig.pariciones || !pig.pariciones[paricionIndex])
    throw new Error('Parición no encontrada');

  // Actualizamos el subdocumento directamente
  pig.pariciones[paricionIndex] = {
    ...pig.pariciones[paricionIndex], // ya no usamos toObject()
    ...paricion,
    fechaActualizacion: new Date(),   // actualizamos la fecha
  };

  return pig.save();
}


  async remove(id: string): Promise<Pig> {
    return this.pigModel.findByIdAndDelete(id).exec();
  }
}
