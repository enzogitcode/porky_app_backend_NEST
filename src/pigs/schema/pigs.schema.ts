import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PigDocument = HydratedDocument<Pig>;

@Schema()
export class Servicio {
  @Prop({ enum: ['cerdo', 'inseminacion'], required: true })
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

  // Cada parto guarda su propio servicio (natural o inseminación)
  @Prop({ type: Servicio })
  servicio?: Servicio;
}

@Schema({ timestamps: true })
export class Pig {
  @Prop({ required: true })
  nroCaravana: number;

  @Prop()
  descripcion?: string;

  @Prop({
    type: String,
    enum: ['pregnant', 'parida con lechones', 'servida', 'enferma', 'ninguno'],
    required: true,
  })
  estadio: string;

  // Historial de partos
  @Prop({ type: [Paricion], default: [] })
  pariciones?: Paricion[];
}

export const PigSchema = SchemaFactory.createForClass(Pig);
