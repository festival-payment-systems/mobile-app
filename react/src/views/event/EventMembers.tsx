import type {IEvent, IEventMember} from "../../types/Event.ts";
import {Box, CircularProgress, Container, TextField, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../services/api.service.ts";
import EventMemberCard from "./EventMemberCard.tsx";
import {MotionFab} from "../../components/Motion.tsx";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import NfcIcon from '@mui/icons-material/Nfc';
import {useAppState} from "../../hooks/AppState.ts";

interface Props {
  event: IEvent,
}

function EventMembers({ event }: Props) {

  const App = useAppState()
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const nav = useNavigate()

  const MembersQuery = useQuery({
    queryKey: ['members', event.id],
    queryFn: async () => (await api.get<IEventMember[]>(`events/${event.id}/members`)).data,
  })

  const [memberSearch, setMemberSearch] = useState<string>('')
  const [filter, setFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('')
  const [ascSort, setAscSort] = useState<boolean>(true)

  return (
    <Container maxWidth={'md'}>
      <Box>
        <TextField
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.name)}
          variant={'outlined'} fullWidth placeholder={'Search by name or wristband'}
        />
      </Box>

      {MembersQuery.isLoading && <CircularProgress/>}

      {MembersQuery.isError && <Typography color={'error'}>{MembersQuery.error.name}</Typography>}

      {MembersQuery.isSuccess && (
        <Box display={'flex'} flexDirection={'column'} gap={2} mt={2}>
          {MembersQuery.data.map(m => <EventMemberCard key={m.userId} member={m}/>)}
        </Box>
      )}

      <Tooltip title={t('invite member')} arrow placement={'auto'}>
        <MotionFab
          color="primary"
          aria-label={t('invite member')}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 20 : 40,
            right: isMobile ? 20 : 40,
            width: isMobile ? 56 : 70,
            height: isMobile ? 56 : 70,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          onClick={() => nav('invite')}
        >
          <PersonAddIcon fontSize={isMobile ? 'medium' : 'large'} />
        </MotionFab>
      </Tooltip>

      <Tooltip title={t('register wristband')} arrow placement={'auto'}>
        <MotionFab
          color="secondary"
          aria-label={t('register wristband')}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 20 : 40,
            left: isMobile ? 20 : 40,
            width: isMobile ? 56 : 70,
            height: isMobile ? 56 : 70,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          onClick={() => nav(`/event/${App.selectedEvent?.id}/members/invite/wristband`)}
          disabled={!App.isBridgeReady}
        >
          <NfcIcon fontSize={isMobile ? 'medium' : 'large'} />
        </MotionFab>
      </Tooltip>
    </Container>
  );
}

export default EventMembers;