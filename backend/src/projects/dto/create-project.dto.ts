import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  foundationId: number;

  @ApiProperty({ example: 'Programa Nutrición Infantil' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Programa enfocado en reducir la desnutrición crónica infantil en comunidades rurales',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  @IsDateString()
  reportStartDate?: Date;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  reportEndDate?: Date;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}