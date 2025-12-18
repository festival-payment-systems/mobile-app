import axios, {AxiosError} from "axios";
import {config} from "../config.ts";
import {useNavigate} from "react-router";
import {useAuthState} from "../hooks/AuthState.ts";
import {navigateTo} from "../hooks/Navigation.ts";

export const api = axios.create({
  baseURL: `${config.BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,

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
