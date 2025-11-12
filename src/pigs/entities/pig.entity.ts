import { situacion } from "../dto/create-pig.dto"

export class Pig {
    nroCaravana: number
    descripcion:string
    fechaFallecimiento?:Date
    pariciones?:Array<Object>
    situacion:situacion
    
}
