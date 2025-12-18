export function getMillisFromDateString(date: string) {
  const splits = date.split('-')
  return Date.UTC(parseInt(splits[0]), parseInt(splits[1]), parseInt(splits[2]))
}

export function dateToString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}