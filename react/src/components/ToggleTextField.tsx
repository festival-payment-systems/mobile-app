import React, {type ChangeEvent, useEffect, useRef, useState} from 'react';
import {CircularProgress, IconButton, InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';


type Props = TextFieldProps & {
  onDone: (newValue: string) => Promise<void>,
  onCancel?: () => void,
}

function ToggleTextField({ onDone, onCancel, placeholder, value, onChange, ...rest }: Props) {

  const fieldRef = useRef<HTMLInputElement>(null)
  const [fieldValue, setFieldValue] = useState<string>(value ? value as string : '')
  const [editing, setEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onDoneClick() {
    if (!editing) {
      setEditing(true)
      return
    }

    setIsLoading(true)

    onDone(fieldValue).then(() => {
      setEditing(false)
      setIsLoading(false)
    })
  }

  function onCancelClick() {
    setEditing(false)
    setFieldValue('')
    onCancel?.()
  }

  function onFieldChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (onChange) onChange(e)
    else setFieldValue(e.currentTarget.value)
  }

  useEffect(() => {
    // If done at the top when editing is set, the element is still disabled and the focus request will fail.
    if (editing && fieldRef.current) fieldRef.current.focus()
  }, [editing]);

  return (
    <TextField
      {...rest}
      inputRef={fieldRef}
      value={editing ? fieldValue : placeholder}
      onChange={onFieldChange}
      disabled={!editing || isLoading}
      placeholder={placeholder}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position={"end"}>
              <IconButton onClick={onDoneClick} disabled={isLoading}>
                {isLoading ? <CircularProgress size={28} /> : (editing ? <DoneIcon/> : <EditIcon/>)}
              </IconButton>

              {editing && (
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