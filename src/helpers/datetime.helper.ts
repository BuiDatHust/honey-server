import * as moment from 'moment-timezone'

export const getExpiry = (
  expireTime: number,
  unitExpireTime?: moment.DurationInputArg2,
): number => {
  const createdAt = new Date()
  const expiresAt = moment(createdAt).add(expireTime, unitExpireTime).toDate()
  return moment(expiresAt).valueOf()
}

export const getCurrentMilisecondTime = (): number => moment().valueOf()

export const getDiffirentTime = (
  dateA: number,
  dateB: number,
  unitTime: moment.unitOfTime.Diff,
): number => {
  const formatDateA = moment(dateA)
  const formatDateB = moment(dateB)

  return formatDateA.diff(formatDateB, unitTime)
}

export const getCurrentDay = (): number => moment(moment().format('MM/DD/YYYY')).valueOf()

export const addTimeToCurrentTime = (
  value: number,
  time_unit: moment.unitOfTime.DurationConstructor,
): number => moment().add(value, time_unit).valueOf()
