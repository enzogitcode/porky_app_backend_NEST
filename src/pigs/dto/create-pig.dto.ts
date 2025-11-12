import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export type Situacion =
  | 'pregnant'
  | 'parida con lechones'
  | 'servida'
  | 'enferma'
  | 'ninguno';

export class ServicioDto {
  @IsString()
  tipo: 'cerdo' | 'inseminacion';

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  macho?: string | null;
}

export class ParicionDto {
  @IsDateString()
  fechaParicion: string;

  @IsNumber()
  cantidadLechones: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioDto)
  servicio?: ServicioDto;
}

export class CreatePigDto {
  @IsNumber()
  nroCaravana: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  estadio: Situacion;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];
}
