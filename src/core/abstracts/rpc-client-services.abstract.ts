import { TCreateUserRpc } from '@core/type/create-user-rpc'
import { SpeedUpMatchMakingGrpcRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-grpc-request.dto'

export abstract class IRpcClientService {
  abstract getListRecommendProfile(id: string, ids: string[], limit: number): Promise<string[]>
  abstract createUser(data: TCreateUserRpc): Promise<boolean>
  abstract speedUpMatchMaking(payload: SpeedUpMatchMakingGrpcRequestDto): Promise<boolean>
}
