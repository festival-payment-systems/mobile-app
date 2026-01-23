import React from 'react';
import type {IEventInvitation} from "../../types/Event.ts";
import {
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import EventInvitationCard from "./EventInvitationCard.tsx";

interface Props {
  invitations: IEventInvitation[],
  open: boolean,
  onClose: () => void,
}

function EventInvitations({ invitations, open, onClose }: Props) {

  function handleClose() {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'} disableRestoreFocus>
      <DialogContent>
        <Grid container>
          {invitations.map((invitation) => <EventInvitationCard invitation={invitation}/>)}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default EventInvitations;