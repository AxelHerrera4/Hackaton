import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AxesController } from './axes.controller';
import { AxesService } from './axes.service';
import { Axis } from './entities/axis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Axis])],
  controllers: [AxesController],
  providers: [AxesService],
  exports: [AxesService, TypeOrmModule],
})
export class AxesModule {}