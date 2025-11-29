import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export type Situacion = 'nulipara' | 'servida' | 'gestación confirmada'| 'parida con lechones'| 'destetada' | 'vacía'| 'descarte'
export class ServicioDto {
  @IsEnum(['cerdo', 'inseminacion', 'desconocido'])
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';

  // Si es inseminación o cerdo, la fecha es obligatoria
  @ValidateIf(o => o.tipo === 'inseminacion' || o.tipo === 'cerdo')
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser válida' })
  fecha!: Date;

  // Si es cerdo, macho es obligatorio
  @ValidateIf(o => o.tipo === 'cerdo')
  @IsString({ message: 'El macho debe ser un texto válido' })
  macho!: string;
}

export class ParicionDto {
  @IsDate()
  @Type(() => Date)
  fechaParicion: Date;
   get fechaFormateada(): string {
    return this.fechaParicion
      ? this.fechaParicion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
  }

  @IsNumber()
  cantidadLechones: number;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioDto)
  servicio?: ServicioDto;

  @IsOptional()
  @Type(()=> Date)
  fechaActualizacion?: Date;
}

export class CreatePigDto {
  @IsNumber()
  nroCaravana: number;
  
 @IsEnum(['pregnant', 'parida con lechones', 'servida', 'enferma', 'ninguno'], {
    message: 'estadio no es válido',
  })
  estadio: Situacion;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  ubicacion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  @IsOptional()
  @ValidateIf(o => o.estadio === 'enferma')
  enfermedadActual?:string

  

  @IsOptional()
  imageUrls?:string[]
}
