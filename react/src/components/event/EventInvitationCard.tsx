import React, {useState} from 'react';
import type {IEventInvitation} from "../../types/Event.ts";
import {Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Typography} from "@mui/material";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../services/api.service.ts";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

interface Props {
  invitation: IEventInvitation,
  onAccept?: () => void,
  onDecline?: () => void,
}

function EventInvitationCard({invitation}: Props) {

  const QueryClient = useQueryClient()
  const nav = useNavigate()
  const { t } = useTranslation()

  const [error, setError] = useState<string>('')

  const InvitationAcceptMutation = useMutation({
    mutationFn: (token: string) => api.post(`invitations/accept?token=${token}`),
    onError: (e) => setError(e.name),
    onSuccess: async () => {
      await QueryClient.refetchQueries({queryKey: ['event-invitations']})
      await QueryClient.refetchQueries({queryKey: ['events']})
      nav('/events')
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
        <Typography variant={'h6'} textAlign={'center'} ml={1}>
          {invitation.eventName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={'outlined'} color={'error'}
            disabled={InvitationAcceptMutation.isPending || InvitationDeclineMutation.isPending}
            onClick={handleDecline}
          >
            {InvitationDeclineMutation.isPending ? <CircularProgress size={20}/> : t('decline')}
          </Button>
          <Button
            variant={'contained'} color={'success'}
            disabled={InvitationAcceptMutation.isPending || InvitationDeclineMutation.isPending}
            onClick={handleAccept}
          >
            {InvitationAcceptMutation.isPending ? <CircularProgress size={20}/> : t('accept')}
          </Button>
        </Box>
      </Box>

      <Typography variant={'body1'} color={'error'} textAlign={'center'}>
        {error}
      </Typography>
    </Card>
  );
}

export default EventInvitationCard;