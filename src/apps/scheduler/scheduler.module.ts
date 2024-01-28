import { ConfigurationModule } from '@configuration/configuration.module'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { MqttClientServiceModule } from '@services/mqtt-client-services/mqtt-client-service.module'
import { RandomMatchingUsecaseModule } from '@use-cases/random-matching/random-matching-use-case.module'
import { SchedulerUsecaseModule } from '@use-cases/scheduler/scheduler-use-case.module'
import { TaskScheduleUsecaseModule } from '@use-cases/task-schedule/task-schedule-use-case.module'
import { GrpcController } from './controller/grpc.controller'
import { TaskController } from './controller/task.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerServiceModule,
    InMemoryServiceModule,
    MqttClientServiceModule,
    ConfigurationModule.forRoot(),
    TaskScheduleUsecaseModule,
    SchedulerUsecaseModule,
    RandomMatchingUsecaseModule,
  ],
  controllers: [GrpcController],
  providers: [TaskController],
})
export class SchedulerModule {}
