import type {UpdateUser, User} from "../types/User.ts";
import {create} from "zustand/react";
import {api} from "../services/api.service.ts";
import type {ErrorResponse, ValidationErrorResponse} from "../types/AuthResponses.ts";
import {createJSONStorage, persist} from "zustand/middleware";
import {type AxiosError} from "axios";
import {navigateTo} from "./Navigation.ts";


function handleError(error: any) {
  const axError = error as AxiosError

  if (!axError.response) {
    console.error(axError)
    return 'Something went wrong.'
  }

  if (!(axError.response.data as any).fieldErrors)
    return (axError.response.data as ErrorResponse).message

  return (axError.response.data as ValidationErrorResponse).fieldErrors.length > 0
    ? (axError.response.data as ValidationErrorResponse).fieldErrors[0].message
    : (axError.response.data as ValidationErrorResponse).message
}


interface AuthState {
  user: User | null,
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<string | null>,
  login: (email: string, password: string) => Promise<string | null>,
  refresh: () => Promise<boolean>,
  refreshUserProfile: () => Promise<void>,
  updateUserProfile: (updatedUser: UpdateUser) => Promise<string>,
  logout: () => Promise<void>,
}

export const useAuthState = create<AuthState>()(
  persist(
    (set) => {
      return ({

        user: null,

        register: async (email, password, firstName, lastName) => {
          try {
            const response = await api.post<object | ValidationErrorResponse | ErrorResponse>('auth/register', {
              email, password, firstName, lastName
            })

            if (response.status < 200 || response.status >= 300) {
              console.log(`ERROR while register: ${JSON.stringify(response.data)}`)
              if (!response.data) return "Something went wrong."
              else if (!(response.data as any).fieldErrors) return (response.data as ErrorResponse).message
              return (response.data as ValidationErrorResponse).fieldErrors.length > 0 ? (response.data as ValidationErrorResponse).fieldErrors[0].message : (response.data as ValidationErrorResponse).message
            }

            return null
          } catch (error) {
            return handleError(error)
          }
        },

        login: async (email, password) => {
          try {
            const response = await api.post('auth/login', {email, password})
            return response.status === 200 ? null : 'Unknown response'
          } catch (error) {
            const axError = error as AxiosError
            return axError.response ? (axError.response.data as ErrorResponse).message : JSON.stringify(axError)
          }
        },

        refresh: async () => {
          try {

            const response = await api.post('auth/refresh')
            if (response.status !== 200) {
              console.log('refresh: something is weird: ', response)
            }
            return response.status === 200

          } catch (error) {

            return false

          }
        },

        refreshUserProfile: async () => {
          try {

            const response = await api.get<User>('users/profile')
            set({user: response.data})

          } catch (e) {return} // Prevents the 'Unhandled error' error in console.
        },

        updateUserProfile: async (updatedUser) => {
          try {

            const response = await api.post<User>('users/profile', updatedUser)
            set({user: response.data})
            return ''

          } catch (e) {
            return handleError(e)
          }
        },

        logout: async () => {
          await api.post('auth/logout')
          navigateTo('/login')
          set({user: null})
        },


      });
    }, {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)