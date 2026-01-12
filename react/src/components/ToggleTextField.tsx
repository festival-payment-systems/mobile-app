import React, { useState } from 'react';
import {CircularProgress, IconButton, InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from '@mui/icons-material/Done';


type Props = TextFieldProps & {
  onDone: () => Promise<void>,
}

function ToggleTextField({ onDone, ...rest }: Props) {

  const [editing, setEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onClick() {
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

  return (
    <TextField
      {...rest}
      disabled={!editing || isLoading}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position={"end"}>
              <IconButton onClick={onClick} disabled={isLoading}>
                {isLoading ? <CircularProgress size={28} /> : (editing ? <DoneIcon/> : <EditIcon/>)}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  );
}

export default ToggleTextField;