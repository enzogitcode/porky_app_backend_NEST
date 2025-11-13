import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export type Situacion = 'pregnant' | 'parida con lechones' | 'servida'| 'enferma'| 'ninguno'
export class ServicioDto {
  @IsEnum(['cerdo', 'inseminacion', 'desconocido'])
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';

  @IsDate()
  @Type(() => Date)  // <--- convierte string a Date
  fecha: Date;

  @IsOptional()
  @IsString()
  macho?: string | null;
}

export class ParicionDto {
  @IsDate()
  @Type(() => Date)
  fechaParicion: Date;

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

  
  estadio: Situacion;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  ubicacion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];
}
