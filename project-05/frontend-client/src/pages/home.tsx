import {
  CrownOutlined,
  SecurityScanOutlined,
  UserOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography, Button, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import {
  getUserViewHistoryAPI,
  getRecommendationsAPI,
  getDiscoverRecommendationsAPI,
  getTrendingProductsAPI,
  getPersonalizedRecommendationsAPI,
} from "../util/api.ts";
import { handleApiError } from "../util/errorHandler";
import type { ViewHistory, Product } from "../types/product.types";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [recentlyViewed, setRecentlyViewed] = useState<ViewHistory[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [discoverProducts, setDiscoverProducts] = useState<Product[]>([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const features = [
    {
      icon: <SecurityScanOutlined className="feature-icon" />,
      title: "Bảo mật JWT",
      description: "Xác thực người dùng an toàn với JSON Web Token",
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
    },
    {
      icon: <UserOutlined className="feature-icon" />,
      title: "Quản lý người dùng",
      description: "Hệ thống quản lý người dùng đầy đủ với phân quyền",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: "Hiệu suất cao",
      description: "Ứng dụng React hiện đại với tốc độ tải nhanh",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ];

  useEffect(() => {
    // Fetch public content always
    fetchDiscoverProducts();
    fetchTrendingProducts();

    // Fetch personalized content only if authenticated
    if (authState.isAuthenticated) {
      fetchViewHistory();
      fetchRecommendations();
    }
  }, [authState.isAuthenticated]);

  const fetchViewHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await getUserViewHistoryAPI();
      // Lấy 8 sản phẩm gần đây nhất
      setRecentlyViewed(response.data.slice(0, 8));
    } catch (error: any) {
      const errorType = handleApiError(error, {
        showAuthError: false, // Don't show auth error on home page
        defaultErrorMessage: authState.isAuthenticated
          ? "Không thể tải lịch sử xem sản phẩm"
          : "",
      });
      if (errorType === "AUTH_ERROR") {
        console.log("User not authenticated for view history");
        setRecentlyViewed([]);
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await getPersonalizedRecommendationsAPI();
      // Lấy 8 sản phẩm được đề xuất
      setRecommendations(response.data.slice(0, 8));
    } catch (error) {
      const errorType = handleApiError(error, {
        showAuthError: false, // Don't show auth error on home page
        defaultErrorMessage: authState.isAuthenticated
          ? "Không thể tải gợi ý sản phẩm"
          : "",
      });
      if (errorType === "AUTH_ERROR") {
        console.log("User not authenticated for recommendations");
        setRecommendations([]);
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchDiscoverProducts = async () => {
    setLoadingDiscover(true);
    try {
      const response = await getDiscoverRecommendationsAPI();
      setDiscoverProducts(response.data.slice(0, 8) || []);
    } catch (error) {
      handleApiError(error, {
        defaultErrorMessage: "Không thể tải sản phẩm khám phá",
        showNotification: true,
      });
    } finally {
      setLoadingDiscover(false);
    }
  };

  const fetchTrendingProducts = async () => {
    setLoadingTrending(true);
    try {
      const response = await getTrendingProductsAPI();
      setTrendingProducts(response.data.slice(0, 8) || []);
    } catch (error) {
      handleApiError(error, {
        defaultErrorMessage: "Không thể tải sản phẩm xu hướng",
        showNotification: true,
      });
    } finally {
      setLoadingTrending(false);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="home-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-rose-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
          <div
            className="absolute top-40 right-10 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 py-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-12 animate-bounce-in">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 hover:scale-110 transition-all duration-500 group">
                <CrownOutlined className="text-6xl text-white group-hover:text-yellow-300 transition-colors duration-500" />
              </div>
            </div>

            <div className="animate-fade-in-up">
              <Title
                level={1}
                className="!text-7xl !font-black !text-white !mb-8 tracking-tight"
              >
                Chào mừng đến với
                <span className="block bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent animate-gradient-x">
                  JWT App
                </span>
              </Title>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <Paragraph className="!text-2xl !text-white/95 !mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Ứng dụng quản lý xác thực hiện đại với React & Node.js. Trải
                nghiệm mua sắm tuyệt vời với bộ sưu tập sản phẩm đa dạng, chất
                lượng cao và giá cả hợp lý.
              </Paragraph>
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!authState.isAuthenticated ? (
                  <>
                    <Link to="/products">
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        className="h-16 px-10 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 border-0 hover:from-indigo-600 hover:via-blue-600 hover:to-emerald-600 shadow-2xl hover:shadow-3xl transition-all duration-500 font-bold text-xl rounded-2xl hover:scale-105 hover:-translate-y-1"
                      >
                        Xem sản phẩm
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        size="large"
                        icon={<ArrowRightOutlined />}
                        className="h-16 px-10 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold text-xl rounded-2xl hover:scale-105 hover:-translate-y-1"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        size="large"
                        className="h-16 px-10 bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold text-xl rounded-2xl hover:scale-105 hover:-translate-y-1"
                      >
                        Đăng ký ngay
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/products">
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        className="h-16 px-10 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 border-0 hover:from-indigo-600 hover:via-blue-600 hover:to-emerald-600 shadow-2xl hover:shadow-3xl transition-all duration-500 font-bold text-xl rounded-2xl hover:scale-105 hover:-translate-y-1"
                      >
                        Xem sản phẩm
                      </Button>
                    </Link>
                    <Link to="/user">
                      <Button
                        size="large"
                        icon={<UserOutlined />}
                        className="h-16 px-10 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold text-xl rounded-2xl hover:scale-105 hover:-translate-y-1"
                      >
                        Xem danh sách người dùng
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-emerald-100 text-indigo-700 rounded-full text-sm font-semibold">
                ✨ Tính năng nổi bật
              </span>
            </div>
            <Title
              level={2}
              className="!text-5xl !font-black !text-gray-800 !mb-6"
            >
              Khám phá những tính năng
              <span className="block bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                độc đáo
              </span>
            </Title>
            <Paragraph className="!text-xl !text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Làm nên sự khác biệt của chúng tôi với những công nghệ tiên tiến
              và trải nghiệm người dùng tuyệt vời
            </Paragraph>
          </div>

          <Row gutter={[40, 40]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <div className="group h-full">
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
                    <div className="relative p-10 text-center">
                      <div
                        className={`w-24 h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        {React.cloneElement(feature.icon, {
                          className: "text-white text-4xl",
                        })}
                      </div>
                      <Title
                        level={4}
                        className="!text-2xl !font-bold !text-gray-800 !mb-6 group-hover:text-indigo-600 transition-colors duration-500"
                      >
                        {feature.title}
                      </Title>
                      <Paragraph className="!text-gray-600 !text-lg !leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Welcome Section for Authenticated Users */}
      {authState.isAuthenticated && (
        <section className="py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
              <div className="relative p-16">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
                    <CheckCircleOutlined className="text-white text-3xl" />
                  </div>
                </div>
                <Title
                  level={3}
                  className="!text-4xl !font-black !text-gray-800 !mb-6"
                >
                  Xin chào,{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                    {authState.user.name || authState.user.email}
                  </span>
                  !
                </Title>
                <Paragraph className="!text-xl !text-gray-600 !mb-12 max-w-3xl mx-auto leading-relaxed">
                  Bạn đã đăng nhập thành công. Hãy khám phá các tính năng tuyệt
                  vời của ứng dụng và trải nghiệm mua sắm trực tuyến với chúng
                  tôi.
                </Paragraph>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-emerald-500 border-0 hover:from-indigo-600 hover:to-emerald-600 shadow-xl hover:shadow-2xl transition-all duration-500 font-bold text-lg rounded-2xl hover:scale-105 hover:-translate-y-1"
                    >
                      Mua sắm ngay
                    </Button>
                  </Link>
                  <Link to="/user">
                    <Button
                      size="large"
                      icon={<UserOutlined />}
                      className="h-14 px-8 border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-500 font-semibold text-lg rounded-2xl hover:scale-105 hover:-translate-y-1"
                    >
                      Quản lý tài khoản
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Discover Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Title
            level={2}
            className="!text-4xl !font-black !text-gray-800 !mb-4"
          >
            🚀 Khám phá sản phẩm
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm mới và thú vị dành cho mọi người
          </Paragraph>
        </div>

        {loadingDiscover ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : discoverProducts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {discoverProducts.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
                <Card
                  hoverable
                  className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105 group"
                  cover={
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 relative">
                      <ShoppingCartOutlined className="text-4xl text-blue-300 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                  }
                  onClick={() => handleViewProduct(product._id!)}
                >
                  <Card.Meta
                    title={
                      <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </div>
                    }
                    description={
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {product.category?.name || "Chưa phân loại"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              (product.stock || 0) > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {(product.stock || 0) > 0 ? "Còn hàng" : "Hết hàng"}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price || 0)}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-12">
            <Paragraph className="text-gray-500">
              Không có sản phẩm khám phá nào
            </Paragraph>
          </div>
        )}
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center mb-12">
          <Title
            level={2}
            className="!text-4xl !font-black !text-gray-800 !mb-4"
          >
            🔥 Xu hướng thịnh hành
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất hiện tại
          </Paragraph>
        </div>

        {loadingTrending ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : trendingProducts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {trendingProducts.map((product, index) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
                <Card
                  hoverable
                  className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105 group relative"
                  cover={
                    <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 relative">
                      <FireOutlined className="text-4xl text-orange-300 group-hover:text-orange-500 transition-colors duration-300" />
                      {index < 3 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          #{index + 1}
                        </div>
                      )}
                    </div>
                  }
                  onClick={() => handleViewProduct(product._id!)}
                >
                  <Card.Meta
                    title={
                      <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </div>
                    }
                    description={
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            {product.category?.name || "Chưa phân loại"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              (product.stock || 0) > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {(product.stock || 0) > 0 ? "Còn hàng" : "Hết hàng"}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price || 0)}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-12">
            <Paragraph className="text-gray-500">
              Không có sản phẩm xu hướng nào
            </Paragraph>
          </div>
        )}
      </section>

      {/* Recently Viewed Products Section */}
      {authState.isAuthenticated && recentlyViewed.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                  👀 Gần đây
                </span>
              </div>
              <Title
                level={2}
                className="!text-4xl !font-black !text-gray-800 !mb-6"
              >
                Sản phẩm bạn đã xem
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  gần đây
                </span>
              </Title>
              <Paragraph className="!text-xl !text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Tiếp tục khám phá những sản phẩm thú vị mà bạn đã quan tâm
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {recentlyViewed
                .filter((viewHistory) => viewHistory.productId) // Filter out items with missing productId
                .map((viewHistory, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={viewHistory._id}>
                    <Card
                      hoverable
                      className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105 group"
                      cover={
                        <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 relative">
                          <ShoppingCartOutlined className="text-4xl text-purple-300 group-hover:text-purple-500 transition-colors duration-300" />
                          <div className="absolute top-2 right-2">
                            <EyeOutlined className="text-gray-400" />
                          </div>
                        </div>
                      }
                      onClick={() =>
                        handleViewProduct(viewHistory.productId?._id)
                      }
                    >
                      <Card.Meta
                        title={
                          <div className="space-y-2">
                            <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                              {viewHistory.productId?.name ||
                                "Sản phẩm không xác định"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Xem{" "}
                              {new Date(
                                viewHistory.viewedAt || viewHistory.createdAt
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        }
                        description={
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {viewHistory.productId?.category?.name ||
                                  "Chưa phân loại"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  (viewHistory.productId?.stock || 0) > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {(viewHistory.productId?.stock || 0) > 0
                                  ? "Còn hàng"
                                  : "Hết hàng"}
                              </span>
                            </div>
                            <div className="text-xl font-bold text-purple-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(viewHistory.productId?.price || 0)}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
            </Row>

            {recentlyViewed.length === 8 && (
              <div className="text-center mt-12">
                <Link to="/products">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-500 font-bold text-lg rounded-2xl hover:scale-105 hover:-translate-y-1"
                  >
                    Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {authState.isAuthenticated && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="!text-4xl !font-black !text-gray-800 !mb-4"
            >
              🎯 Gợi ý dành cho bạn
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được chọn lọc phù hợp với sở thích của bạn
            </Paragraph>
          </div>

          {loadingRecommendations ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : recommendations.length > 0 ? (
            <Row gutter={[24, 24]}>
              {recommendations.map((product) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
                  <Card
                    hoverable
                    className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden transform hover:scale-105 group"
                    cover={
                      <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 relative">
                        <ShoppingCartOutlined className="text-4xl text-purple-300 group-hover:text-purple-500 transition-colors duration-300" />
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              (product.stock || 0) > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {(product.stock || 0) > 0 ? "Còn hàng" : "Hết hàng"}
                          </span>
                        </div>
                      </div>
                    }
                    onClick={() => handleViewProduct(product._id)}
                  >
                    <Card.Meta
                      title={
                        <div className="space-y-2">
                          <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < (product.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
                        </div>
                      }
                      description={
                        <div className="space-y-3">
                          <div className="text-xl font-bold text-indigo-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price || 0)}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤖</div>
              <Title level={4} className="!text-gray-500 !mb-2">
                Chưa có gợi ý sản phẩm
              </Title>
              <Paragraph className="text-gray-400 mb-6">
                Hãy xem thêm các sản phẩm để nhận được gợi ý phù hợp
              </Paragraph>
              <Link to="/products">
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 border-0 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  Khám phá sản phẩm
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      <style>{`
        .hero-actions .ant-btn {
          border-radius: 16px;
        }

        .feature-icon {
          font-size: 48px;
          color: #667eea;
          margin-bottom: 20px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
