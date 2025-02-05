import { Injectable } from '@nestjs/common';
import { CreatePigDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';
import { InjectModel } from '@nestjs/mongoose';
import {PigsDocument, Pig} from './schema/pigs.schema'
import { Model } from 'mongoose';
@Injectable()
export class PigsService {
  constructor(@InjectModel(Pig.name) private pigsModel: Model<PigsDocument>) {
  }
  create(createPig: CreatePigDto) {
    const createdPig= new this.pigsModel(createPig)
    return createdPig.save()
  }
  findAll() {
    return this.pigsModel.find();
  }

  findOne(nroCaravana: number) {
    return this.pigsModel.findOne({nroCaravana});
  }

  update(nroCaravana: number, updatePigDto: UpdatePigDto) {
    this.pigsModel.deleteOne
return this.pigsModel.updateOne({nroCaravana}, updatePigDto)
  }

  remove(nroCaravana: number) {
    return this.pigsModel.deleteOne({nroCaravana})
  }
}
