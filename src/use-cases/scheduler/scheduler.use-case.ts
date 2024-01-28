import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { PREFIX_KEY_REDIS } from '@frameworks/in-memory-data-services/redis/constant/key.constant'
import { Injectable } from '@nestjs/common'
import { CurrentActiveUseInRoomDto } from '@use-cases/random-matching/dto/current-active-use-in-room.dto'
import { RandomMatchingUsecase } from '@use-cases/random-matching/random-matching.use-case'
import { TaskScheduleUsecase } from '@use-cases/task-schedule/task-schedule.use-case'

@Injectable()
export class SchedulerUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private readonly taskScheduleUsecase: TaskScheduleUsecase,
    private readonly randomMatchingUsecase: RandomMatchingUsecase,
    private readonly mqttClientService: IMqttClientService,
    private readonly inMemoryDataService: IInMemoryDataServices,
  ) {}

  async speedUpMatchMaking({
    speedUpLevel,
    userId,
    matchMakingRequestId,
    typeMatchMaking,
  }: {
    speedUpLevel: number
    userId: string
    matchMakingRequestId: string
    typeMatchMaking: string
  }) {
    this.logger.info({ userId, matchMakingRequestId })

    await this.taskScheduleUsecase.addJobSpeedUpMatchMaking(
      speedUpLevel,
      typeMatchMaking,
      userId,
      matchMakingRequestId,
    )
  }

  public async handleGetTotalUserInRoom() {
    const totalUserInChatRoom = await this.inMemoryDataService.getKey(
      PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_CHAT_ROOM,
    )
    const totalUserInVoiceRoom = await this.inMemoryDataService.getKey(
      PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_CHAT_ROOM,
    )
    const payload: CurrentActiveUseInRoomDto = {
      total_user_in_chat_room: parseInt(totalUserInChatRoom),
      total_user_in_voice_room: parseInt(totalUserInVoiceRoom),
    }

    this.mqttClientService.publish('current-active-user-in-room', JSON.stringify(payload))
  }
}
