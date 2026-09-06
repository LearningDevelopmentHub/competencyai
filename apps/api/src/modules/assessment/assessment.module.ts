import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { CalibrationService } from './calibration.service';
import { CalibrationController } from './calibration.controller';

@Module({
  imports: [PrismaModule],
  providers: [AssessmentService, SubmissionService, CalibrationService],
  controllers: [AssessmentController, SubmissionController, CalibrationController],
  exports: [AssessmentService, SubmissionService, CalibrationService],
})
export class AssessmentModule {}
