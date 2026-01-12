import {Navigate, Route, Routes, useNavigate, useParams} from "react-router";
import Layout from "./components/Layout.tsx";
import AuthProtected from "./components/wrappers/AuthProtected.tsx";
import {lazy, useEffect} from "react";
import {setNavigateFn, setSelectedEventName} from "./hooks/Navigation.ts";
import {useTranslation} from "react-i18next";
import NfcProtected from "./components/wrappers/NfcProtected.tsx";
import {useQuery} from "@tanstack/react-query";
import {api} from "./services/api.service.ts";
import type {IEvent} from "./types/Event.ts";
import {CircularProgress} from "@mui/material";


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
      <Route path={'/'}>
        <Route index element={<EventOverview event={EventQuery.data} />} />
      </Route>
    </Routes>
  )
}


const Login = lazy(() => import('./views/LoginScreen.tsx'))
const Register = lazy(() => import('./views/RegisterScreen.tsx'))
const EventsOverview = lazy(() => import('./views/EventsOverview.tsx'))

function App() {

  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setNavigateFn(navigate)
  }, [navigate]);

  useEffect(() => {
    i18n.changeLanguage('en')
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Layout/>}>
        <Route index element={<Navigate to={'/events'} />} />
        <Route path={'login'} element={<Login/>} />
        <Route path={'register'} element={<Register/>} />
        <Route path={'events'} element={<AuthProtected><EventsOverview/></AuthProtected>} />
        <Route path={'event/:eventId'} element={<AuthProtected><EventNavigation/></AuthProtected>} />
        <Route path={'nfc-test'} element={<NfcProtected neededRole={'Customer'}><h2>Successful NFC read!</h2></NfcProtected>} />
        <Route path={'*'} element={<p>Page not found</p>} />
      </Route>
    </Routes>
  )
}

export default App
