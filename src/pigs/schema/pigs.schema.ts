import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PigDocument = HydratedDocument<Pig>;

@Schema({ timestamps: true })
export class Paricion {
  @Prop()
  fechaParicion: Date;

  @Prop()
  cantidadLechones: number;

  @Prop()
  descripcion: string;
}

@Schema()
export class Pig {
  @Prop({ required: true })
  nroCaravana: number;

  @Prop()
  descripcion?: string;

  @Prop({ type: Date, required: false })
  fechaFallecimiento?: Date | null;

  @Prop({
    type: String,
    enum: ['pregnant', 'parida con lechones', 'servida', 'enferma', 'ninguno'],
    required: true,
  })
  estadio: string;

  @Prop({ type: [Paricion], default: [] })
  pariciones?: Paricion[];
}

export const PigSchema = SchemaFactory.createForClass(Pig);
