import {type ChangeEvent, type SetStateAction, useEffect, useState} from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import * as React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {IEventCreation} from "../../types/Event.ts";
import {api} from "../../services/api.service.ts";
import {dateToString} from "../../utils/DateTimeUtils.ts";
import {useTranslation} from "react-i18next";


interface Props {
  open: boolean
  onClose: () => void,
}

function EventCreation({open, onClose}: Props) {

  const QueryClient = useQueryClient()
  const { t } = useTranslation()

  const [title, setTitle] = useState<string>('')
  const [startDate, setStartDate] = useState<number>(Date.now())
  const [endDate, setEndDate] = useState<number>(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const [error, setError] = useState<string>('')
  const [errorType, setErrorType] = useState<'title' | 'startDate' | 'endDate'>()

  const EventCreationMutation = useMutation({
    mutationFn: (newEvent: IEventCreation) => api.post('events', newEvent),
    onError: (e) => setError(e.name),
    onSuccess: () => {
      QueryClient.refetchQueries({queryKey: ['events']})
      handleClose()
    },
  })

  function handleSubmit() {
    if (title.trim().length < 3) {
      setError('Event Name length must be at least 3')
      setErrorType('title')
      return
    }

    EventCreationMutation.mutate({ name: title, startingAt: dateToString(new Date(startDate)), endingAt: dateToString(new Date(endDate)) })
  }

  function handleClose() {
    setTitle('')
    setStartDate(Date.now())
    setEndDate(Date.now() + 7 * 24 * 60 * 60 * 1000)
    setError('')
    onClose()
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, set: React.Dispatch<SetStateAction<number>>) {
    const newDate = new Date()
    const array = event.currentTarget.value.split('-')
    newDate.setFullYear(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2]))
    set(newDate.valueOf())
  }

  useEffect(() => {
    setError('')
    setErrorType(undefined)

    if (startDate > endDate) {
      setError('Ending At must not be before the Starting Date')
      setErrorType('endDate')
    }

  }, [title, startDate, endDate]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'} disableRestoreFocus>
      <DialogTitle>{t('create event')}</DialogTitle>

      <DialogContent>
        <TextField
          label={t('event name')} fullWidth autoFocus disabled={EventCreationMutation.isPending}
          margin='normal' value={title} error={errorType === 'title'}
          onChange={e => setTitle(e.currentTarget.value)}
        />

        <Box display={'flex'} justifyContent={'space-between'} gap={2}>
          <TextField
            type={'date'} disabled={EventCreationMutation.isPending} value={dateToString(new Date(startDate))}
            onChange={e => handleDateChange(e, setStartDate)}
            label={t('starting at')} margin='normal' fullWidth error={errorType === 'startDate'}
          />

          <TextField
            type={'date'} disabled={EventCreationMutation.isPending} value={dateToString(new Date(endDate))}
            onChange={e => handleDateChange(e, setEndDate)}
            label={t('ending at')} margin='normal' fullWidth error={errorType === 'endDate'}
          />
        </Box>
      </DialogContent>

      <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', marginBottom: 1}}>
        {!!error && (
          <>
            <ErrorOutlineIcon color="error" fontSize="small"/>
            <Typography color="error" variant="caption" fontSize={14}>
              {error}
            </Typography>
          </>
        )}
      </Box>

      <DialogActions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button type='submit' variant='contained' onClick={handleSubmit}>
          {EventCreationMutation.isPending ? <CircularProgress/> : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventCreation;