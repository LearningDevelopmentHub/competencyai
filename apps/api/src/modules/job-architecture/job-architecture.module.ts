import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { JobFamilyService } from './job-family.service';
import { JobFamilyController } from './job-family.controller';
import { JobLevelService } from './job-level.service';
import { JobLevelController } from './job-level.controller';
import { SuccessProfileService } from './success-profile.service';
import { SuccessProfileController } from './success-profile.controller';
import { JobDescriptionService } from './job-description.service';
import { JobDescriptionController } from './job-description.controller';

@Module({
  imports: [PrismaModule],
  providers: [JobFamilyService, JobLevelService, SuccessProfileService, JobDescriptionService],
  controllers: [JobFamilyController, JobLevelController, SuccessProfileController, JobDescriptionController],
  exports: [JobFamilyService, JobLevelService, SuccessProfileService, JobDescriptionService],
})
export class JobArchitectureModule {}
