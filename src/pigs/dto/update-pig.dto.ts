import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto, ParicionDto, Situacion } from './create-pig.dto';
import { IsArray, IsDate, IsString, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidEstadio } from './validators/customValidation';
export class UpdatePigDto extends PartialType(CreatePigDto) {
  @IsString()
  descripcion?: string;
  
  @IsString()
  ubicacion?: string;

  @IsDate()
  fechaFallecimiento?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  
  @IsOptional()
  @IsEnum(Situacion)
  @IsValidEstadio({ message: 'Un cerdo con pariciones no puede ser nulípara' })
  estadio?: Situacion;
  
}
