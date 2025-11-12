import {IsArray, IsBoolean, IsDate, IsNumber, IsString} from 'class-validator'

export type situacion = 'pregnant'|'parida con lechones'|'servida'|'enferma'|'ninguno'
export class pariciones {
    fechaParicion: Date
    cantidadLechones:number
    descripcion:string
}
//posibles datos para una cerda
export class CreatePigDto {
    @IsNumber()
    nroCaravana:number

    @IsString()
    descripcion?: string|undefined

    @IsDate()
    fechaFallecimiento:Date|null

    estadio:situacion

    @IsArray()
    pariciones?:Array<pariciones>
}
