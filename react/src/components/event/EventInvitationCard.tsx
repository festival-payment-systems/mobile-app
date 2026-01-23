import React, {useState} from 'react';
import type {IEventInvitation} from "../../types/Event.ts";
import {Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Typography} from "@mui/material";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../services/api.service.ts";
import {useNavigate} from "react-router";

interface Props {
  invitation: IEventInvitation,
  onAccept?: () => void,
  onDecline?: () => void,
}

function EventInvitationCard({invitation}: Props) {

  const QueryClient = useQueryClient()
  const nav = useNavigate()

  const [error, setError] = useState<string>('')

  const InvitationAcceptMutation = useMutation({
    mutationFn: (token: string) => api.post(`invitations/accept?token=${token}`),
    onError: (e) => setError(e.name),
    onSuccess: () => {
      QueryClient.refetchQueries({queryKey: ['events', 'event-invitations']}).then(() => nav('/events'))
    },
  })

  const InvitationDeclineMutation = useMutation({
    mutationFn: (token: string) => api.post(`invitations/decline?token=${token}`),
    onError: (e) => setError(e.name),
    onSuccess: () => {
      QueryClient.refetchQueries({queryKey: ['event-invitations']}).then(() => nav('/events'))
    },
  })

  function handleAccept() {
    InvitationAcceptMutation.mutate(invitation.token)
  }

  function handleDecline() {
    InvitationDeclineMutation.mutate(invitation.token)
  }


  return (
    <Card>
      <CardHeader>
        Do you want to join the event '{invitation.eventName}'?
      </CardHeader>
      {error && (
        <CardContent>
          <Typography variant={'body1'} color={'error'}>
            {error}
          </Typography>
        </CardContent>
      )}
      <CardActions>
        <Button
          variant={'outlined'} color={'error'} disabled={InvitationAcceptMutation.isPending || InvitationDeclineMutation.isPending}
          onClick={handleDecline}
        >
          {InvitationDeclineMutation.isPending ? <CircularProgress/> : 'Decline'}
        </Button>
        <Button
          variant={'contained'} color={'success'} disabled={InvitationAcceptMutation.isPending || InvitationDeclineMutation.isPending}
          onClick={handleAccept}
        >
          {InvitationAcceptMutation.isPending ? <CircularProgress/> : 'Accept'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default EventInvitationCard;