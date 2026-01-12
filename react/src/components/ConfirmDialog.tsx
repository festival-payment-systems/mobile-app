import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, type DialogProps } from "@mui/material";
import React from 'react';
import {useTranslation} from "react-i18next";

type Props = DialogProps & {
  title: string,
  description?: string,
  onClose: () => void,
  onConfirm: () => void,
}

function ConfirmDialog({ title, description, onClose, onConfirm, ...rest }: Props) {

  const { t } = useTranslation()
  const uuid = crypto.randomUUID()

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby={uuid}
      {...rest}
    >
      <DialogTitle id={uuid}>
        {title}
      </DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText>
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} autoFocus>
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;