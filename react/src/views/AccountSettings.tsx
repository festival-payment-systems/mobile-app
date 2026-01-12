import React from 'react';
import {useAppState} from "../hooks/AppState.ts";
import {useAuthState} from "../hooks/AuthState.ts";

function AccountSettings() {

  const App = useAppState()
  const { user } = useAuthState()

  return (
    <div></div>
  );
}

export default AccountSettings;