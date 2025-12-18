import {Box, Container, Paper, styled, Typography} from "@mui/material";
import {Navigate, useParams} from "react-router";
import {PieChart} from '@mui/x-charts';
import {useDrawingArea} from "@mui/x-charts";
import {useEffect} from "react";
import {setRouteTitle, setSelectedEventName} from "../hooks/Navigation.ts";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {api} from "../services/api.service.ts";
import type {IEvent} from "../types/Event.ts";


const CenterText = styled("text")<{ useSecondary?: boolean }>(({ theme, useSecondary }) => ({
  fill: useSecondary ? theme.palette.text.secondary : theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
}))

function PieCenterLabel({ label, amount }: {label: string, amount: number}) {
  const { width, height, left, top } = useDrawingArea()
  const centerX = left + width / 2
  const centerY = top + height / 2

  return (
    <>
      <CenterText x={centerX} y={centerY - 14} fontSize={12} useSecondary >
        {label}
      </CenterText>
      <CenterText x={centerX} y={centerY + 14} fontSize={32} letterSpacing={1} >
        € {amount}
      </CenterText>
    </>
  )
}

function StatsLabel({ label, value }: { label: string, value: string | number }) {
  return (
    <Box width={'fit-content'}>
      <Typography variant={'subtitle2'} color={'textSecondary'} textAlign={'center'}>
        {label}
      </Typography>
      <Typography variant={'h5'} textAlign={'center'} mt={.5} >
        {value}
      </Typography>
    </Box>
  )
}


function EventOverview() {

  const {eventId} = useParams()
  const { t } = useTranslation()
  const RADIUS = 128

  const EventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => (await api.get<IEvent>(`events/${eventId}`)).data,
    enabled: !!eventId,
  })

  useEffect(() => {
    setRouteTitle(t('dashboard'))
    if (EventQuery.isSuccess)
      setSelectedEventName(EventQuery.data.name)
    else
      setSelectedEventName('')
  }, [EventQuery.data, EventQuery.error]);

  if (!eventId) return <Navigate to={'/events'}/>

  return (
    <Container maxWidth={'md'}>
      <Paper sx={{p: 4}}>
        <PieChart
          hideLegend
          height={RADIUS * 2}
          series={[{
            data: [
              {value: 432, label: 'Funky Accessories'},
              {value: 519, label: 'Juicy Fruits'},
              {value: 325, label: 'Beach Club'},
            ],
            innerRadius: RADIUS - 16,
            outerRadius: RADIUS,
            cornerRadius: 4,
            paddingAngle: 4,
          }]}
        >
          <PieCenterLabel label={t('total revenue')} amount={1234} />
        </PieChart>

        <Box display={'flex'} gap={4} justifyContent={'center'} mt={4}>
          <StatsLabel label={t('failed payments')} value={34} />
          <StatsLabel label={t('failed payments')} value={34} />
        </Box>
      </Paper>
    </Container>
  );
}

export default EventOverview;