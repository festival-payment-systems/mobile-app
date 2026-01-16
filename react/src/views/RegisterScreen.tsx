import {useAuthState} from "../hooks/AuthState.ts";
import {Box, Button, Card, CardContent, CircularProgress, Link, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useWindowSize} from "../hooks/Window.ts";
import { useTranslation } from "react-i18next";
import * as React from "react";


function RegisterScreen() {

  const Auth = useAuthState()
  const nav = useNavigate()
  const { width } = useWindowSize()
  const { t } = useTranslation()

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRegister = async () => {
    if (isLoading) return
    setIsLoading(true)
    const errorMsg = await Auth.register(email, password, firstName, lastName)
    setIsLoading(false)
    if (errorMsg) setError(errorMsg)
    else nav('/login')
  }

  useEffect(() => {
    setError('')
  }, [firstName, lastName, email, password, confirmPassword]);

  return (
    <Box
      sx={{
        display: "flex",
        width: '100vw',
        height: '100vh',
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card elevation={6} sx={{borderRadius: width <= 512 ? 0 : 4, maxWidth: 512, width: '100vw'}}>
        <CardContent sx={{display: "flex", flexDirection: "column", gap: 3}} component={'form'}>
          <Typography variant="h5" align="center" fontWeight={600}>
            {t('create an account')}
          </Typography>

          <TextField
            label={t('first name')} type="text" fullWidth variant="outlined" error={!!error} autoComplete={'first-name'}
            value={firstName} onChange={e => setFirstName(e.currentTarget.value)}
          />

          <TextField
            label={t('last name')} type="text" fullWidth variant="outlined" error={!!error} autoComplete={'last-name'}
            value={lastName} onChange={e => setLastName(e.currentTarget.value)}
          />

          <TextField
            label={t('email')} type="email" fullWidth variant="outlined" error={!!error} autoComplete={'email'}
            value={email} onChange={e => setEmail(e.currentTarget.value)}
          />

          <TextField
            label={t('password')} type="password" fullWidth variant="outlined" error={!!error} autoComplete={'new-password'}
            value={password} onChange={e => setPassword(e.currentTarget.value)}
          />

          <TextField
            label={t('confirm password')} type="password" fullWidth variant="outlined" error={!!error} autoComplete={'new-password'}
            value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)}
          />

          <Typography variant={'subtitle2'} component={'p'} color={'error'} textAlign={'center'}>
            {error}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{borderRadius: 2}}
            onClick={handleRegister}
          >
            {t('sign up')}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            <Link onClick={() => nav('/login')} sx={{cursor: 'pointer'}}>
              {isLoading ? <CircularProgress sx={{color: '#000'}} size={26}/> : t('already have an account')}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterScreen;