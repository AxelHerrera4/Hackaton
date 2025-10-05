import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['foundation']
    });
    
    // Simplificado para MVP - comparación directa de contraseñas
    if (user && user.passwordHash === password) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      foundationId: user.foundationId 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        foundationId: user.foundationId,
        foundation: user.foundation
      }
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    // Simplificado para MVP - contraseña en texto plano
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
    });

    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = savedUser as any;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ 
      where: { email },
      relations: ['foundation']
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['foundation']
    });
  }
}