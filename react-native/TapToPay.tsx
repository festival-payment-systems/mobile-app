import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native'; // ✅ removed Reader

const EVENT_ID = '11111111-1111-1111-1111-111111111111';
const WALLET_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const EXECUTOR_USER_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const API_URL = 'http://localhostR:8080';

export default function TapToPayScreen() {
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);

  const {
    initialize,
    discoverReaders,
    discoveredReaders,
    connectReader,
    retrievePaymentIntent,
    collectPaymentMethod,
    confirmPaymentIntent,
    connectedReader,
  } = useStripeTerminal({
    onUpdateDiscoveredReaders: (readers) => {
      console.log('Discovered readers:', readers);
    },
    onDidChangeConnectionStatus: (status) => {
      console.log('Connection status:', status);
    },
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const createPaymentIntent = async () => {
    const response = await fetch(
      `${API_URL}/stripe/events/${EVENT_ID}/payment-intents`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: WALLET_ID,
          executorUserId: EXECUTOR_USER_ID,
          amount: 2000,
        }),
      }
    );
    const data = await response.json();
    setPaymentClientSecret(data.clientSecret);
  };

  const startDiscovery = async () => {
    const { error } = await discoverReaders({
      discoveryMethod: 'tapToPay',
      simulated: true,
    });
    if (error) Alert.alert('Discover error', error.message);
  };

  const connectFirstReader = async () => {
    const reader = discoveredReaders?.[0];
    if (!reader) {
      Alert.alert('Kein Reader', 'Es wurde kein Reader gefunden.');
      return;
    }

    const { error } = await connectReader({
      reader,
      discoveryMethod: 'tapToPay' as any,
    });

    if (error) Alert.alert('Connect error', error.message);
  };

  const collectAndProcess = async () => {
    if (!paymentClientSecret) {
      Alert.alert('Fehlt', 'Erstelle zuerst einen PaymentIntent.');
      return;
    }

    const { error: retrieveError, paymentIntent: retrieved } = await retrievePaymentIntent(paymentClientSecret);

    if (retrieveError) {
      Alert.alert('Retrieve error', retrieveError.message);
      return;
    }

    const { error: collectError, paymentIntent: collected } = await collectPaymentMethod({
      paymentIntent: retrieved!,
    });

    if (collectError) {
      Alert.alert('Collect error', collectError.message);
      return;
    }

    const { error: confirmError } = await confirmPaymentIntent({
      paymentIntent: collected!,
    });

    if (confirmError) {
      Alert.alert('Confirm error', confirmError.message);
      return;
    }

    Alert.alert('Erfolg', 'Payment verarbeitet. Top-up kommt per Webhook.');
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Connected reader: {connectedReader?.label ?? 'none'}</Text>
      <Text>Discovered readers: {discoveredReaders?.length ?? 0}</Text>
      <Button title="1. Create PaymentIntent" onPress={createPaymentIntent} />
      <Button title="2. Discover Tap to Pay Readers" onPress={startDiscovery} />
      <Button title="3. Connect First Reader" onPress={connectFirstReader} />
      <Button title="4. Collect + Process Payment" onPress={collectAndProcess} />
    </View>
  );
}
