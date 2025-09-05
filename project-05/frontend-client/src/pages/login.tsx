import React, { useContext } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Card,
  Typography,
  Space,
} from "antd";
import { loginUserAPI } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  EC: number;
  access_token?: string;
  user?: {
    email: string;
    name: string;
  };
  EM?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values;

    const res = await loginUserAPI(email, password);

    const responseData: LoginResponse = res as unknown as LoginResponse;
    if (responseData && responseData.EC === 0) {
      localStorage.setItem("access_token", responseData.access_token || "");
      notification.success({
        message: "LOGIN USER",
        description: "Success",
      });

      setAuthState({
        isAuthenticated: true,
        user: {
          email: responseData?.user?.email ?? "",
          name: responseData?.user?.name ?? "",
        },
      });
      console.log("Login successful");
      navigate("/");
    } else {
      notification.error({
        message: "LOGIN USER",
        description: responseData?.EM ?? "error",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card className="auth-card" hoverable>
              <div className="auth-header">
                <div className="auth-icon">
                  <LoginOutlined />
                </div>
                <Title level={2} className="auth-title">
                  Đăng nhập
                </Title>
                <Text className="auth-subtitle">
                  Chào mừng bạn quay trở lại
                </Text>
              </div>

              <Form
                name="login"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                size="large"
                className="auth-form"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Nhập địa chỉ email"
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>

              <div className="auth-footer">
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Link to="/" className="back-link">
                    <ArrowLeftOutlined /> Quay lại trang chủ
                  </Link>

                  <Divider />

                  <div className="auth-switch">
                    <Text>Chưa có tài khoản? </Text>
                    <Link to="/register" className="auth-link">
                      Đăng ký ngay
                    </Link>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
