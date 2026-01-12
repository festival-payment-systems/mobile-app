import {Navigate, Route, Routes, useNavigate, useParams} from "react-router";
import Layout from "./components/Layout.tsx";
import AuthProtected from "./components/wrappers/AuthProtected.tsx";
import {lazy, useEffect, useState} from "react";
import {setNavigateFn, setSelectedEventName} from "./hooks/Navigation.ts";
import {useTranslation} from "react-i18next";
import NfcProtected from "./components/wrappers/NfcProtected.tsx";
import {useQuery} from "@tanstack/react-query";
import {api} from "./services/api.service.ts";
import type {IEvent} from "./types/Event.ts";
import {CircularProgress, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useAppState} from "./hooks/AppState.ts";
import {useAuthState} from "./hooks/AuthState.ts";


const EventOverview = lazy(() => import('./views/EventOverview.tsx'))

function EventNavigation() {

  const {eventId} = useParams()

  const EventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => (await api.get<IEvent>(`events/${eventId}`)).data,
    enabled: !!eventId,
  })

  useEffect(() => {
    if (EventQuery.isSuccess) setSelectedEventName(EventQuery.data.name)
    else setSelectedEventName('')
  }, [EventQuery.data]);

  if (!eventId || EventQuery.isError) return <Navigate to={'/events'}/>

  if (EventQuery.isLoading || !EventQuery.isSuccess) return <CircularProgress/>

  return (
    <Routes>
      <Route index element={<EventOverview event={EventQuery.data}/>}/>
    </Routes>
  )
}


const Login = lazy(() => import('./views/LoginScreen.tsx'))
const Register = lazy(() => import('./views/RegisterScreen.tsx'))
const EventsOverview = lazy(() => import('./views/EventsOverview.tsx'))
const Settings = lazy(() => import('./views/Settings.tsx'))

function App() {

  const App = useAppState()
  const Auth = useAuthState()
  const navigate = useNavigate()
  const {i18n} = useTranslation()

  const [theme, setTheme] = useState(createTheme({
    palette: {
      mode: App.theme,
    }
  }))

  useEffect(() => {
    setNavigateFn(navigate)
  }, [navigate]);

  useEffect(() => {
    i18n.changeLanguage(App.language).then()
  }, [App.language]);

  useEffect(() => {
    setTheme(createTheme({
      palette: {
        mode: App.theme,
      }
    }))
  }, [App.theme]);

  useEffect(() => {
    const loadedTheme = localStorage.getItem('theme')
    if (loadedTheme && (loadedTheme == 'dark' || loadedTheme == 'light')) App.changeTheme(loadedTheme)

    const loadedLanguage = localStorage.getItem('language')
    if (loadedLanguage && (loadedLanguage == 'en' || loadedLanguage == 'de')) App.changeLanguage(loadedLanguage)

    Auth.refreshUserProfile()
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Routes>
        <Route path={'/'} element={<Layout/>}>
          <Route index element={<Navigate to={'/events'}/>}/>
          <Route path={'login'} element={<Login/>}/>
          <Route path={'register'} element={<Register/>}/>
          <Route path={'settings'} element={<AuthProtected><Settings/></AuthProtected>}/>
          <Route path={'events'} element={<AuthProtected><EventsOverview/></AuthProtected>}/>
          <Route path={'event/:eventId/*'} element={<AuthProtected><EventNavigation/></AuthProtected>}/>
          <Route path={'nfc-test'}
                 element={<NfcProtected neededRole={'Customer'}><h2>Successful NFC read!</h2></NfcProtected>}/>
          <Route path={'*'} element={<p>Page not found</p>}/>
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
