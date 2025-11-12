// dto/create-pig.dto.ts
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export type Situacion =
  | 'pregnant'
  | 'parida con lechones'
  | 'servida'
  | 'enferma'
  | 'ninguno';

export class Paricion {
  @IsDateString()
  fechaParicion: string;

  @IsNumber()
  cantidadLechones: number;

  @IsString()
  descripcion: string;
}

export class CreatePigDto {
  @IsNumber()
  nroCaravana: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaFallecimiento?: string | null;

  @IsString()
  estadio: Situacion;

  @ValidateIf((o) => o.estadio === 'parida con lechones')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Paricion)
  pariciones?: Paricion[];
}
