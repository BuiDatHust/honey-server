import * as moment from 'moment-timezone'

export const getExpiry = (
  expireTime: number,
  unitExpireTime?: moment.DurationInputArg2,
): number => {
  const createdAt = new Date()
  const expiresAt = moment(createdAt).add(expireTime, unitExpireTime).toDate()
  return moment(expiresAt).valueOf()
}

export const getCurrentMilisecondTime = () => moment().valueOf()

export const getDiffirentTime = (
  dateA: number,
  dateB: number,
  unitTime: moment.unitOfTime.Diff,
): number => {
  const formatDateA = moment(dateA)
  const formatDateB = moment(dateB)

  return formatDateA.diff(formatDateB, unitTime)
}
