import { IDataServices } from '@core/abstracts'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { BadGatewayException, Injectable } from '@nestjs/common'
import { addTimeToCurrentTime, getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import {
  FIRST_MAX_COMPLAINT,
  FIRST_MAX_COMPLAINT_PENALTY,
  SECOND_MAX_COMPLAINT,
  SECOND_MAX_COMPLAINT_PENALTY,
  THIRD_MAX_COMPLAINT,
  THIRD_MAX_COMPLAINT_PENALTY,
} from './constant/complaint.constant'
import { ComplaintRequestDto } from './dto/complaint-request.dto'

@Injectable()
export class ComplaintUsecase {
  constructor(private readonly dataService: IDataServices) {}

  public async complaint(complaintUserId: string, dto: ComplaintRequestDto) {
    const user = await this.dataService.users.getById(dto.user_id)
    if (!user) {
      throw new BadGatewayException('Not exist user!')
    }

    await this.dataService.complaint.create({
      complaint_user_id: complaintUserId,
      user_id: dto.user_id,
      reason: dto.reason,
      reason_detail: dto.reason_detail,
      created_at: getCurrentMilisecondTime(),
    })
    const complaints = await this.dataService.complaint.getByFilterWithPopulateField(
      {
        user_id: dto.user_id,
      },
      '_id',
    )
    const complaintPenalty = this._getComplaintPenalty(complaints.length)
    if (!complaintPenalty) {
      return
    }
    await this.dataService.users.update(dto.user_id, {
      status: USER_STATUS.BANNED,
      banned_at: getCurrentMilisecondTime(),
      unban_at: addTimeToCurrentTime(complaintPenalty, 'day'),
    })
  }

  private _getComplaintPenalty(complaintLen: number) {
    if (complaintLen > THIRD_MAX_COMPLAINT) {
      return THIRD_MAX_COMPLAINT_PENALTY
    }
    if (complaintLen > SECOND_MAX_COMPLAINT) {
      return SECOND_MAX_COMPLAINT_PENALTY
    }
    if (complaintLen > FIRST_MAX_COMPLAINT) {
      return FIRST_MAX_COMPLAINT_PENALTY
    }

    return 0
  }
}
