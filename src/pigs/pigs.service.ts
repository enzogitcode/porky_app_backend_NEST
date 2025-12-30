import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pig, PigDocument } from './schema/pigs.schema';
import { Vacuna, VacunaDocument } from '../vacunas/schema/vacuna.schema';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';
import { VacunaAplicadaDto } from './dto/create-pig.dto';
@Injectable()
export class PigsService {
  constructor(
    @InjectModel(Pig.name) private pigModel: Model<PigDocument>,
  ) {}

  // -------------------------------
  // Crear un cerdo
  // -------------------------------
  async create(createPigDto: CreatePigDto): Promise<Pig> {
    const pig = new this.pigModel({
      ...createPigDto,
      pariciones: createPigDto.pariciones?.map(p => ({
        ...p,
        fechaParicion: new Date(p.fechaParicion),
        fechaActualizacion: new Date(),
        servicio: p.servicio
          ? { ...p.servicio, fecha: new Date(p.servicio.fecha) }
          : undefined,
      })) || [],
    });

    try {
      return await pig.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('La caravana ya existe');
      }
      throw err;
    }
  }

  // -------------------------------
  // Eliminar un cerdo
  // -------------------------------
  async remove(id: string): Promise<Pig> {
    return this.pigModel.findByIdAndDelete(id).exec();
  }

  // -------------------------------
  // Listar cerdos con paginación
  // -------------------------------
  async findAll(page: number = 1, limit: number = 10): Promise<{data: Pig[], total: number, page: number, totalPages: number}> {
    const skip = (page - 1) * limit;
    const pigs = await this.pigModel
      .find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.pigModel.countDocuments();
    return {
      data: pigs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // -------------------------------
  // Buscar cerdo por ID con vacunas pobladas
  // -------------------------------
  async findById(id: string): Promise<Pig> {
    const pig = await this.pigModel.findById(id).populate('vacunasAplicadas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontraron cerdos con el id ${id}`);
    return pig;
  }

  // -------------------------------
  // Buscar cerdo por caravana
  // -------------------------------
  async findByCaravana(nroCaravana: number): Promise<Pig> {
    const pig = await this.pigModel.findOne({ nroCaravana }).populate('vacunas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontraron cerdos con la caravana número ${nroCaravana}`);
    return pig;
  }

  // -------------------------------
  // Actualizar cerdo
  // -------------------------------
  async updatePig(pigId: string, updatePigDto: UpdatePigDto): Promise<Pig> {
    const pig = await this.pigModel.findById(pigId);
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);

    if (updatePigDto.fechaServicioActual) {
      updatePigDto.fechaServicioActual = new Date(updatePigDto.fechaServicioActual);
    }

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

    Object.assign(pig, updatePigDto);
    return pig.save();
  }

  // -------------------------------
  // Buscar cerdas servidas o en gestación
  // -------------------------------
  async findServidasOGestacion(): Promise<Pig[]> {
    return await this.pigModel.find({
      estadio: { $in: ['servida', 'gestación confirmada'] },
    })
    .sort({ fechaServicioActual: 1 })
    .exec();
  }

  // -------------------------------
  // Pariciones
  // -------------------------------
  async addParicion(pigId: string, paricion: ParicionDto): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $push: { pariciones: paricion } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  async updateParicion(pigId: string, paricionId: string, updateData: Partial<ParicionDto>): Promise<Pig> {
    const pig = await this.pigModel.findOneAndUpdate(
      { _id: pigId, 'pariciones._id': paricionId },
      { $set: { 'pariciones.$': updateData } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró la parición con id ${paricionId}`);
    return pig;
  }

  async removeParicion(pigId: string, paricionId: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $pull: { pariciones: { _id: paricionId } } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  // -------------------------------
  // Vacunas
  // -------------------------------

  async addVacuna(pigId: string, data: VacunaAplicadaDto): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      {
        $push: {
          vacunas: {
            vacuna: new Types.ObjectId(data.vacuna),
            fechaVacunacion: new Date(data.fechaVacunacion),
          },
        },
      },
      { new: true },
    ).populate('vacunas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  async removeVacuna(pigId: string, aplicacionId: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $pull: { vacunas: { _id: aplicacionId } } },
      { new: true },
    ).populate('vacunas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }
}
