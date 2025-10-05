import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  foundationId: number;

  @ApiProperty({ example: 2025 })
  @IsNumber()
  periodYear: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  periodMonth: number;

  @ApiProperty({ 
    example: {
      'DCI (Desnutrición Crónica Infantil)': 15.2,
      'Alimentos entregados': 500,
      'Beneficiarios con alimentos': 150
    }
  })
  @IsObject()
  data: any;

  @ApiProperty({ 
    example: ['documento1.pdf', 'evidencia.jpg'],
    required: false 
  })
  @IsOptional()
  @IsObject()
  attachments?: any;
}