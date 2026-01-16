import React, { useState } from 'react';
import {CircularProgress, IconButton, InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';


type Props = TextFieldProps & {
  onDone: () => Promise<void>,
  onCancel?: () => void,
}

function ToggleTextField({ onDone, onCancel, ...rest }: Props) {

  const [editing, setEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onDoneClick() {
    if (!editing) {
      setEditing(true)
      return
    }

    setIsLoading(true)
    onDone().then(() => {
      setEditing(false)
      setIsLoading(false)
    })
  }

  function onCancelClick() {
    setEditing(false)
    onCancel?.()
  }

  return (
    <TextField
      {...rest}
      disabled={!editing || isLoading}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position={"end"}>
              <IconButton onClick={onDoneClick} disabled={isLoading}>
                {isLoading ? <CircularProgress size={28} /> : (editing ? <DoneIcon/> : <EditIcon/>)}
              </IconButton>

              {editing && onCancel && (
                <IconButton onClick={onCancelClick} disabled={isLoading}>
                  <CancelIcon/>
                </IconButton>
              )}
            </InputAdornment>
          )
        }
      }}
    />
  );
}

export default ToggleTextField;