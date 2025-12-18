import {useState} from 'react';
import {Button, Container, Typography} from "@mui/material";
import {linkBridge} from "@webview-bridge/web";

const bridge = linkBridge({
  onReady: async (method) => {
    console.log(`bridge is ready: ${method.isWebViewBridgeAvailable}`)
  }
})

function NfcScan() {
  const [nfcData, setNfcData] = useState<object>({})

  function startNfcScan() {
    bridge.getNfc().then((tag: object | null) => {
      if (tag) setNfcData(tag)
      else console.log('No tag found: ', tag)
    })
  }

  return (
    <Container>
      <Button onClick={startNfcScan}>
        Start NFC Read
      </Button>
      <Typography>
        {JSON.stringify(nfcData)}
      </Typography>
    </Container>
  )
}

export default NfcScan;