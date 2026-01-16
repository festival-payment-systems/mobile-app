import type {Timestamps} from "./common.ts";


/** Correct type for updating the user to the backend. Unchanged fields must be the same as the current ones. **/
export interface MinimalUser {
  email: string,
  firstName: string,
  lastName: string,
}


export interface User extends MinimalUser {
  id: string,
  timestamps: Timestamps,
}
