import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export type Situacion = 'pregnant' | 'parida con lechones' | 'servida'| 'enferma'| 'ninguno'
export class ServicioDto {
  @IsEnum(['cerdo', 'inseminacion', 'desconocido'])
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';

  @IsDate()
  @Type(() => Date)  // <--- convierte string a Date
  fecha: Date;

  @ValidateIf(o => o.tipo === 'cerdo')
  @IsOptional()
  @IsString()
  macho?: string | null;
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
  imageUrls?:string[]
}
