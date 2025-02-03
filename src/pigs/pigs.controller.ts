import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PigsService } from './pigs.service';
import { CreatePigDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';

@Controller('pigs')
export class PigsController {
  constructor(private readonly pigsService: PigsService) {}

  @Post()
  create(@Body() createPigDto: CreatePigDto) {
    return this.pigsService.create(createPigDto);
  }

  @Get()
  findAll() {
    const pigs= this.pigsService.findAll();
    return {status: "success", pigs}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pigsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePigDto: UpdatePigDto) {
    return this.pigsService.update(+id, updatePigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pigsService.remove(+id);
  }
}
