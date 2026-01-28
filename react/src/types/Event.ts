import type {Role, Timestamps} from "./common.ts";


export type EventStatus = 'UNKNOWN' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'


export interface IEvent {
  id: string,
  name: string,
  /** yyyy-MM-dd */
  startingAt?: string,
  /** yyyy-MM-dd */
  endingAt?: string,
  status: EventStatus,
  timestamps: Timestamps,
}


export interface IEventCreation {
  name: string,
  /** yyyy-MM-dd */
  startingAt: string,
  /** yyyy-MM-dd */
  endingAt: string,
}


export interface IEventMember {
  "id": string,
  "userId": string,
  "eventId": string,
  "roles": Role[],
  "timestamps": Timestamps,
}


export interface IInviteEventMember {
  email: string,
  roles: Role[],
}


export interface IEventInvitation {
  token: string,
  eventName: string,
  roles: Role[],
}
