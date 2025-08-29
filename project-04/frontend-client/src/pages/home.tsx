import {
  CrownOutlined,
  SecurityScanOutlined,
  UserOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography, Button, Space } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const { authState } = useContext(AuthContext);

  const features = [
    {
      icon: <SecurityScanOutlined className="feature-icon" />,
      title: "Bảo mật JWT",
      description: "Xác thực người dùng an toàn với JSON Web Token",
    },
    {
      icon: <UserOutlined className="feature-icon" />,
      title: "Quản lý người dùng",
      description: "Hệ thống quản lý người dùng đầy đủ với phân quyền",
    },
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: "Hiệu suất cao",
      description: "Ứng dụng React hiện đại với tốc độ tải nhanh",
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <CrownOutlined />
          </div>
          <Title level={1} className="hero-title">
            Chào mừng đến với JWT App
          </Title>
          <Paragraph className="hero-subtitle">
            Ứng dụng quản lý xác thực hiện đại với React & Node.js
          </Paragraph>
          <Space size="middle" className="hero-actions">
            {!authState.isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button type="primary" size="large">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="large">Đăng ký ngay</Button>
                </Link>
              </>
            ) : (
              <Link to="/user">
                <Button type="primary" size="large">
                  Xem danh sách người dùng
                </Button>
              </Link>
            )}
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Title level={2} className="section-title">
            Tính năng nổi bật
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-content">
                    {feature.icon}
                    <Title level={4} className="feature-title">
                      {feature.title}
                    </Title>
                    <Paragraph className="feature-description">
                      {feature.description}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Status Section */}
      {authState.isAuthenticated && (
        <section className="status-section">
          <div className="container">
            <Card className="status-card">
              <Title level={3}>
                Xin chào, {authState.user.name || authState.user.email}!
              </Title>
              <Paragraph>
                Bạn đã đăng nhập thành công. Hãy khám phá các tính năng của ứng
                dụng.
              </Paragraph>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
