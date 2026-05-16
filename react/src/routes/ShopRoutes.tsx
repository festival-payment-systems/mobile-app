import type {IEvent} from "../types/Event.ts";
import {Navigate, Route, Routes, useParams} from "react-router";
import {useAppState} from "../hooks/AppState.ts";
import {useQuery} from "@tanstack/react-query";
import {api} from "../services/api.service.ts";
import {CircularProgress} from "@mui/material";


// routes here


interface Props {
  event: IEvent,
}

function ShopRoutes({ event }: Props) {

  const {shopId} = useParams()
  const App = useAppState()

  const ShopQuery = useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => (await api.get<IEvent>(`shops/${shopId}`)).data,
    enabled: !!shopId,
  })

  if (!shopId || ShopQuery.isError) return <Navigate to={`/event/${event.id}`}/>

  if (ShopQuery.isLoading || !ShopQuery.isSuccess) return <CircularProgress/>

  return (
    <Routes>
      <Route index path={'/*'} element={null} />
      <Route index path={'/dashboard'} element={null} />
      <Route index path={'/products'} element={null} />
      <Route index path={'/transactions'} element={null} />
    </Routes>
  );
}

export default ShopRoutes;