import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter} from "react-router";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {I18nextProvider} from "react-i18next";
import i18n from './i18n.ts'


const theme = createTheme({
  palette: {
    mode: 'dark',
  }
})

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <CssBaseline/>
          <App/>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ThemeProvider>,
)
