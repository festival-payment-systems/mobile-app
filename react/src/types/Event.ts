import type {Timestamps} from "./common.ts";

export interface IEvent {
  id: string,
  name: string,
  /** yyyy-MM-dd */
  startingAt?: string,
  /** yyyy-MM-dd */
  endingAt?: string,
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
  "timestamps": Timestamps,
}