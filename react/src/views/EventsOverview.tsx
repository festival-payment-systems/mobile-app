import {
  Badge,
  Box, Button,
  Container,
  Tooltip,
  Typography,
  useMediaQuery, useTheme
} from "@mui/material";
import {lazy, useEffect, useState} from "react";
import EventCard from "../components/event/EventCard.tsx";
import {MotionFab} from "../components/Motion.tsx";
import AddIcon from '@mui/icons-material/Add';
import EventCreation from "../components/event/EventCreation.tsx";
import {api} from "../services/api.service.ts";
import {useQuery} from "@tanstack/react-query";
import type {IEvent, IEventInvitation} from "../types/Event.ts";
import {useTranslation} from "react-i18next";
import {sortByStatusProps} from "../utils/EventUtils.ts";
import {useNavigate} from "react-router";
import NfcIcon from '@mui/icons-material/Nfc';
import {useAppState} from "../hooks/AppState.ts";
import {config} from "../config.ts";


const EventInvitations = lazy(() => import("../components/event/EventInvitations.tsx"))


function EventsOverview() {

  const App = useAppState()
  const nav = useNavigate()
  const {t} = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const EventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => (await api.get<IEvent[]>('events')).data,
  })

  const InvitationsQuery = useQuery({
    queryKey: ['event-invitations'],
    queryFn: async () => (await api.get<IEventInvitation[]>('invitations')).data,
    refetchInterval: config.eventInvitationsRefetchInterval,
  })

  const [eventCreation, setEventCreation] = useState<boolean>(false)
  const [eventInvitations, setEventInvitations] = useState<boolean>(false)

  useEffect(() => {
    if (!InvitationsQuery.isSuccess || InvitationsQuery.data.length === 0)
      setEventInvitations(false)
  }, [InvitationsQuery.data]);

  return (
    <Container maxWidth='md' sx={{width: '100vw', justifyItems: 'center'}}>
      <Box maxWidth={theme.breakpoints.values.sm} width='100%'>
        <Badge badgeContent={InvitationsQuery.isSuccess ? InvitationsQuery.data.length : 0} max={999} color={'secondary'} sx={{width: '100%'}}>
          <Button
            fullWidth variant={'contained'} disabled={!InvitationsQuery.isSuccess || InvitationsQuery.data.length === 0}
            sx={{mb: 2, p: 1, textTransform: 'unset'}} onClick={() => setEventInvitations(true)}
          >
            {t('event invitations')}
          </Button>
        </Badge>

        {EventsQuery.isSuccess && EventsQuery.data.sort(sortByStatusProps).map((e, i) => (
          <EventCard key={e.id} index={i} event={e}/>
        ))}

        {EventsQuery.isSuccess && EventsQuery.data.length <= 0 && (
          <Typography variant={'h2'} component={'h1'}>
            {t('no events')}
          </Typography>
        )}

        {EventsQuery.isLoading && (
          <Typography>
            {t('loading')}
          </Typography>
        )}

        {EventsQuery.isError && <>
            <Typography color={'error'}>
              {EventsQuery.error.message}
            </Typography>
        </>}
      </Box>

      <Tooltip title={t('create event')} arrow placement={'auto'}>
        <MotionFab
          color="primary"
          aria-label={t('create event')}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 20 : 40,
            right: isMobile ? 20 : 40,
            width: isMobile ? 56 : 70,
            height: isMobile ? 56 : 70,
          }}
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{type: 'spring', stiffness: 260, damping: 20, delay: 0.5}}
          onClick={() => setEventCreation(true)}
        >
          <AddIcon fontSize={isMobile ? 'medium' : 'large'}/>
        </MotionFab>
      </Tooltip>

      {App.isBridgeReady && (
        <Tooltip title={'NFC Test'} arrow placement={'auto'}>
          <MotionFab
            color="secondary"
            aria-label={'NFC Test'}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 20 : 40,
              left: isMobile ? 20 : 40,
              width: isMobile ? 56 : 70,
              height: isMobile ? 56 : 70,
            }}
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{type: 'spring', stiffness: 260, damping: 20, delay: 0.5}}
            onClick={() => nav('/nfc-test')}
          >
            <NfcIcon fontSize={isMobile ? 'medium' : 'large'}/>
          </MotionFab>
        </Tooltip>
      )}

      <EventCreation open={eventCreation} onClose={() => setEventCreation(false)}/>

      <EventInvitations invitations={InvitationsQuery.isSuccess ? InvitationsQuery.data : []} open={eventInvitations} onClose={() => setEventInvitations(false)}/>
    </Container>
  );
}

export default EventsOverview;