import {
  CrownOutlined,
  SecurityScanOutlined,
  UserOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography, Button } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { authState } = useContext(AuthContext);

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

      <style>{`
        .hero-actions .ant-btn {
          border-radius: 16px;
        }

        .feature-icon {
          font-size: 48px;
          color: #667eea;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
