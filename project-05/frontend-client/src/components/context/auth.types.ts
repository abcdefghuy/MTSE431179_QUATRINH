import type { Dispatch, SetStateAction } from "react";

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

export interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
  appLoading: boolean;
  setAppLoading: Dispatch<SetStateAction<boolean>>;
}
