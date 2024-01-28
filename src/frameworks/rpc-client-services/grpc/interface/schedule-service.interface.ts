import { Observable } from 'rxjs'
import {
  SpeedUpMatchMakingRequest,
  SpeedUpMatchMakingResponse,
} from '../protobufs/generated/scheduler_pb'

export interface ISchedulerService {
  speedUpMatchMaking(request: SpeedUpMatchMakingRequest): Observable<SpeedUpMatchMakingResponse>
}
