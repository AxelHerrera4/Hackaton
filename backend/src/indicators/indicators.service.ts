import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Indicator } from './entities/indicator.entity';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(Indicator)
    private indicatorsRepository: Repository<Indicator>,
  ) {}

  async findAll(axisId?: number): Promise<Indicator[]> {
    const query = this.indicatorsRepository.createQueryBuilder('indicator')
      .leftJoinAndSelect('indicator.axis', 'axis');
    
    if (axisId) {
      query.where('indicator.axisId = :axisId', { axisId });
    }
    
    return query.getMany();
  }

  async findApproved(axisId?: number): Promise<Indicator[]> {
    const query = this.indicatorsRepository.createQueryBuilder('indicator')
      .leftJoinAndSelect('indicator.axis', 'axis')
      .where('indicator.approved = :approved', { approved: true });
    
    if (axisId) {
      query.andWhere('indicator.axisId = :axisId', { axisId });
    }
    
    return query.getMany();
  }
}