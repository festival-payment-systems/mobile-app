import {Outlet, useLocation, useNavigate} from "react-router";
import {Suspense, useEffect, useState} from "react";
import {AppBar, Toolbar, Button, Typography, Box, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";
import {setAppBarVisibleFn, setRouteTitleFn} from "../hooks/Navigation.ts";
import MenuIcon from '@mui/icons-material/Menu';
import {useAppState} from "../hooks/AppState.ts";
import {config} from "../config.ts";

const noNav: string[] = ['login', 'register']
const pathsUsingAccount: string[] = ['events']

function Layout() {

  const nav = useNavigate()
  const {pathname} = useLocation()
  const {t} = useTranslation()
  const App = useAppState()

  const [routeTitle, setRouteTitle] = useState('???')
  const [showNavbar, setShowNavbar] = useState(false)
  const [useSettings, setUseSettings] = useState(true)
  const [appBarVisible, setAppBarVisible] = useState(true)

  function handleNavButton() {
    if (useSettings) {
      nav('settings')
      return
    }

    nav(-1)
    App.setSelectedEvent(null)
  }

  useEffect(() => {

    const paths = pathname.split('/').filter(p => p.length > 0)

    let newShowNavbar = true
    for (let path of noNav) {
      if (paths.includes(path)) {
        newShowNavbar = false
        break
      }
    }
    setShowNavbar(newShowNavbar)

    let newUseSettings = false
    for (let path of pathsUsingAccount) {
      if (paths.includes(path)) {
        newUseSettings = true
        break
      }
    }
    setUseSettings(newUseSettings)

    // Prevents the id of an event being used -> reduces warnings from i18next because ids are not translated
    if (paths[0] === 'event' && paths.length < 3) {
      setRouteTitle('dashboard')
      return
    }

    const title = paths.length > 0 ? paths[paths.length - 1] : 'Unknown'
    setRouteTitle(title.substring(0, 1).toUpperCase() + title.substring(1, title.length).toLowerCase())

  }, [pathname]);

  useEffect(() => {
    setRouteTitleFn(setRouteTitle)
    setAppBarVisibleFn(setAppBarVisible)
  }, []);

  return (
    <>
      {showNavbar && appBarVisible && (
        <AppBar position={'sticky'} sx={{mb: 2, width: '100vw', height: 64}}>
          <Toolbar sx={{justifyContent: 'space-between', p: 2}}>
            <Button variant={'contained'} color={'inherit'} onClick={handleNavButton}>
              {useSettings ? t('settings') : t('back')}
            </Button>

            <Tooltip title={t('menu')}>
              {App.selectedEvent ? (
                <Box display={'flex'} alignItems={'center'} gap={1} sx={{cursor: 'pointer'}}
                     onClick={() => console.log('Menu clicked')}>
                  <Box textAlign={'right'}>
                    <Typography component={'h1'} fontSize={'large'}>
                      {t(routeTitle.toLowerCase())}
                    </Typography>
                    <Typography fontSize={'small'} color={'textDisabled'}>
                      {App.selectedEvent.name}
                    </Typography>
                  </Box>
                  <MenuIcon fontSize={'large'}/>
                </Box>
              ) : (
                <Typography variant={'h6'} component={'h1'}>{config.projectName}</Typography>
              )}
            </Tooltip>
          </Toolbar>
        </AppBar>
      )}
      <Suspense fallback={<h2>{t('loading')}</h2>}>
        <Outlet/>
      </Suspense>
    </>
  );
}

export default Layout;