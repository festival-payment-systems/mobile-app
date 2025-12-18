import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import {
  bridge,
  createWebView,
  postMessageSchema,
} from '@webview-bridge/react-native';
import * as v from 'valibot';
import {useEffect} from "react";
import AppConfig from "./config.ts";

NfcManager.start().then(() => console.log('NfcManager started'));

export const appBridge = bridge({
  async getNfc() {
    try {

      const enabled = await NfcManager.isEnabled()
      if (!enabled) {
        // NFC is probably not enabled on the phone!
        console.warn('Nfc is not enabled!')
        await NfcManager.goToNfcSetting()
        return null
      }

      const isSupported = await NfcManager.isSupported()
      if (!isSupported) {
        console.warn('NfcManager not supported!')
        return null
      }

      await NfcManager.cancelTechnologyRequest()
      console.log('start reading...')
      await NfcManager.requestTechnology(NfcTech.Ndef)
      console.log('getting tag...')
      const tag = await NfcManager.getTag()
      console.info('Tag found!', tag)
      postMessage('nfcReadResponse', {tag: JSON.stringify(tag), error: undefined})
      return tag
    } catch (e) {
      console.warn('Oops!', e)
    } finally {
      await NfcManager.cancelTechnologyRequest()
    }
    return null
  }
})

export const appSchema = postMessageSchema({
  nfcReadResponse: {
    validate: (value) => {
      return v.parse(v.object({ error: v.undefinedable(v.string()), tag: v.undefinedable(v.string()) }), value)
    }
  }
})

const {WebView, postMessage} = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true
})

function App() {

  const Window = useWindowDimensions()

  useEffect(() => {
    StatusBar.setBackgroundColor('#000')
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        style={[styles.webview, {width: Window.width}]}
        source={{uri: AppConfig.webview_url}}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    minWidth: 320,
    backgroundColor: '#00000022'
  },
});

export default App;
