import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router";
import Layout from "./components/Layout.tsx";
import AuthProtected from "./components/wrappers/AuthProtected.tsx";
import {lazy, useEffect, useState} from "react";
import {setNavigateFn} from "./hooks/Navigation.ts";
import {useTranslation} from "react-i18next";
import NfcProtected from "./components/wrappers/NfcProtected.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useAppState} from "./hooks/AppState.ts";
import {useAuthState} from "./hooks/AuthState.ts";
import EventsOverview from "./views/EventsOverview.tsx";
import EventRoutes from "./routes/EventRoutes.tsx";


const Login = lazy(() => import('./views/LoginScreen.tsx'))
const Register = lazy(() => import('./views/RegisterScreen.tsx'))
const Settings = lazy(() => import('./views/Settings.tsx'))


function App() {

  const App = useAppState()
  const Auth = useAuthState()
  const navigate = useNavigate()
  const {i18n} = useTranslation()
  const Loc = useLocation()

  const [theme, setTheme] = useState(createTheme({
    palette: {
      mode: App.theme,
    }
  }))

  useEffect(() => {
    setNavigateFn(navigate)
  }, [navigate]);

  useEffect(() => {
    i18n.changeLanguage(App.language).then()
  }, [App.language]);

  useEffect(() => {
    setTheme(createTheme({
      palette: {
        mode: App.theme,
      }
    }))
  }, [App.theme]);

  useEffect(() => {
    if (App.selectedEvent && !Loc.pathname.includes(App.selectedEvent.id)) {
      console.debug("Selected Event is not matching to path anymore. -> Set to null")
      App.setSelectedEvent(null)
    }
  }, [Loc.pathname]);

  useEffect(() => {
    const loadedTheme = localStorage.getItem('theme')
    if (loadedTheme && (loadedTheme == 'dark' || loadedTheme == 'light')) App.changeTheme(loadedTheme)

    const loadedLanguage = localStorage.getItem('language')
    if (loadedLanguage && (loadedLanguage == 'en' || loadedLanguage == 'de')) App.changeLanguage(loadedLanguage)

    Auth.refreshUserProfile().then(() => console.debug('User profile refreshed.'))
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Routes>
        <Route path={'/'} element={<Layout/>}>
          <Route index element={<Navigate to={'/events'}/>}/>
          <Route path={'login'} element={<Login/>}/>
          <Route path={'register'} element={<Register/>}/>
          <Route path={'settings'} element={<AuthProtected><Settings/></AuthProtected>}/>
          <Route path={'events'} element={<AuthProtected><EventsOverview/></AuthProtected>}/>
          <Route path={'event/:eventId/*'} element={<AuthProtected><EventRoutes/></AuthProtected>}/>
          <Route path={'nfc-test'}
                 element={<NfcProtected neededRole={'GUEST'}><h2>Successful NFC read!</h2></NfcProtected>}/>
          <Route path={'*'} element={<p>Page not found</p>}/>
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
