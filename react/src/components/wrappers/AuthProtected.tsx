import type {ReactNode} from "react";
import {useAuthState} from "../../hooks/AuthState.ts";
import {Navigate} from "react-router";


interface Props {
  children: ReactNode,
  neededRole?: 'Organizer' | 'Merchant' | 'Seller' | 'Cashier' | 'Customer',
}

function AuthProtected({ children, neededRole }: Props) {

  const { user } = useAuthState()

  if (!user) {
    return <Navigate to={'/login'}/>
  }

  // Todo check for role

  return children
}

export default AuthProtected;