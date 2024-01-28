import { Observable } from 'rxjs'
import {
  CreateUserRequest,
  CreateUserResponse,
  GetListRecommendUserRequest,
  GetListRecommendUserResponse,
} from '../protobufs/generated/user_pb'

export interface IUserService {
  getListRecommendUser(
    request: GetListRecommendUserRequest.AsObject,
  ): Observable<GetListRecommendUserResponse>
  createUser(data: CreateUserRequest.AsObject): Observable<CreateUserResponse>
}
