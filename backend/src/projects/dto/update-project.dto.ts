import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Programa Nutrición Infantil Actualizado', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: 'Descripción actualizada del programa',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-02-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ example: '2025-11-30', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ example: '2025-02-01', required: false })
  @IsOptional()
  @IsDateString()
  reportStartDate?: Date;

  @ApiProperty({ example: '2025-11-30', required: false })
  @IsOptional()
  @IsDateString()
  reportEndDate?: Date;

  @ApiProperty({ example: 'inactive', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}