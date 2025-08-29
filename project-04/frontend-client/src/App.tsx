import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

interface UserResponse {
  email?: string;
  name?: string;
  message?: string;
}

const App: React.FC = () => {
  const { setAuthState, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
      setAppLoading(true);
      const res = await axios.get("/v1/api/account");
      const userData = res as unknown as UserResponse;
      if (userData && !userData.message) {
        setAuthState({
          isAuthenticated: true,
          user: {
            email: userData.email || "",
            name: userData.name || "",
          },
        });
      }
      setAppLoading(false);
    };

    fetchAccount();
  }, [setAuthState, setAppLoading]);

  return (
    <div className="app-container">
      {appLoading === true ? (
        <div className="loading-container">
          <div className="loading-content">
            <Spin size="large" />
            <div className="loading-text">Đang tải ứng dụng...</div>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="main-content">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
