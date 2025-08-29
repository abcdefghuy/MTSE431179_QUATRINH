import React, { useContext, useState } from "react";
import {
  HomeOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Avatar, Dropdown, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);

  const [current, setCurrent] = useState<string>("home");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setCurrent("home");
    setAuthState({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    navigate("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Text>Thông tin cá nhân</Text>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Đăng xuất</span>,
      danger: true,
    },
  ];

  const guestMenuItems: MenuProps["items"] = [
    {
      key: "login",
      icon: <LoginOutlined />,
      label: <Link to="/login">Đăng nhập</Link>,
    },
  ];

  const navigationItems: MenuProps["items"] = [
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    ...(authState.isAuthenticated
      ? [
          {
            label: <Link to={"/user"}>Người dùng</Link>,
            key: "user",
            icon: <UsergroupAddOutlined />,
          },
        ]
      : []),
  ];

  return (
    <AntHeader className="modern-header">
      <div className="header-content">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <Text strong className="logo-text">
              JWT App
            </Text>
          </Link>
        </div>

        <div className="nav-section">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={navigationItems}
            className="main-nav"
          />
        </div>

        <div className="user-section">
          {authState.isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="user-dropdown">
                <Avatar icon={<UserOutlined />} />
                <Text className="user-email">
                  {authState.user.email || "User"}
                </Text>
              </Space>
            </Dropdown>
          ) : (
            <Dropdown
              menu={{ items: guestMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="guest-dropdown">
                <Avatar icon={<UserOutlined />} />
                <Text>Khách</Text>
              </Space>
            </Dropdown>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
