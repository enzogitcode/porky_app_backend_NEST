import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VacunaDocument = Document & Vacuna;

@Schema({ timestamps: true })
export class Vacuna {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  laboratorio?: string;

  @Prop()
  proveedor?: string;

  @Prop()
  dosis?: string;
}

export const VacunaSchema = SchemaFactory.createForClass(Vacuna);
