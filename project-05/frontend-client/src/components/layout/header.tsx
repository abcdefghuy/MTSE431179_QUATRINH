import React, { useContext, useState } from "react";
import {
  HomeOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  ShoppingOutlined,
  CrownOutlined,
  BellOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Badge,
  Button,
} from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useSearchContext } from "../context/search.context";
import { useFavoritesContext } from "../context/favorites.context";
import SearchBarWithFilters from "../products/SearchBarWithFilters";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const { categories, filters, updateFilters, searchProducts } =
    useSearchContext();
  const { favoritesCount } = useFavoritesContext();

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

  const handleHeaderSearch = () => {
    // Navigate to products page and perform search
    navigate("/products");
    setCurrent("products");
    searchProducts();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "account",
      icon: <UserOutlined />,
      label: <Link to="/account">Tài khoản của tôi</Link>,
    },
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
    {
      label: <Link to={"/products"}>Sản phẩm</Link>,
      key: "products",
      icon: <ShoppingOutlined />,
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
    <AntHeader className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CrownOutlined className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <Text className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                JWT App
              </Text>
              <Text className="text-xs text-gray-500 -mt-1">Premium Store</Text>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <SearchBarWithFilters
            categories={categories}
            filters={filters}
            onFiltersChange={updateFilters}
            onSearch={handleHeaderSearch}
            loading={false}
            placeholder="Tìm kiếm sản phẩm..."
            className="header-search"
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center space-x-1">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={navigationItems}
            className="border-0 bg-transparent min-w-0"
            style={{ lineHeight: "64px" }}
          />
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {/* Favorites - Only show for authenticated users */}
          {authState.isAuthenticated && (
            <Badge
              count={favoritesCount}
              size="small"
              className="cursor-pointer"
            >
              <Button
                type="text"
                shape="circle"
                icon={<HeartOutlined />}
                onClick={() => {
                  navigate("/account?tab=favorites");
                  setCurrent("account");
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                title="Sản phẩm yêu thích"
              />
            </Badge>
          )}

          {/* Notifications */}
          {authState.isAuthenticated && (
            <Badge count={3} size="small" className="cursor-pointer">
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined />}
                className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all duration-300"
              />
            </Badge>
          )}

          {/* User Dropdown */}
          {authState.isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-amber-50 cursor-pointer transition-all duration-300 group">
                <Avatar
                  size={36}
                  className="bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  icon={<UserOutlined />}
                />
                <div className="flex flex-col">
                  <Text className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    {authState.user.name || authState.user.email}
                  </Text>
                  <Text className="text-xs text-gray-500">Đã đăng nhập</Text>
                </div>
              </div>
            </Dropdown>
          ) : (
            <Dropdown
              menu={{ items: guestMenuItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-amber-50 cursor-pointer transition-all duration-300 group">
                <Avatar
                  size={36}
                  className="bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  icon={<UserOutlined />}
                />
                <div className="flex flex-col">
                  <Text className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    Khách
                  </Text>
                  <Text className="text-xs text-gray-500">Chưa đăng nhập</Text>
                </div>
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <style>{`
        .header-search {
          max-width: 100%;
          height: 40px;
        }
        
        .header-search .search-bar-container {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          height: 40px;
        }

        .ant-menu-horizontal {
          border-bottom: none !important;
        }

        .ant-menu-horizontal .ant-menu-item {
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
        }

        .ant-menu-horizontal .ant-menu-item:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #d97706;
        }

        .ant-menu-horizontal .ant-menu-item-selected {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .ant-menu-horizontal .ant-menu-item-selected::after {
          display: none;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;
