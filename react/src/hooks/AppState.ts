import {create} from "zustand/react";
import type {IEvent} from "../types/Event.ts";

interface AppState {
  selectedEvent: IEvent | null,
  isBridgeReady: boolean,
}


export const useAppState = create<AppState>()(
  (set) => ({

    selectedEvent: null,
    isBridgeReady: false,

  })
)