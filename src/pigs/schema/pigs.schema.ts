import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PigsDocument = HydratedDocument<Pig>

@Schema({
    timestamps:true
})
export class Pig {
    @Prop({
        required:true,
        unique:true,
        trim:true
    })
    nroCaravana: Number

    @Prop({
        required:true,
        trim:true
    })
    descripcion:string

}

export const PigSchema = SchemaFactory.createForClass(Pig)