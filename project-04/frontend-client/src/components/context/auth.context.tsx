import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { AuthState } from "./auth.types";

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  });
  const [appLoading, setAppLoading] = useState<boolean>(true);

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, appLoading, setAppLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
