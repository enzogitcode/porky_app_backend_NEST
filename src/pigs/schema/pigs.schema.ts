import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Situacion } from '../dto/create-pig.dto';

export type PigDocument = HydratedDocument<Pig>;

@Schema()
export class Servicio {
  @Prop({ enum: ['cerdo', 'inseminacion', 'desconocido'], required: true })
  tipo: string;

  @Prop({ type: Date, required: true })
  fecha: Date;

  @Prop()
  macho?: string | null;
}

@Schema()
export class Paricion {
  @Prop({ type: Date })
  fechaParicion: Date;

  @Prop()
  cantidadLechones: number;

  @Prop()
  descripcion?: string;

  @Prop({ type: Servicio })
  servicio?: Servicio;

  @Prop({ type: Date, default: Date.now })
  fechaActualizacion: Date; // timestamp de la parición
}

@Schema({ timestamps: true }) // timestamps automáticos del cerdo
export class Pig {
  @Prop({ required: true })
  nroCaravana: number;

  @Prop()
  descripcion?: string;

  @Prop({
    required: true,
  })
  estadio: Situacion;

  @Prop({ type: [Paricion], default: []})
  pariciones?: Paricion[];
}

export const PigSchema = SchemaFactory.createForClass(Pig);
