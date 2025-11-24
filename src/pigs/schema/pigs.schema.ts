import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Situacion } from '../dto/create-pig.dto';

export type PigDocument = HydratedDocument<Pig>;

@Schema()
export class Servicio {
  @Prop({ enum: ['cerdo', 'inseminacion', 'desconocido'], required: true })
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';

  @Prop({ type: Date, required: false }) // fecha opcional
  fecha?: Date;

  @Prop({ required: false })
  macho?: string | null;
}

@Schema()
export class Paricion {
  @Prop({ type: Date, required: true })
  fechaParicion: Date;

  @Prop({ required: true })
  cantidadLechones: number;

  @Prop({ required: false })
  descripcion?: string;

  @Prop({ type: Servicio, required: false }) // servicio opcional
  servicio?: Servicio;

  @Prop({ type: Date, default: Date.now })
  fechaActualizacion: Date; // timestamp de la parición
}

@Schema({ timestamps: true }) // timestamps automáticos del cerdo
export class Pig {
  @Prop({ required: true })
  nroCaravana: number;

  @Prop({ required: false })
  descripcion?: string;

  @Prop({ required: true })
  estadio: Situacion;

  @Prop({ type: [Paricion], default: [] })
  pariciones?: Paricion[];

  @Prop({ required: false })
  ubicacion?: string;
}

export const PigSchema = SchemaFactory.createForClass(Pig);
