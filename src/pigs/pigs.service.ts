import { Injectable } from '@nestjs/common';
import { CreatePigDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';
import { Pig } from './entities/pig.entity';
@Injectable()
export class PigsService {
  pigs:Array<Pig>
  constructor () {
    this.pigs= []
  }
  create(createPigDto: CreatePigDto) {
    return 'This action adds a new pig';
  }
  findAll() {
    return this.pigs;
  }

  findOne(id: number) {
    return `This action returns a #${id} pig`;
  }

  update(id: number, updatePigDto: UpdatePigDto) {
    return `This action updates a #${id} pig`;
  }

  remove(id: number) {
    return `This action removes a #${id} pig`;
  }
}
