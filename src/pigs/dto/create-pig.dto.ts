import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { IsValidEstadio } from './validators/customValidation';

export enum Situacion {
  NULIPARA = 'nulipara',
  SERVIDA = 'servida',
  GESTACION_CONFIRMADA = 'gestación confirmada',
  PARIDA = 'parida con lechones',
  DESTETADA = 'destetada',
  VACIA = 'vacía',
  DESCARTE = 'descarte',
}

export enum TipoServicio {
  CERDO = 'cerdo',
  INSEMINACION = 'inseminacion',
  DESCONOCIDO = 'desconocido',
}

export class ServicioDto {
  @IsEnum(TipoServicio)
  tipo!: TipoServicio;

  @ValidateIf(o => o.tipo === TipoServicio.INSEMINACION || o.tipo === TipoServicio.CERDO)
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser válida' })
  fecha!: Date;

  @ValidateIf(o => o.tipo === TipoServicio.CERDO)
  @IsString({ message: 'El macho debe ser un texto válido' })
  macho!: string;

  @ValidateIf(o => o.tipo === TipoServicio.INSEMINACION)
  @IsString({ message: "El proveedor de dosis debe ser un string" })
  proveedorDosis!: string;
}

export class VacunasDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  proveedor?: string;

  @IsOptional()
  @IsString()
  laboratorio?: string;

  @Type(() => Date)
  @IsDate()
  fechaVacunacion!: Date;
}

export class ParicionDto {
  @IsDate()
  @Type(() => Date)
  fechaParicion!: Date;

  get fechaFormateada(): string {
    return this.fechaParicion
      ? this.fechaParicion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
  }

  @IsNumber()
  cantidadLechones!: number;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioDto)
  servicio?: ServicioDto;

  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;
}

export class CreatePigDto {
  @IsNumber()
  nroCaravana!: number;

  @IsEnum(Situacion, { message: 'estadio no es válido' })
  @IsValidEstadio({ message: 'Un cerdo con pariciones no puede ser nulípara' })
  estadio!: Situacion;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  ubicacion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.DESCARTE)
  enfermedadActual?: string;

  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];

  @Expose()
  get lechonesTotal(): number {
    if (!this.pariciones || this.pariciones.length === 0) {
      return 0;
    }
    return this.pariciones.reduce(
      (acc, paricion) => acc + (paricion.cantidadLechones || 0),
      0
    );
  }
}
