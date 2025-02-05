import {IsDate, IsNumber, IsObject, IsString} from 'class-validator'
export class pariciones {
    fechaParicion: Date
    cantidadLechones:number
}
export class CreatePigDto {
    @IsNumber()
    nroCaravana:number
    @IsString()
    descripcion: string
    @IsDate()
    fechaFallecimiento:Date|null
    @IsObject()
    pariciones?:Array<pariciones>
}
