import { Injectable } from '@nestjs/common';
import { CreateParicioneDto } from './dto/create-paricione.dto';
import { UpdateParicioneDto } from './dto/update-paricione.dto';

@Injectable()
export class ParicionesService {
  create(createParicioneDto: CreateParicioneDto) {
    return 'This action adds a new paricione';
  }

  findAll() {
    return `This action returns all pariciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paricione`;
  }

  update(id: number, updateParicioneDto: UpdateParicioneDto) {
    return `This action updates a #${id} paricione`;
  }

  remove(id: number) {
    return `This action removes a #${id} paricione`;
  }
}
