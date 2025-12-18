import type {ReactNode} from "react";
import {useAuthState} from "../../hooks/AuthState.ts";
import {Navigate} from "react-router";


interface Props {
  children: ReactNode,
  neededRole?: 'Organizer' | 'Merchant' | 'Seller' | 'Cashier' | 'Customer',
}

function AuthProtected({ children, neededRole }: Props) {

  const Auth = useAuthState()

  // Todo check for role
  if (neededRole && Auth.user) {
    return <Navigate to={'/'}/>
  }

  return children
}

export default AuthProtected;