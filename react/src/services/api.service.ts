import axios, {AxiosError, type AxiosRequestConfig, type CreateAxiosDefaults} from "axios";
import {config} from "../config.ts";
import {useAuthState} from "../hooks/AuthState.ts";
import {navigateTo} from "../hooks/Navigation.ts";


const MIN_DURATION_MS: number = 1000

declare module "axios" {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number,
    }
  }
}

export const api = axios.create({
  baseURL: `${config.BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.response.use(
  async (response) => {
    if (!config.useArtificialLoading || !response.config.metadata) return response

    const elapsed = Date.now() - response.config.metadata.startTime
    console.debug(`Request to '${response.config.url}' took ${elapsed} ms.`)
    const remaining = MIN_DURATION_MS - elapsed

    if (remaining > 0) {
      await new Promise(r => setTimeout(r, remaining))
    }

    return response
  },

  async (error: AxiosError) => {

    const reqUrl = error.config?.url

    if (reqUrl && (reqUrl.includes('login') || reqUrl.includes('register'))) {
      return Promise.reject(error)
    }

    // No response => server not reachable
    if (!error.response) {
      console.error('Server is unreachable!', error)
      return Promise.reject(error)
    }

    const Auth = useAuthState.getState()

    switch (error.response.status) {
      case 400:
        if (reqUrl && reqUrl.includes('refresh')) {
          console.log('Auth could not be refreshed (400 error) ', error)
          navigateTo('/login')
          return Promise.reject(error)
        }
        console.log(`400 ERROR: `, error)
        break

      case 401:
        console.log('Auth is Unauthorized. Trying to refresh ...')
        const refreshed = await Auth.refresh()
        if (refreshed) {
          console.log('Auth is refreshed.')
          // retry the request
          if (error.config) return api(error.config)
        } else {
          console.log('Auth could not be refreshed.')
          navigateTo('/login')
        }
        break

      default:
        console.error(error)
    }

    return Promise.reject(error)
  }

)


api.interceptors.request.use(
  (request) => {
    request.metadata = {
      startTime: Date.now(),
    }
    return request
  }
)
