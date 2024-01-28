import { Module } from '@nestjs/common'
import { RandomMatchingUsecaseModule } from '@use-cases/random-matching/random-matching-use-case.module'
import { TaskScheduleUsecase } from './task-schedule.use-case'

@Module({
  imports: [RandomMatchingUsecaseModule],
  providers: [TaskScheduleUsecase],
  exports: [TaskScheduleUsecase],
})
export class TaskScheduleUsecaseModule {}
