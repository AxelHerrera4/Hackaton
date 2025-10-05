import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportDto {
  @ApiProperty({ 
    example: {
      'DCI (Desnutrición Crónica Infantil)': 16.5,
      'Alimentos entregados': 600,
      'Beneficiarios con alimentos': 180
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({ 
    example: ['documento_actualizado.pdf'],
    required: false 
  })
  @IsOptional()
  @IsObject()
  attachments?: any;
}