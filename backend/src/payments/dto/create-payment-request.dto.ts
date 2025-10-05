import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  reportId: number;

  @ApiProperty({ example: 2500.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;
}