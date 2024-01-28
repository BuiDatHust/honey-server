import { Module } from '@nestjs/common'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { MqttClientServiceModule } from '@services/mqtt-client-services/mqtt-client-service.module'
import { RandomMatchingUsecaseModule } from '@use-cases/random-matching/random-matching-use-case.module'
import { TaskScheduleUsecaseModule } from '@use-cases/task-schedule/task-schedule-use-case.module'
import { SchedulerUsecase } from './scheduler.use-case'

@Module({
  imports: [
    TaskScheduleUsecaseModule,
    RandomMatchingUsecaseModule,
    InMemoryServiceModule,
    MqttClientServiceModule,
  ],
  providers: [SchedulerUsecase],
  exports: [SchedulerUsecase],
})
export class SchedulerUsecaseModule {}
