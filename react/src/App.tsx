import {Navigate, Route, Routes, useNavigate} from "react-router";
import Layout from "./components/Layout.tsx";
import AuthProtected from "./components/wrappers/AuthProtected.tsx";
import {lazy, useEffect} from "react";
import {setNavigateFn} from "./hooks/Navigation.ts";
import {useTranslation} from "react-i18next";
import NfcProtected from "./components/wrappers/NfcProtected.tsx";

const Login = lazy(() => import('./views/LoginScreen.tsx'))
const Register = lazy(() => import('./views/RegisterScreen.tsx'))
const EventsOverview = lazy(() => import('./views/EventsOverview.tsx'))
const EventOverview = lazy(() => import('./views/EventOverview.tsx'))

function App() {

  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setNavigateFn(navigate)
  }, [navigate]);

  useEffect(() => {
    i18n.changeLanguage('en')
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Layout/>}>
        <Route index element={<Navigate to={'/events'} />} />
        <Route path={'login'} element={<Login/>} />
        <Route path={'register'} element={<Register/>} />
        <Route path={'events'} element={<AuthProtected><EventsOverview/></AuthProtected>} />
        <Route path={'event/:eventId'} element={<AuthProtected><EventOverview/></AuthProtected>} />
        <Route path={'nfc-test'} element={<NfcProtected neededRole={'Customer'}><h2>Successful NFC read!</h2></NfcProtected>} />
        <Route path={'*'} element={<p>Page not found</p>} />
      </Route>
    </Routes>
  )
}

export default App
