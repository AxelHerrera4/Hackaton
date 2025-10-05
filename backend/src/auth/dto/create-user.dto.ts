import { IsEmail, IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.LIDER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  foundationId?: number;
}