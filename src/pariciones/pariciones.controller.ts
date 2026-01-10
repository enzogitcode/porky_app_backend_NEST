import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParicionesService } from './pariciones.service';
import { CreateParicioneDto } from './dto/create-paricione.dto';
import { UpdateParicioneDto } from './dto/update-paricione.dto';

@Controller('pariciones')
export class ParicionesController {
  constructor(private readonly paricionesService: ParicionesService) {}

  @Post()
  create(@Body() createParicioneDto: CreateParicioneDto) {
    return this.paricionesService.create(createParicioneDto);
  }

  @Get()
  findAll() {
    return this.paricionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paricionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParicioneDto: UpdateParicioneDto) {
    return this.paricionesService.update(+id, updateParicioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paricionesService.remove(+id);
  }
}
