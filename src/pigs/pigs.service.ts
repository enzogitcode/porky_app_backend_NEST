import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pig, PigDocument } from './schema/pigs.schema';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';
@Injectable()
export class PigsService {
  constructor(@InjectModel(Pig.name) private pigModel: Model<PigDocument>) {}

  async create(createPigDto: CreatePigDto): Promise<Pig> {
  const pig = new this.pigModel({
    ...createPigDto,
    pariciones: createPigDto.pariciones?.map(p => ({
      ...p,
      fechaParicion: new Date(p.fechaParicion),
      fechaActualizacion: new Date(),
      servicio: p.servicio ? {
        ...p.servicio,
        fecha: new Date(p.servicio.fecha)
      } : undefined,
    })) || []
  });

  try {
    return await pig.save();
  } catch (err) {
    // Para duplicado de nroCaravana
    if (err.code === 11000) {
      throw new BadRequestException('La caravana ya existe');
    }
    throw err;
  }
}
async remove(id: string): Promise<Pig> {
  return this.pigModel.findByIdAndDelete(id).exec();
}


  async findAll(): Promise<Pig[]> {
    return this.pigModel.find().exec();
  }

  async findById(id: string): Promise<Pig | null> {
    const pig = await this.pigModel.findById(id).exec();
    if (!pig) throw new NotFoundException(`No se encontraron cerdos con el id ${id}`);
    return pig;
  }
  
  async findByCaravana(nroCaravana: number):Promise<Pig> {
    const pig = await this.pigModel.findOne({ nroCaravana }).exec();
    if (!pig) throw new NotFoundException(`No se encontraron cerdos con la caravana número ${nroCaravana}`);
    return pig
  }

  // En el service
async updatePig(pigId: string, updatePigDto: Partial<CreatePigDto>): Promise<Pig> {
  const pig = await this.pigModel.findByIdAndUpdate(
    pigId,
    { $set: updatePigDto },
    { new: true }
  );
  if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
  return pig;
}



  // 1️⃣ Crear una nueva parición
  async addParicion(pigId: string, paricion: ParicionDto): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $push: { pariciones: paricion } },
      { new: true }
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  // 2️⃣ Actualizar una parición existente
  async updateParicion(
    pigId: string,
    paricionId: string,
    updateData: Partial<ParicionDto>
  ): Promise<Pig> {
    const pig = await this.pigModel.findOneAndUpdate(
      { _id: pigId, 'pariciones._id': paricionId },
      { $set: { 'pariciones.$': updateData } },
      { new: true }
    );
    if (!pig) throw new NotFoundException(`No se encontró la parición con id ${paricionId}`);
    return pig;
  }

  // 3️⃣ Eliminar una parición
  async removeParicion(pigId: string, paricionId: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $pull: { pariciones: { _id: paricionId } } },
      { new: true }
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }
}
 
  
 

  



