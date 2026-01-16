import type {IEvent, IEventMember} from "../../types/Event.ts";
import {Box, CircularProgress, Container, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../services/api.service.ts";
import EventCard from "../../components/event/EventCard.tsx";
import EventMemberCard from "./EventMemberCard.tsx";

interface Props {
  event: IEvent,
}

function EventMembers({ event }: Props) {

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
    </Container>
  );
}

export default EventMembers;