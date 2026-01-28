import {Box, Button, CircularProgress, Container} from "@mui/material";
import {type To, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useAppState} from "../../hooks/AppState.ts";
import {useWindowSize} from "../../hooks/Window.ts";
import {useAuthState} from "../../hooks/AuthState.ts";
import {useState} from "react";

interface Nav {
  title: string,
  path: To,
}

const organizerNavs: Nav[] = [
  { title: 'transactions', path: '/transactions' },
  { title: 'members', path: '/members' },
  { title: 'shops', path: '/shops' },
  { title: 'cash register', path: '/cash-register' },
]

function NavButton({ title, path }: Nav) {

  const App = useAppState()
  const nav = useNavigate()

  function handleClick() {
    if (App.selectedEvent) {
      nav(`/event/${App.selectedEvent.id}${path}`)
    } else {
      nav('/events')
    }
  }

  return (
    <Button
      variant={'outlined'} fullWidth
      onClick={handleClick}
    >
      {title}
    </Button>
  )
}

function EventNavigation() {

  const Auth = useAuthState()
  const nav = useNavigate()
  const Window = useWindowSize()
  const { t } = useTranslation()

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false)

  function onLogout() {
    setLogoutLoading(true)
    Auth.logout().then(() => setLogoutLoading(false))
  }

  return (
    <Container maxWidth={'md'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: Window.height - 128 }}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {organizerNavs.map(n => <NavButton key={n.title} title={t(n.title)} path={n.path}/>)}
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Button
          variant={'contained'} fullWidth
          onClick={() => nav('/settings')}
        >
          {t('settings')}
        </Button>
        <Button
          variant={'contained'} fullWidth color={'error'}
          onClick={onLogout} disabled={logoutLoading}
        >
          {logoutLoading ? <CircularProgress size={24} /> : t('logout')}
        </Button>
      </Box>
    </Container>
  );
}

export default EventNavigation;