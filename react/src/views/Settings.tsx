import React, {useState} from 'react';
import {useAppState} from "../hooks/AppState.ts";
import {useAuthState} from "../hooks/AuthState.ts";
import {Button, Container, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import type {UpdateUser} from "../types/User.ts";
import { useTranslation } from "react-i18next";
import ToggleTextField from "../components/ToggleTextField.tsx";
import { Navigate } from "react-router";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import {useWindowSize} from "../hooks/Window.ts";


const languages = [
  { len: 'en', name: 'English' },
  { len: 'de', name: 'Deutsch' },
]


function Settings() {

  const App = useAppState()
  const Window = useWindowSize()
  const { user, logout, updateUserProfile } = useAuthState()
  const { t } = useTranslation()

  const [newPassword, setNewPassword] = useState<string>('')
  const [passwordDialog, setPasswordDialog] = useState<boolean>(false)
  const [logoutDialog, setLogoutDialog] = useState<boolean>(false)

  async function onUserDone(field: keyof UpdateUser, value: string) {
    await updateUserProfile({[field]: value})
  }

  async function onNewPasswordDone() {
    await new Promise(r => setTimeout(r, 1000))
    // Todo: send to backend (not implemented)
    setNewPassword('')
    setPasswordDialog(false)
  }

  function onClosePasswordDialog() {
    setPasswordDialog(false)
    setNewPassword('')
  }

  // Won't happen anyway because of using AuthProtected
  if (!user) return <Navigate to={"login"} />

  return (
    <Container maxWidth={'md'} sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2, justifyContent: 'space-between', height: Window.height - 96 }}>
      <Grid container spacing={{ xs: 4, md: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ToggleTextField
            label={t('first name')}
            variant={'outlined'}
            fullWidth
            onDone={val => onUserDone('firstName', val)}
            placeholder={user!.firstName}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ToggleTextField
            label={t('last name')}
            variant={'outlined'}
            fullWidth
            onDone={val => onUserDone('lastName', val)}
            placeholder={user!.lastName}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ToggleTextField
            label={t('email')}
            variant={'outlined'}
            fullWidth
            onDone={val => onUserDone('email', val)}
            placeholder={user!.email}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ToggleTextField
            label={t('new password')}
            value={newPassword}
            onChange={e => setNewPassword(e.currentTarget.value)}
            variant={'outlined'}
            fullWidth
            onDone={async () => setPasswordDialog(true)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id={"language-select-label"}>{t('language')}</InputLabel>
            <Select
              labelId={"language-select-label"}
              label={t('language')}
              value={App.language}
              onChange={e => App.changeLanguage(e.target.value)}
              variant={'outlined'}
            >
              {languages.map(l => <MenuItem value={l.len}>{l.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id={"theme-select-label"}>{t('theme')}</InputLabel>
            <Select
              labelId={"theme-select-label"}
              label={t('theme')}
              value={App.theme}
              onChange={e => App.changeTheme(e.target.value)}
              variant={'outlined'}
            >
              <MenuItem value={'dark'}>{t('dark')}</MenuItem>
              <MenuItem value={'light'}>{t('light')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

      </Grid>

      <Button
        fullWidth
        variant={'contained'}
        color={'error'}
        onClick={() => setLogoutDialog(true)}
      >
        {t('logout')}
      </Button>

      <ConfirmDialog
        open={passwordDialog}
        onClose={onClosePasswordDialog}
        onConfirm={onNewPasswordDone}
        title={t('logout confirm msg')}
        description={t('this action will logout all of your devices')}
      />

      <ConfirmDialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        onConfirm={logout}
        title={t('logout confirm msg')}
      />

    </Container>
  );
}

export default Settings;