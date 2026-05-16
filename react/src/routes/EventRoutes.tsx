import {lazy, useEffect} from "react";
import {Navigate, Route, Routes, useParams} from "react-router";
import {useAppState} from "../hooks/AppState.ts";
import {useQuery} from "@tanstack/react-query";
import {api} from "../services/api.service.ts";
import type {IEvent} from "../types/Event.ts";
import {CircularProgress} from "@mui/material";
import NfcProtected from "../components/wrappers/NfcProtected.tsx";


const EventOverview = lazy(() => import('../views/event/EventOverview.tsx'))
const EventMembers = lazy(() => import('../views/event/EventMembers.tsx'))
const EventNavScreen = lazy(() => import('../views/event/EventNavigation.tsx'))
const EventMemberInvite = lazy(() => import('../views/event/EventMemberInvite.tsx'))
const EventShops = lazy(() => import('../views/event/EventShops.tsx'))
const ShopRoutes = lazy(() => import('./ShopRoutes.tsx'))


function EventRoutes() {

  const {eventId} = useParams()
  const App = useAppState()

  const EventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => (await api.get<IEvent>(`events/${eventId}`)).data,
    enabled: !!eventId,
  })

  useEffect(() => {
    if (EventQuery.isSuccess) App.setSelectedEvent(EventQuery.data)
    else App.setSelectedEvent(null)
  }, [EventQuery.data]);

  if (!eventId || EventQuery.isError) return <Navigate to={'/events'}/>

  if (EventQuery.isLoading || !EventQuery.isSuccess || !App.selectedEvent) return <CircularProgress/>

  return (
    <Routes>
      <Route index path={'/*'} element={<EventNavScreen />} />
      <Route path={"/dashboard"} element={<EventOverview event={EventQuery.data}/>} />
      <Route path={"/members"} element={<EventMembers event={EventQuery.data}/>}/>
      <Route path={"/members/invite"} element={<EventMemberInvite event={EventQuery.data}/>}/>
      <Route path={"/members/invite/wristband"} element={<NfcProtected neededRole={'GUEST'} isRegister>Successful</NfcProtected>} />
      <Route path={"/shops"} element={<EventShops event={EventQuery.data}/>}/>
      <Route path={"/shop/:shopId/*"} element={<ShopRoutes event={EventQuery.data} />}/>
    </Routes>
  )
}

export default EventRoutes;