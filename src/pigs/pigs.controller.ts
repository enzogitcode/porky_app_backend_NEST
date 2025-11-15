import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PigsService } from './pigs.service';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';
import { Pig } from './schema/pigs.schema';

@Controller('pigs')
export class PigsController {
  constructor(private readonly pigsService: PigsService) {}

  @Post()
  async create(@Body() createPigDto: CreatePigDto): Promise<Pig> {
    return this.pigsService.create(createPigDto);
  }

  @Get()
  async findAll(): Promise<Pig[]> {
    return this.pigsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Pig> {
    return await this.pigsService.findById(id);
  }

  @Get('caravana/:nroCaravana')
  async findByCaravana(@Param('nroCaravana') nroCaravana: string): Promise<Pig> {
    const pig = await this.pigsService.findByCaravana(Number(nroCaravana));
    return pig
  }

  // En el controller
@Patch(':id')
async updatePig(
  @Param('id') pigId: string,
  @Body() updatePigDto: Partial<CreatePigDto>
): Promise<Pig> {
  return this.pigsService.updatePig(pigId, updatePigDto);
}


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pig> {
    const pig = await this.pigsService.remove(id);
    if (!pig) throw new NotFoundException(`Pig with id ${id} not found`);
    
    return pig;
  }

  @Patch(':id/paricion')
  async addParicion(
    @Param('id') id: string,
    @Body() paricion: ParicionDto,
  ): Promise<Pig> {
    const pig = await this.pigsService.addParicion(id, paricion);
    if (!pig) throw new NotFoundException(`Pig with id ${id} not found`);
    return pig;
  }


}
