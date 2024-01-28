import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMessageBrokerService } from '@core/abstracts/message-broker-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { IRpcClientService } from '@core/abstracts/rpc-client-services.abstract'
import { FEATURE } from '@frameworks/data-servies/mongodb/constant/feature.constant'
import {
  MATCH_MAKING_REQUEST_STATUS,
  TYPE_MATCH_MAKING,
} from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import {
  MEETING_STATUS,
  TYPE_MEETING,
} from '@frameworks/data-servies/mongodb/constant/meeting.constant'
import { MatchMakingRequest } from '@frameworks/data-servies/mongodb/models/match-making-request.model'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { PREFIX_KEY_REDIS } from '@frameworks/in-memory-data-services/redis/constant/key.constant'
import { TOPIC_RABBITMQ } from '@frameworks/message-broker-services/rabbitmq/constant/topic.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { MatchMakingMessageDto } from '@use-cases/random-matching/dto/match-making-message.dto'
import { SpeedUpMatchMakingGrpcRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-grpc-request.dto'
import { SpeedUpMatchMakingRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-request.dto'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { getCurrentDay, getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class RandomMatchingUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private readonly dataService: IDataServices,
    private readonly messageBrokerService: IMessageBrokerService,
    private readonly inmemoryDataService: IInMemoryDataServices,
    private readonly userUsecase: UserUsecase,
    private readonly rpcClientService: IRpcClientService,
    private readonly mqttClientService: IMqttClientService,
  ) {}

  public async requestMatchMaking(userId: string, typeMatchMaking: string) {
    this.logger.debug({ userId }, 'requestMatchMaking')

    const meetingRecord = await this.dataService.meetingRecords.getOne({
      $or: [{ first_user_id: userId }, { second_user_id: userId }],
      status: { $ne: MEETING_STATUS.STOPPED },
    })
    if (meetingRecord) {
      throw new BadRequestException('User already in a meeting')
    }

    // todo: check current total usage today

    const currentDay = getCurrentDay()
    const existedFeatureUsageCount = await this.dataService.featureUsageCount.getOne({
      user_id: userId,
      time: currentDay,
      feature_name: FEATURE.RANDOM_CHAT,
    })
    if (existedFeatureUsageCount) {
      await this.dataService.featureUsageCount.update(existedFeatureUsageCount._id, {
        $inc: { total: 1 },
      })
    } else {
      await this.dataService.featureUsageCount.create({
        user_id: userId,
        time: currentDay,
        feature_name: FEATURE.RANDOM_CHAT,
        total: 1,
        created_at: getCurrentMilisecondTime(),
      })
    }
    const matchMakingRequest = await this.dataService.matchMakingRequest.create({
      user_id: userId,
      type_match_making: typeMatchMaking,
      created_at: getCurrentMilisecondTime(),
    })
    const matchMakingRequestId = matchMakingRequest._id.toString()

    const payload: MatchMakingMessageDto = {
      user_id: userId,
      match_making_request_id: matchMakingRequest._id,
    }
    const topic =
      typeMatchMaking == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? TOPIC_RABBITMQ.MATCH_MAKING_CHAT_TEXT
        : TOPIC_RABBITMQ.MATCH_MAKING_CHAT_VOICE
    await this.messageBrokerService.publish(topic, JSON.stringify(payload))

    return matchMakingRequestId
  }

  public async handleJoinRoom(userId: string, typeMatchingRoom: string) {
    this.logger.debug('handleJoinRoom', { userId })
    const prefixUserKey =
      typeMatchingRoom == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? PREFIX_KEY_REDIS.USER_RANDOM_CHAT_ONLINE
        : TYPE_MATCH_MAKING.RANDOM_VOICE_CALL
    const userKey = this.inmemoryDataService.getUserKeyName(userId, prefixUserKey)
    await this.inmemoryDataService.setKey(userKey, 1)

    const updateUserField: Partial<User> = {}
    if (typeMatchingRoom === TYPE_MATCH_MAKING.RANDOM_CHAT) {
      updateUserField.is_pending_chat_room = true
    } else {
      updateUserField.is_pending_voice_room = true
    }
    await this.dataService.users.updateByFilter({ _id: userId }, updateUserField)

    const systemKey =
      typeMatchingRoom == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_CHAT_ROOM
        : PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_VOICE_ROOM
    const existedSystemKey = await this.inmemoryDataService.getKey(systemKey)
    if (!existedSystemKey) {
      await this.inmemoryDataService.setKey(systemKey, 1)
    } else {
      await this.inmemoryDataService.setKey(systemKey, parseInt(existedSystemKey) + 1)
    }
  }

  public async handleRemoveRoom(userId: string, typeMatchingRoom: string) {
    this.logger.debug('handleRemoveRoom', { userId })
    const prefixUserKey =
      typeMatchingRoom == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? PREFIX_KEY_REDIS.USER_RANDOM_CHAT_ONLINE
        : TYPE_MATCH_MAKING.RANDOM_VOICE_CALL
    const userKey = this.inmemoryDataService.getUserKeyName(userId, prefixUserKey)
    await this.inmemoryDataService.deleteKey(userKey)

    const updateUserField: Partial<User> = {}
    if (typeMatchingRoom === TYPE_MATCH_MAKING.RANDOM_CHAT) {
      updateUserField.is_pending_chat_room = false
    } else {
      updateUserField.is_pending_voice_room = false
    }
    await this.dataService.users.updateByFilter({ _id: userId }, updateUserField)

    const systemKey =
      typeMatchingRoom == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_CHAT_ROOM
        : PREFIX_KEY_REDIS.TOTAL_CURRENT_ACTIVE_USER_VOICE_ROOM
    const existedSystemKey = await this.inmemoryDataService.getKey(systemKey)
    if (existedSystemKey) {
      await this.inmemoryDataService.setKey(systemKey, parseInt(existedSystemKey) - 1)
    }
  }

  public async handleMatchMaking(
    userId: string,
    matchMakingRequestId: string,
    typeMatching: string,
  ) {
    const typeMeeting = TYPE_MATCH_MAKING.RANDOM_CHAT
      ? TYPE_MEETING.RANDOM_CHAT
      : TYPE_MEETING.RANDOM_VOICE
    const prefixKey =
      typeMatching == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? PREFIX_KEY_REDIS.USER_RANDOM_CHAT_ONLINE
        : PREFIX_KEY_REDIS.USER_RANDOM_VOICE_ONLINE

    const pendingMatchMakingRequest = await this.dataService.matchMakingRequest.getOne({
      status: MATCH_MAKING_REQUEST_STATUS.PENDING,
      _id: userId,
      type_match_making: typeMatching,
    })
    const isAvailableConsumeRequest = await this._isAvailableConsumeMatchMakingRequest(
      pendingMatchMakingRequest,
      matchMakingRequestId,
    )
    if (!isAvailableConsumeRequest) {
      return
    }

    await this.dataService.matchMakingRequest.update(pendingMatchMakingRequest._id, {
      status: MATCH_MAKING_REQUEST_STATUS.CONSUMED,
    })

    const isTriggerAvailable = await this._isUserAvailableToMatchMaking(
      userId,
      prefixKey,
      typeMeeting,
    )
    if (!isTriggerAvailable) {
      return
    }

    let recommendUserIds = []
    let totalRetry = 0
    while (totalRetry < 3) {
      const filter: any = {}
      if (typeMatching == TYPE_MATCH_MAKING.RANDOM_CHAT) {
        filter.is_pending_chat_room = true
      } else {
        filter.is_pending_voice_room = true
      }
      recommendUserIds = await this.userUsecase.getListRecommendUserInRandomRoom(userId, filter)
      if (recommendUserIds.length) {
        break
      }

      let isFindPartner = false
      for (const recommendUserId of recommendUserIds) {
        const isRecommendUserAvailableMatching = await this._isUserAvailableToMatchMaking(
          recommendUserId,
          prefixKey,
          typeMeeting,
        )
        if (!isRecommendUserAvailableMatching) {
          continue
        }

        const isTriggerUserAvailable = await this._isUserAvailableToMatchMaking(
          userId,
          prefixKey,
          typeMeeting,
        )
        if (!isTriggerUserAvailable) {
          break
        }

        this.mqttClientService.publish(
          `random-room/${userId}`,
          JSON.stringify({
            user_id: recommendUserId,
          }),
        )
        this.mqttClientService.publish(
          `random-room/${recommendUserId}`,
          JSON.stringify({
            user_id: userId,
          }),
        )
        isFindPartner = true
      }

      if (isFindPartner) {
        break
      }
      totalRetry++
    }
  }

  public async _isAvailableConsumeMatchMakingRequest(
    pendingMatchMakingRequest: MatchMakingRequest,
    matchMakingRequestId: string,
  ): Promise<boolean> {
    if (
      !pendingMatchMakingRequest ||
      pendingMatchMakingRequest._id.toString() != matchMakingRequestId
    ) {
      return false
    }

    return true
  }

  public async stopMatchMaking(userId: string, typeMatchMaking: string) {
    await this.dataService.matchMakingRequest.update(
      { _id: userId, type_match_making: typeMatchMaking },
      { status: MATCH_MAKING_REQUEST_STATUS.CONSUMED },
    )
  }

  public async speedUpMatchMaking(
    userId: string,
    dto: SpeedUpMatchMakingRequestDto,
  ): Promise<boolean> {
    try {
      const currentDay = getCurrentDay()
      const existedFeatureUsageCount = await this.dataService.featureUsageCount.getOne({
        user_id: userId,
        time: currentDay,
        feature_name: FEATURE.SPEED_UP,
      })
      if (existedFeatureUsageCount) {
        // todo: check subscription or check coin
      }

      const payload: SpeedUpMatchMakingGrpcRequestDto = {
        user_id: userId,
        ...dto,
      }
      const isSuccess = await this.rpcClientService.speedUpMatchMaking(payload)
      if (!isSuccess) {
        return false
      }

      if (existedFeatureUsageCount) {
        await this.dataService.featureUsageCount.update(existedFeatureUsageCount._id, {
          $inc: { total: 1 },
        })
      } else {
        await this.dataService.featureUsageCount.create({
          user_id: userId,
          time: currentDay,
          feature_name: FEATURE.SPEED_UP,
          total: 1,
          created_at: getCurrentMilisecondTime(),
        })
      }
      return true
    } catch (error) {
      this.logger.error('speedUpMatchMaking', { error })
      return true
    }
  }

  public async _isUserAvailableToMatchMaking(
    userId: string,
    prefixKey: string,
    typeMeeting: string,
  ): Promise<boolean> {
    const userKey = this.inmemoryDataService.getUserKeyName(userId, prefixKey)
    const [meetingRecordOfUser, isSecondUserOnline] = await Promise.all([
      this.dataService.meetingRecords.getOne({
        $or: [{ first_user_id: userId }, { first_user_id: userId }],
        type_meeting: typeMeeting,
      }),
      this.inmemoryDataService.getKey(userKey),
    ])

    if (meetingRecordOfUser || !isSecondUserOnline) {
      return false
    }
    return true
  }
}
