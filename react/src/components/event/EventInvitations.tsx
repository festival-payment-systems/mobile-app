import React from 'react';
import type {IEventInvitation} from "../../types/Event.ts";
import {
  Dialog,
  DialogContent, DialogTitle,
  Grid,
} from "@mui/material";
import EventInvitationCard from "./EventInvitationCard.tsx";
import {useTranslation} from "react-i18next";

interface Props {
  invitations: IEventInvitation[],
  open: boolean,
  onClose: () => void,
}

function EventInvitations({ invitations, open, onClose }: Props) {

  const { t } = useTranslation()

  function handleClose() {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'} disableRestoreFocus>
      <DialogTitle textAlign={'center'} variant={'h5'}>
        {t('event invitations')}
      </DialogTitle>
      <DialogContent>
        <Grid container>
          {invitations.map((invitation) => (
            <Grid size={12}>
              <EventInvitationCard invitation={invitation}/>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default EventInvitations;