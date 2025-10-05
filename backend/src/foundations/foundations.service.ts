import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foundation } from './entities/foundation.entity';
import { CreateFoundationDto } from './dto/create-foundation.dto';

@Injectable()
export class FoundationsService {
  constructor(
    @InjectRepository(Foundation)
    private foundationsRepository: Repository<Foundation>,
  ) {}

  async create(createFoundationDto: CreateFoundationDto): Promise<Foundation> {
    const foundation = this.foundationsRepository.create(createFoundationDto);
    return this.foundationsRepository.save(foundation);
  }

  async findAll(): Promise<Foundation[]> {
    return this.foundationsRepository.find({
      relations: ['users', 'foundationAxes', 'foundationAxes.axis'],
    });
  }

  async findOne(id: number): Promise<Foundation> {
    return this.foundationsRepository.findOne({
      where: { id },
      relations: ['users', 'foundationAxes', 'foundationAxes.axis'],
    });
  }
}