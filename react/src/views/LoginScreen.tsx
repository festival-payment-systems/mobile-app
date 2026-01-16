import {useAuthState} from "../hooks/AuthState.ts";
import {Box, Button, Card, CardContent, CircularProgress, Link, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import * as React from "react";
import {useWindowSize} from "../hooks/Window.ts";
import { useTranslation } from "react-i18next";


function LoginScreen() {

  const Auth = useAuthState()
  const nav = useNavigate()
  const { width } = useWindowSize()
  const { t } = useTranslation()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    if (isLoading) return
    setIsLoading(true)
    const errorMsg = await Auth.login(email, password)
    if (errorMsg) {
      setError(errorMsg)
      setIsLoading(false)
      return
    }

    await Auth.refreshUserProfile()
    setIsLoading(false)
    nav('/')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleLogin().then()
  }

  useEffect(() => {
    setError('')
  }, [email, password]);

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
            {t('login')}
          </Typography>

          <TextField
            label={t('email')} type="email" fullWidth variant="outlined" error={error.length > 0} onKeyDown={handleKeyDown}
            value={email} onChange={e => setEmail(e.currentTarget.value)}
            autoComplete={'email'}
          />

          <TextField
            label={t('password')} type="password" fullWidth variant="outlined" error={error.length > 0}
            onKeyDown={handleKeyDown} autoComplete={'current-password'}
            value={password} onChange={e => setPassword(e.currentTarget.value)}
          />

          <Typography variant={'subtitle2'} component={'p'} color={'error'} textAlign={'center'}>
            {error}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{borderRadius: 2}}
            onClick={handleLogin}
          >
            {isLoading ? <CircularProgress sx={{color: '#000'}} size={26}/> : t('sign in')}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            <Link onClick={() => nav('/register')} sx={{cursor: 'pointer'}}>
              {t('create an account')}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginScreen;