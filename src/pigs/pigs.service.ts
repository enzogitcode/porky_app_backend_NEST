import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pig, PigDocument } from './schema/pigs.schema';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';

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

  async update(id: string, updateData: Partial<CreatePigDto>): Promise<Pig> {
    return this.pigModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async addParicion(id: string, paricion: ParicionDto): Promise<Pig> {
    return this.pigModel
      .findByIdAndUpdate(
        id,
        { $push: { pariciones: paricion } }, // agrega al array sin borrar lo anterior
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<Pig> {
    return this.pigModel.findByIdAndDelete(id).exec();
  }
}
