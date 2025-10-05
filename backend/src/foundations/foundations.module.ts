import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundationsController } from './foundations.controller';
import { FoundationsService } from './foundations.service';
import { Foundation } from './entities/foundation.entity';
import { FoundationAxis } from './entities/foundation-axis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foundation, FoundationAxis])],
  controllers: [FoundationsController],
  providers: [FoundationsService],
  exports: [FoundationsService, TypeOrmModule],
})
export class FoundationsModule {}