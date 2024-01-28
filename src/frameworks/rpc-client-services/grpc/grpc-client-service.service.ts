import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IRpcClientService } from '@core/abstracts/rpc-client-services.abstract'
import { TCreateUserRpc } from '@core/type/create-user-rpc'
import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { SpeedUpMatchMakingGrpcRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-grpc-request.dto'
import { lastValueFrom } from 'rxjs'
import { ISchedulerService } from './interface/schedule-service.interface'
import { IUserService } from './interface/user-service.interface'
import { SpeedUpMatchMakingRequest } from './protobufs/generated/scheduler_pb'
import { CreateUserRequest, GetListRecommendUserRequest } from './protobufs/generated/user_pb'

@Injectable()
export class GrpcClientService implements IRpcClientService, OnModuleInit {
  private userService: IUserService
  private scheduleService: ISchedulerService

  constructor(
    private readonly logger: ILoggerService,
    @Inject('API_PACKAGE') private readonly client: ClientGrpc,
    @Inject('SCHEDULER_PACKAGE') private readonly scheduleClient: ClientGrpc,
  ) {}

  public async getListRecommendProfile(
    id: string,
    ids: string[],
    limit: number,
  ): Promise<string[]> {
    try {
      const request = new GetListRecommendUserRequest()
      request.setId(id)
      request.setIdsList(ids)
      request.setLimit(limit)
      const res = await lastValueFrom(this.userService.getListRecommendUser(request.toObject()))
      return res.getIdsList()
    } catch (error) {
      this.logger.error({ error }, 'getListRecommendProfile')
      return []
    }
  }

  public async createUser(data: TCreateUserRpc): Promise<boolean> {
    const request = new CreateUserRequest()
    request.setId(data.id)
    request.setSexualOrientation(data.sexual_orientation)
    request.setRelationshipGoal(data.relationship_goal)
    request.setPassionsList(data.passions)
    request.setScore(data.score)

    const res = await lastValueFrom(this.userService.createUser(request.toObject()))
    return res.getIsSuccess()
  }

  public async speedUpMatchMaking(payload: SpeedUpMatchMakingGrpcRequestDto): Promise<boolean> {
    const request = new SpeedUpMatchMakingRequest()
    request.setUserId(payload.user_id)
    request.setSpeedUpLevel(payload.speed_up_level)
    request.setMatchMakingRequestId(payload.match_making_request_id)
    const typeMatchMaking = payload.type_match_making === TYPE_MATCH_MAKING.RANDOM_CHAT ? 0 : 1
    request.setTypeMatchMaking(typeMatchMaking)

    try {
      const res = await lastValueFrom(this.scheduleService.speedUpMatchMaking(request))
      return res.getStatus()
    } catch (error) {
      this.logger.debug('speedUpMatchMaking'), { error }
      return false
    }
  }

  onModuleInit() {
    this.userService = this.client.getService('User')
    this.scheduleService = this.scheduleClient.getService('SchedulerService')
  }
}
