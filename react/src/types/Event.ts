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