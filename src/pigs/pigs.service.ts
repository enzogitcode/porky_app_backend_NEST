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


  async findAll(page: number = 1, limit: number = 10): Promise<{data: Pig[], total: number, page: number, totalPages: number}> {
  const skip = (page - 1) * limit;

  const pigs = await this.pigModel
    .find()
    .sort({ updatedAt: -1 }) // 👉 mantiene el orden descendente
    .skip(skip)              // 👉 salta los registros anteriores
    .limit(limit)            // 👉 máximo 10 por consulta
    .exec();

  const total = await this.pigModel.countDocuments();

  return {
    data: pigs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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
async updatePig(pigId: string, updatePigDto: UpdatePigDto): Promise<Pig> {
  const pig = await this.pigModel.findById(pigId);
  if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);

  // Convertir fechaServicioActual si viene
  if (updatePigDto.fechaServicioActual) {
    updatePigDto.fechaServicioActual = new Date(updatePigDto.fechaServicioActual);
  }

  // Recalcular posibleFechaParto si cambia fechaServicioActual o estadio
  const estadio = updatePigDto.estadio ?? pig.estadio;
  const fechaServicio = updatePigDto.fechaServicioActual ?? pig.fechaServicioActual;

  if (fechaServicio && (estadio === 'servida' || estadio === 'gestación confirmada')) {
    const inicio = new Date(fechaServicio);
    const fin = new Date(fechaServicio);
    inicio.setDate(inicio.getDate() + 111);
    fin.setDate(fin.getDate() + 119);
    updatePigDto.posibleFechaParto = { inicio, fin };
  } else {
    updatePigDto.posibleFechaParto = undefined;
  }

  // Actualizar el cerdo
  Object.assign(pig, updatePigDto);
  return pig.save();
}





//obtener cerdas servidas o en gestación

async findServidasOGestacion(): Promise<Pig[]> {
  return await this.pigModel.find({
    estadio: { 
      $in: [
        'servida',
        'gestación confirmada'
      ]
    }
  })
  .sort({ fechaServicioActual: 1 })
  .exec();
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
 
  
 

  



