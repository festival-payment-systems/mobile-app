import type {Timestamps} from "./common.ts";

export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  timestamps: Timestamps,
}
