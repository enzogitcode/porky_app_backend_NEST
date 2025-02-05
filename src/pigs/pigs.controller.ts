import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PigsService } from './pigs.service';
import { CreatePigDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';

@Controller('pigs')
export class PigsController {
  constructor(private readonly pigsService: PigsService) {}

  @Get()
  findAll() {
    const pigs= this.pigsService.findAll();
    console.log({pigs})
    return pigs
  }
  
  @Post()
  create(@Body() createPigDto: CreatePigDto) {
    return this.pigsService.create(createPigDto);
  }


  @Get(':nroCaravana')
  findOne(@Param('nroCaravana') nroCaravana: number) {
    return this.pigsService.findOne(nroCaravana);
  }

  @Put(':nroCaravana')
  update(@Param('nroCaravana') nroCaravana: number, @Body() updatePigDto: UpdatePigDto) {
    return this.pigsService.update(+nroCaravana, updatePigDto);
  }

  @Delete(':nroCaravana')
  remove(@Param('nroCaravana') nroCaravana: number) {
    return this.pigsService.remove(+nroCaravana);
  }
}
