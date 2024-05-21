export type ICreateSleepSessionInput = {
  date: string
  startTime?: string
  endTime?: string
  duration?: number
}

export type IUpdateSleepSessionInput = {
  startTime?: string
  endTime?: string
}
