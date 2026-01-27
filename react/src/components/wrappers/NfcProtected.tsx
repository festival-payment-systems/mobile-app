import {type ReactNode, useEffect, useState} from "react";
import {type Bridge, type BridgeStore, linkBridge} from "@webview-bridge/web";
import {Box, Button, Typography} from "@mui/material";
import {MotionBox} from "../Motion.tsx";
import {setAppBarVisible} from "../../hooks/Navigation.ts";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import type {TagEvent} from "../../types/common.ts";
import type {AppSchema} from "../../../../Bridge.ts";
import {useAppState} from "../../hooks/AppState.ts";
import {useAuthState} from "../../hooks/AuthState.ts";
import {api} from "../../services/api.service.ts";

function NfcReadScreen({ label }: {label: string}) {

  const nav = useNavigate()
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          pb: 6,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.500', fontSize: '1.1rem' }}>
          {t('hold wristband to device')}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box/>
        {[0, 1, 2].map((i) => (
          <MotionBox
            key={i}
            initial={{ width: 40, height: 40, opacity: 0 }}
            animate={{
              width: [40, 40, 220],
              height: [40, 40, 220],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeOut",
              times: [0, 0.1, 1],
            }}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              border: '2px solid #2196f3',
            }}
          />
        ))}

        <MotionBox
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            position: 'relative',
            zIndex: 2,
            width: 64,
            height: 64,
            backgroundColor: '#2196f3',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(33, 150, 243, 0.5)',
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 4,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => nav(-1)}
          color={'inherit'}
          sx={{
            py: 2,
            fontWeight: 'bold',
            borderRadius: 3,
            maxWidth: 500,
          }}
        >
          {t('cancel')}
        </Button>
      </Box>
    </Box>
  )
}


interface Props {
  children: ReactNode,
  neededRole: 'Organizer' | 'Merchant' | 'Seller' | 'Cashier' | 'Customer',
  isRegister?: boolean,
}

interface BridgeState extends Bridge {
  getNfc: () => Promise<TagEvent | null>
}

const bridge = linkBridge<BridgeStore<BridgeState>, AppSchema>({
  throwOnError: true,
  onReady: async (method) => {
    useAppState.setState({isBridgeReady: method.isWebViewBridgeAvailable})
    if (method.isWebViewBridgeAvailable) {
      console.log(`bridge is ready`)
    } else {
      console.warn(`bridge is NOT ready`)
    }
  }
})

function NfcProtected({ children, neededRole, isRegister }: Props) {

  const App = useAppState()
  const Auth = useAuthState()
  const nav = useNavigate()
  const { t } = useTranslation()
  const [nfcData, setNfcData] = useState<object | null>(null)

  async function registerNfc() {
    if (!App.selectedEvent) {
      console.warn("No event selected while registerNfc")
      return false
    }

    if (!Auth.user) {
      console.warn("User not authed while registerNfc")
      return false
    }

    if (!nfcData) {
      console.warn("No Nfc data while registerNFc")
      return false
    }

    const response = await api.post(`events/${App.selectedEvent.id}/wristbands/register`, {
      "id": JSON.stringify(nfcData),
      //"actorId": Auth.user.id, // Not needed for guests
    })

    if (response.status == 200) {
      return true
    }

    console.warn('Wristband register NOT successful.')
    return false
  }

  useEffect(() => {
    setAppBarVisible(!!nfcData)
    if (!nfcData) {
      // This does not always return the tag, that's why we use the event listener
      bridge.getNfc().then((tag) => console.log('Nfc reading done ', tag))
    } else {
      registerNfc().then(success => success && nav('/members/invite/wristband'))
    }

    return () => {
      setAppBarVisible(true)
    }
  }, [nfcData]);

  useEffect(() => {
    bridge.addEventListener('nfcReadResponse', (v) => {
      const data = v as any
      setNfcData(data)
    })
  }, []);

  if (!App.isBridgeReady) {
    nav(-1)
    return <h3>No NFC connection found.</h3>
  }

  if (!nfcData || isRegister) return (
    <NfcReadScreen
      label={isRegister ? t('register wristband for') + ' ' + t(neededRole.toLowerCase()) : t(neededRole.toLowerCase())}
    />
  )

  return children
}

export default NfcProtected;