import { ParicionDto, Situacion } from "../dto/create-pig.dto";

export class Pig {
  nroCaravana: number;
  descripcion?: string;
  fechaFallecimiento?: Date;
  pariciones?: ParicionDto[];
  estadio: Situacion;
}
