import { Module } from '@nestjs/common';
import { CompetencyService } from './competency.service';
import { CompetencyController } from './competency.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CompetencyService],
  controllers: [CompetencyController],
  exports: [CompetencyService],
})
export class CompetencyModule {}
