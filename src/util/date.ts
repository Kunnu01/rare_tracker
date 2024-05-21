export const getDateFromTime = (
  date: Date,
  time: string,
  isNextDay = false,
): Date => {
  const [hours, minutes] = time.split(':').map(Number)
  const givenDate = new Date(date)
  console.log({ givenDate })
  const newDate = new Date(givenDate.setHours(hours, minutes))
  console.log({ newDate })
  console.log({ isNextDay })
  if (isNextDay) {
    console.log({ getDate: newDate.getDate() })
    return new Date(new Date(newDate).setDate(date.getDate() + 1))
  }

  return newDate
}

export const getDuration = (startDate: Date, endDate: Date): number => {
  const duration = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60
  return duration
}

export const isNextDay = (startTime: string, endTime: string): boolean => {
  const [startHours] = startTime.split(':').map(Number)
  const [endHours] = endTime.split(':').map(Number)

  return startHours > endHours
}

export const getDate = (date: string): Date => {
  const [month, day, year] = date.split('/').map(Number)
  const dateString = new Date(
    new Date(year, month - 1, day + 1).setHours(0, 0, 0, 0),
  )
  return dateString
}

const timeStringToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

const minutesToTimeString = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`
}

export const calculateAverageTime = (timeStrings: string[]) => {
  const totalMinutes = timeStrings.reduce(
    (acc, timeString) => acc + timeStringToMinutes(timeString),
    0,
  )
  const averageMinutes = totalMinutes / timeStrings.length
  return minutesToTimeString(averageMinutes)
}
