import {
  notification,
  Table,
  Card,
  Typography,
  Space,
  Tag,
  Avatar,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { getUserAPI } from "../util/api";
import React from "react";
import type { ColumnsType } from "antd/es/table";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface ApiResponse {
  message?: string;
  data?: User[];
}

const UserPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<User[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserAPI();
      const responseData = res as unknown as ApiResponse | User[];

      // Check if response is an error object with message
      if (
        responseData &&
        typeof responseData === "object" &&
        "message" in responseData &&
        responseData.message
      ) {
        notification.error({
          message: "Unauthorized",
          description: responseData.message || "Error fetching users",
        });
      } else {
        // Response is directly an array of users
        setDataSource(Array.isArray(responseData) ? responseData : []);
      }
    };

    fetchUser();
  }, []);

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: "16px" }}>
              {record.name}
            </div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => (
        <Tooltip title={id}>
          <Tag icon={<IdcardOutlined />} color="blue">
            {id.slice(-8)}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const isAdmin = role?.toLowerCase() === "admin";
        return (
          <Tag
            icon={isAdmin ? <CrownOutlined /> : <UserOutlined />}
            color={isAdmin ? "gold" : "green"}
          >
            {role || "User"}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="user-page">
      <div className="container">
        <Card className="user-table-card">
          <div className="page-header">
            <Title level={2}>
              <UserOutlined style={{ marginRight: 12 }} />
              Danh sách người dùng
            </Title>
            <Text type="secondary">
              Quản lý tất cả người dùng trong hệ thống
            </Text>
          </div>

          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            className="modern-table"
            size="middle"
            loading={dataSource.length === 0}
          />
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
