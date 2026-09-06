import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { DevPlanService } from './dev-plan.service';
import { DevPlanController } from './dev-plan.controller';

@Module({
  imports: [PrismaModule],
  providers: [LearningService, DevPlanService],
  controllers: [LearningController, DevPlanController],
  exports: [LearningService, DevPlanService],
})
export class LearningModule {}
