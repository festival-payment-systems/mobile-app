import type {IEvent} from "../types/Event.ts";
import {getMillisFromDateString} from "./DateTimeUtils.ts";

export const getStatusProps = (start: number, end?: number): {
  label: 'upcoming' | 'completed' | 'ongoing',
  color: "warning" | "error" | "success" | "default" | "primary" | "secondary" | "info",
} => {
  if (start > Date.now())
    return { label: 'upcoming', color: 'warning' }
  else if (end && end <= Date.now())
    return { label: 'completed', color: 'error' }
  else
    return { label: 'ongoing', color: 'success' }
}


const sortedLabels = ['ongoing', 'upcoming', 'completed']

export function sortByStatusProps(a: IEvent, b: IEvent) {
  const startDateA = a.startingAt ? getMillisFromDateString(a.startingAt) : Date.parse(a.timestamps.createdAt)
  const endDateA = a.endingAt ? getMillisFromDateString(a.endingAt) : undefined

  const startDateB = b.startingAt ? getMillisFromDateString(b.startingAt) : Date.parse(b.timestamps.createdAt)
  const endDateB = b.endingAt ? getMillisFromDateString(b.endingAt) : undefined

  const statusPropsA = getStatusProps(startDateA, endDateA)
  const statusPropsB = getStatusProps(startDateB, endDateB)

  if (statusPropsA.label === statusPropsB.label) return 0
  return sortedLabels.indexOf(statusPropsA.label) - sortedLabels.indexOf(statusPropsB.label)
}