import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Typography,
  Card,
  Tabs,
  Row,
  Col,
  Button,
  Rate,
  message,
  Empty,
  Badge,
  Avatar,
  Tag,
  Tooltip,
  Spin,
} from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  DeleteOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../components/context/auth.context";
import { useFavoritesContext } from "../components/context/favorites.context";
import {
  getUserPurchasesAPI,
  getUserViewHistoryAPI,
  removeFromFavoritesAPI,
} from "../util/api.ts";
import {
  handleApiError,
  type ApiErrorHandlerOptions,
} from "../util/errorHandler";
import type { Purchase, ViewHistory } from "../types/product.types";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const {
    favorites,
    loading: favoritesLoading,
    refreshFavorites,
    removeFromFavoritesLocal,
  } = useFavoritesContext();

  // Get active tab from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const defaultActiveKey = searchParams.get("tab") || "favorites";

  const handleApiErrorWithAuth = useCallback(
    (
      error: unknown,
      options: Omit<ApiErrorHandlerOptions, "onAuthError"> = {}
    ) => {
      return handleApiError(error, {
        ...options,
        onAuthError: () => navigate("/login"),
      });
    },
    [navigate]
  );
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [viewHistory, setViewHistory] = useState<ViewHistory[]>([]);
  const [loading, setLoading] = useState({
    purchases: false,
    viewHistory: false,
  });

  // Redirect if not authenticated - only run once on mount or auth change
  useEffect(() => {
    if (!authState.isAuthenticated) {
      message.error("Vui lòng đăng nhập để truy cập trang này");
      navigate("/login", { replace: true });
    }
  }, [authState.isAuthenticated, navigate]);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, purchases: true }));
      const response = await getUserPurchasesAPI();
      setPurchases(response.data);
    } catch (error) {
      handleApiErrorWithAuth(error, {
        authErrorMessage: "Vui lòng đăng nhập để xem lịch sử mua hàng",
        defaultErrorMessage: "Không thể tải lịch sử mua hàng",
      });
    } finally {
      setLoading((prev) => ({ ...prev, purchases: false }));
    }
  }, [handleApiErrorWithAuth]);

  const fetchViewHistory = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, viewHistory: true }));
      const response = await getUserViewHistoryAPI();
      setViewHistory(response.data);
    } catch (error) {
      handleApiErrorWithAuth(error, {
        authErrorMessage: "Vui lòng đăng nhập để xem lịch sử xem sản phẩm",
        defaultErrorMessage: "Không thể tải lịch sử xem sản phẩm",
      });
    } finally {
      setLoading((prev) => ({ ...prev, viewHistory: false }));
    }
  }, [handleApiErrorWithAuth]);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      refreshFavorites(),
      fetchPurchases(),
      fetchViewHistory(),
    ]);
  }, [refreshFavorites, fetchPurchases, fetchViewHistory]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchAllData();
    }
  }, [authState.isAuthenticated, fetchAllData]);

  // Early return if not authenticated to prevent rendering
  if (!authState.isAuthenticated) {
    return (
      <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Title level={3} className="text-gray-600">
            Đang chuyển hướng...
          </Title>
        </div>
      </Content>
    );
  }

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFromFavoritesAPI(productId);
      removeFromFavoritesLocal(productId);
      message.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      handleApiErrorWithAuth(error, {
        authErrorMessage: "Vui lòng đăng nhập để sử dụng tính năng yêu thích",
        defaultErrorMessage: "Có lỗi xảy ra khi xóa khỏi danh sách yêu thích",
      });
      // Refresh on error to sync state
      refreshFavorites();
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "processing";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined />;
      case "pending":
        return <ClockCircleOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      default:
        return <ShopOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã hoàn thành";
      case "pending":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-rose-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 shadow-xl"
            />
          </div>
          <Title
            level={1}
            className="!text-4xl !font-black !text-gray-800 !mb-4"
          >
            Tài khoản của tôi
          </Title>
          <Text className="text-xl text-gray-600">
            Chào mừng,{" "}
            <span className="font-semibold">
              {authState.user.name || authState.user.email}
            </span>
            !
          </Text>
        </div>

        {/* Tabs Content */}
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          <Tabs
            defaultActiveKey={defaultActiveKey}
            size="large"
            className="account-tabs"
            onChange={(key) => {
              // Update URL when tab changes
              const newSearchParams = new URLSearchParams(location.search);
              newSearchParams.set("tab", key);
              navigate(`${location.pathname}?${newSearchParams.toString()}`, {
                replace: true,
              });
            }}
          >
            {/* Favorites Tab */}
            <TabPane
              tab={
                <span>
                  <HeartFilled className="text-red-500" />
                  Yêu thích ({favorites.length})
                </span>
              }
              key="favorites"
            >
              {favoritesLoading ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : favorites.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {favorites.map((favorite) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={favorite._id}>
                      <Card
                        hoverable
                        className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105 group"
                        cover={
                          <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 relative">
                            <ShoppingCartOutlined className="text-4xl text-purple-300 group-hover:text-purple-500 transition-colors duration-300" />
                            <Tooltip title="Xóa khỏi yêu thích">
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavorite(favorite.product._id);
                                }}
                              />
                            </Tooltip>
                          </div>
                        }
                        onClick={() => handleViewProduct(favorite.product._id)}
                      >
                        <Card.Meta
                          title={
                            <div className="space-y-2">
                              <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                                {favorite.product.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <CalendarOutlined />
                                Thêm{" "}
                                {new Date(
                                  favorite.createdAt
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          }
                          description={
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Tag color="blue" className="text-xs">
                                  {favorite.product.category?.name ||
                                    "Chưa phân loại"}
                                </Tag>
                                <Badge
                                  status={
                                    (favorite.product.stock || 0) > 0
                                      ? "success"
                                      : "error"
                                  }
                                  text={
                                    (favorite.product.stock || 0) > 0
                                      ? "Còn hàng"
                                      : "Hết hàng"
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Rate
                                  disabled
                                  value={favorite.product.rating}
                                  className="text-sm"
                                />
                                <Text className="text-gray-500 text-sm">
                                  ({favorite.product.reviewCount || 0})
                                </Text>
                              </div>
                              <div className="text-xl font-bold text-indigo-600">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(favorite.product.price || 0)}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  image={<HeartFilled className="text-6xl text-gray-300" />}
                  description={
                    <div className="space-y-2">
                      <Text className="text-lg text-gray-500">
                        Bạn chưa có sản phẩm yêu thích nào
                      </Text>
                      <Text className="text-sm text-gray-400">
                        Nhấn vào biểu tượng ❤️ ở trang sản phẩm để thêm vào danh
                        sách yêu thích
                      </Text>
                    </div>
                  }
                  className="py-12"
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/products")}
                    className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    Khám phá sản phẩm
                  </Button>
                </Empty>
              )}
            </TabPane>

            {/* Purchases Tab */}
            <TabPane
              tab={
                <span>
                  <ShopOutlined className="text-green-500" />
                  Đơn hàng ({purchases.length})
                </span>
              }
              key="purchases"
            >
              {loading.purchases ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : purchases.length > 0 ? (
                <div className="space-y-6">
                  {purchases.map((purchase) => (
                    <Card
                      key={purchase._id}
                      className="shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Title
                                  level={4}
                                  className="!text-xl !font-bold !text-gray-800 !mb-0"
                                >
                                  Đơn hàng #{purchase._id.slice(-8)}
                                </Title>
                                <Tag
                                  icon={getStatusIcon(purchase.status)}
                                  color={getStatusColor(purchase.status)}
                                  className="text-sm font-semibold"
                                >
                                  {getStatusText(purchase.status)}
                                </Tag>
                              </div>
                              <Text className="text-gray-500 flex items-center gap-1">
                                <CalendarOutlined />
                                {new Date(
                                  purchase.purchaseDate
                                ).toLocaleDateString("vi-VN")}
                              </Text>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                              <ShoppingCartOutlined className="text-2xl text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <Title
                                level={5}
                                className="!text-lg !font-semibold !text-gray-800 !mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
                                onClick={() =>
                                  handleViewProduct(purchase.product._id)
                                }
                              >
                                {purchase.product.name}
                              </Title>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Số lượng: {purchase.quantity}</span>
                                <span>
                                  Đơn giá:{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(purchase.product.price || 0)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Text className="text-xl font-bold text-indigo-600">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(purchase.totalAmount || 0)}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty
                  image={<ShopOutlined className="text-6xl text-gray-300" />}
                  description="Bạn chưa có đơn hàng nào"
                  className="py-12"
                >
                  <Button type="primary" onClick={() => navigate("/products")}>
                    Mua sắm ngay
                  </Button>
                </Empty>
              )}
            </TabPane>

            {/* View History Tab */}
            <TabPane
              tab={
                <span>
                  <EyeOutlined className="text-blue-500" />
                  Đã xem ({viewHistory.length})
                </span>
              }
              key="history"
            >
              {loading.viewHistory ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : viewHistory.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {viewHistory
                    .filter((history) => history.productId) // Filter out items with missing productId
                    .map((history) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={history._id}>
                        <Card
                          hoverable
                          className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105 group"
                          cover={
                            <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative">
                              <ShoppingCartOutlined className="text-4xl text-blue-300 group-hover:text-blue-500 transition-colors duration-300" />
                              <div className="absolute top-2 right-2">
                                <EyeOutlined className="text-gray-400" />
                              </div>
                            </div>
                          }
                          onClick={() =>
                            handleViewProduct(history.productId?._id)
                          }
                        >
                          <Card.Meta
                            title={
                              <div className="space-y-2">
                                <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                                  {history.productId?.name ||
                                    "Sản phẩm không xác định"}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <EyeOutlined />
                                  Xem{" "}
                                  {new Date(
                                    history.viewedAt || history.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              </div>
                            }
                            description={
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Tag color="blue" className="text-xs">
                                    {history.productId?.category?.name ||
                                      "Chưa phân loại"}
                                  </Tag>
                                  <Badge
                                    status={
                                      (history.productId?.stock || 0) > 0
                                        ? "success"
                                        : "error"
                                    }
                                    text={
                                      (history.productId?.stock || 0) > 0
                                        ? "Còn hàng"
                                        : "Hết hàng"
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Rate
                                    disabled
                                    value={history.productId?.rating || 0}
                                    className="text-sm"
                                  />
                                  <Text className="text-gray-500 text-sm">
                                    ({history.productId?.reviewCount || 0})
                                  </Text>
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(history.productId?.price || 0)}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                </Row>
              ) : (
                <Empty
                  image={<EyeOutlined className="text-6xl text-gray-300" />}
                  description="Bạn chưa xem sản phẩm nào"
                  className="py-12"
                >
                  <Button type="primary" onClick={() => navigate("/products")}>
                    Khám phá sản phẩm
                  </Button>
                </Empty>
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <style>{`
        .account-tabs .ant-tabs-nav {
          padding: 0 24px;
          margin-bottom: 24px;
        }

        .account-tabs .ant-tabs-tab {
          font-size: 16px;
          font-weight: 600;
          padding: 16px 24px;
        }

        .account-tabs .ant-tabs-content-holder {
          padding: 0 24px 24px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Content>
  );
};

export default AccountPage;
