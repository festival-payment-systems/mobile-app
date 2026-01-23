import React, {useState} from 'react';
import {
  Box,
  Button,
  Container, Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from '@mui/icons-material/Send';
import {useTranslation} from "react-i18next";
import {api} from "../../services/api.service.ts";
import type {IEvent, IInviteEventMember} from "../../types/Event.ts";
import type {AxiosError} from "axios";


interface Props {
  event: IEvent,
}

function EventMemberInvite({ event }: Props) {

  const {t} = useTranslation()
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))

  const [invites, setInvites] = useState<IInviteEventMember[]>([])
  const [newEmail, setNewEmail] = useState<string>('')
  const [newEmailError, setNewEmailError] = useState<string>('')

  function handleAddEmail() {
    if (!newEmail.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
      setNewEmailError(t('not valid email'))
      return
    }

    setInvites(p => [{email: newEmail, roles: ['VENDOR']}, ...p])
    setNewEmail('')
  }

  function removeEmail(email: string) {
    setInvites(p => p.filter(e => e.email !== email))
  }

  function onNewEmailKeyDown(key: string) {
    if (key === 'Enter') handleAddEmail()
  }

  function indexBasedStyling(index: number) {
    if (isSm) return index % 4 === 0 || index % 4 === 3
    return index % 2 === 0
  }

  async function onInviteSubmit() {
    // We have to make each api call by ourselves because backend does not support array

    const emailsNotFound: string[] = []
    const unsuccessfulEmails: string[] = []

    for (let invite of invites) {
      try {
        await api.post(`events/${event.id}/members/invite`, invite)
      } catch (e) {
        const error: AxiosError = e as AxiosError
        if (error.status === 404) emailsNotFound.push(invite.email)
        else unsuccessfulEmails.push(invite.email)
      }
    }

    setInvites(p => p.filter(e => [...emailsNotFound, ...unsuccessfulEmails].find(u => u === e.email)))
    if (emailsNotFound.length + unsuccessfulEmails.length > 0) setNewEmailError(`${emailsNotFound.length} ${t('emails not found')} and ${unsuccessfulEmails.length} ${t('invalid invites')}`)
  }

  function onChangeEmail(value: string) {
    setNewEmailError('')
    setNewEmail(value)
  }

  return (
    <Container maxWidth={'md'}>
      <Box display={'flex'} gap={1}>
        <TextField
          value={newEmail} onChange={e => onChangeEmail(e.currentTarget.value)}
          variant={'filled'} fullWidth label={t('add email')} type={'email'}
          onKeyDown={e => onNewEmailKeyDown(e.key)}
          error={!!newEmailError}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position={"end"}>
                  {newEmail.length > 0 && (
                    <IconButton onClick={() => setNewEmail('')}>
                      <CancelIcon/>
                    </IconButton>
                  )}

                  <IconButton onClick={handleAddEmail}>
                    <SendIcon/>
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        <Tooltip title={invites.length === 0 ? t('add at least one email') : t('send invites')}>
          <Button onClick={onInviteSubmit} variant={'contained'} disabled={invites.length === 0}>
            {t('send invites')}
          </Button>
        </Tooltip>
      </Box>

      <Typography variant={'subtitle2'} color={'error'}>
        {newEmailError || '\u00A0'}
      </Typography>

      <Grid container spacing={1} mt={1}>
        {invites.map((invite, index) => (
          <Grid key={invite.email} size={{xs: 12, sm: 6, md: 4}}>
            <Tooltip title={t('remove')}>
              <Button
                variant={indexBasedStyling(index) ? 'contained' : 'text'} fullWidth
                sx={{textTransform: 'none'}} size={'large'} color={'inherit'}
                onClick={() => removeEmail(invite.email)}
              >
                {invite.email}
              </Button>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default EventMemberInvite;