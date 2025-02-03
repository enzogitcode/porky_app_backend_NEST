import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PigsDocument = HydratedDocument<Pig>

@Schema()
export class Pig {
    @Prop({
        required:true,
        unique:true
    })
    nroCaravana: Number

    @Prop({
        required:true
    })
    status:boolean


}

export const PigSchema = SchemaFactory.createForClass(Pig)