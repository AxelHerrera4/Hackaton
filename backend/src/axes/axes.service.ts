import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Axis } from './entities/axis.entity';

@Injectable()
export class AxesService {
  constructor(
    @InjectRepository(Axis)
    private axesRepository: Repository<Axis>,
  ) {}

  async findAll(): Promise<Axis[]> {
    return this.axesRepository.find({
      relations: ['indicators'],
    });
  }

  async findOne(id: number): Promise<Axis> {
    return this.axesRepository.findOne({
      where: { id },
      relations: ['indicators'],
    });
  }
}