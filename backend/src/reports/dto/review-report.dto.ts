import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewReportDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({ 
    example: 'Los datos no coinciden con las evidencias presentadas',
    required: false 
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}