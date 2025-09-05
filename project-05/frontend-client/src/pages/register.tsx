import React from "react";
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
import { createUserAPI } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    const { name, email, password } = values;
    const res = await createUserAPI(name, email, password);

    if (res) {
      notification.success({
        message: "CREATE USER",
        description: "Success",
      });
      navigate("/login");
    } else {
      notification.error({
        message: "CREATE USER",
        description: "error",
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
                  <UserAddOutlined />
                </div>
                <Title level={2} className="auth-title">
                  Đăng ký tài khoản
                </Title>
                <Text className="auth-subtitle">
                  Tạo tài khoản mới để bắt đầu
                </Text>
              </div>

              <Form
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                size="large"
                className="auth-form"
              >
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ và tên!",
                    },
                    {
                      min: 2,
                      message: "Tên phải có ít nhất 2 ký tự!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>

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
                    {
                      min: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự!",
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
                    Đăng ký
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
                    <Text>Đã có tài khoản? </Text>
                    <Link to="/login" className="auth-link">
                      Đăng nhập ngay
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

export default RegisterPage;
