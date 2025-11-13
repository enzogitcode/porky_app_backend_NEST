import { ParicionDto, Situacion } from "../dto/create-pig.dto";

export class Pig {
  nroCaravana: number;
  ubicacion:string
  descripcion?: string;
  fechaFallecimiento?: Date;
  pariciones?: ParicionDto[];
  estadio: Situacion;
}
