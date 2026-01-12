import {create} from "zustand/react";
import type {IEvent} from "../types/Event.ts";
import type { PaletteMode } from "@mui/material/styles";

interface AppState {
  selectedEvent: IEvent | null,
  isBridgeReady: boolean,
  language: string,
  changeLanguage: (len: string) => void,
  theme: PaletteMode,
  changeTheme: (theme: PaletteMode) => void,
}


export const useAppState = create<AppState>()(
  (set) => ({

    selectedEvent: null,
    isBridgeReady: false,
    language: 'en',
    theme: 'dark',

    changeLanguage: (len: string) => {
      localStorage.setItem('language', len)
      set({language: len})
    },

    changeTheme: (theme: PaletteMode) => {
      localStorage.setItem('theme', theme)
      set({theme})
    },

  })
)