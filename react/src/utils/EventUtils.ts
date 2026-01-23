import type {EventStatus, IEvent} from "../types/Event.ts";


export function getStatusProps(status: EventStatus): { color: "warning" | "error" | "success" | "default" | "primary" | "secondary" | "info" } {
  if (status === 'UPCOMING') return { color: 'warning' }
  else if (status === 'COMPLETED') return { color: 'primary' }
  else if (status === 'ONGOING') return { color: 'success' }
  else if (status === 'CANCELLED') return { color: 'error' }
  else return { color: 'default' }
}


const sortedStates: EventStatus[] = ['ONGOING', 'UPCOMING', 'UNKNOWN', 'CANCELLED', 'COMPLETED']

export function sortByStatusProps(a: IEvent, b: IEvent) {
  return sortedStates.indexOf(a.status) - sortedStates.indexOf(b.status)
}