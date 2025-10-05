import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoundationDto {
  @ApiProperty({ example: 'Fundación Esperanza' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contacto@fundacionesperanza.org' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}