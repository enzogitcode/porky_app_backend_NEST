export type Situacion = 'pregnant' | 'parida con lechones' | 'servida' | 'enferma' | 'ninguno';

export class ServicioDto {
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';
  fecha: Date;
  macho?: string | null;
}

export class ParicionDto {
  fechaParicion: Date;
  cantidadLechones: number;
  descripcion?: string;
  servicio?: ServicioDto;
    fechaActualizacion?: Date; // <-- agregar

}

export class CreatePigDto {
  nroCaravana: number;
  descripcion?: string;
  estadio: Situacion;
  pariciones?: ParicionDto[];
}
