import { createContext } from "react";
import type { AuthContextType } from "./auth.types";

export const AuthContext = createContext<AuthContextType>({
  authState: {
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  },
  setAuthState: () => {},
  appLoading: true,
  setAppLoading: () => {},
});
