import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto, ParicionDto, Situacion } from './create-pig.dto';
import {
  IsArray,
  IsDate,
  IsString,
  ValidateNested,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidEstadio } from './validators/customValidation';

export class UpdatePigDto extends PartialType(CreatePigDto) {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.DESCARTE)
  @IsString()
  enfermedadActual?: string;

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.SERVIDA || o.estadio === Situacion.GESTACION_CONFIRMADA)
  @Type(() => Date)
  @IsDate()
  fechaServicioActual?: Date;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFallecimiento?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  @IsOptional()
  @IsEnum(Situacion)
  @IsValidEstadio({ message: 'Un cerdo con pariciones no puede ser nulípara' })
  estadio?: Situacion;

}
