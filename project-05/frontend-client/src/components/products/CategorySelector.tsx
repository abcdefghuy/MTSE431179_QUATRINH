import React from "react";
import { Select, Typography, Card, Tag, Spin, Alert, Button } from "antd";
import {
  ReloadOutlined,
  AppstoreOutlined,
  FilterOutlined,
  FireOutlined,
  StarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import type { Category } from "../../types/product.types";

const { Text, Title } = Typography;
const { Option } = Select;

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  loading: boolean;
  onRetry: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  loading,
  onRetry,
}) => {
  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/20">
        <div className="p-8 text-center">
          <Spin size="large" className="mb-4" />
          <Text className="text-lg text-gray-600">Đang tải danh mục...</Text>
        </div>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/20">
        <Alert
          message="Không có danh mục nào"
          description="Không thể tải danh mục sản phẩm. Vui lòng thử lại."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={onRetry} icon={<ReloadOutlined />}>
              Thử lại
            </Button>
          }
          className="rounded-2xl"
        />
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/20 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <AppstoreOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={4} className="!mb-1 !text-gray-800">
                Chọn danh mục sản phẩm
              </Title>
              <Text className="text-sm text-gray-500">
                Lọc sản phẩm theo danh mục yêu thích
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <Text className="text-sm text-gray-500">
              {categories.length} danh mục
            </Text>
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FilterOutlined className="text-purple-500 text-lg" />
            <Text className="font-semibold text-gray-700">
              Danh mục hiện tại:
            </Text>
            {selectedCategory ? (
              <Tag
                color="purple"
                className="px-3 py-1 rounded-full font-semibold text-sm"
              >
                {selectedCategory.name}
              </Tag>
            ) : (
              <Tag
                color="default"
                className="px-3 py-1 rounded-full font-semibold text-sm"
              >
                Tất cả danh mục
              </Tag>
            )}
          </div>

          <Select
            placeholder="Chọn danh mục sản phẩm"
            value={selectedCategory?._id}
            onChange={(value) => {
              const category = categories.find((cat) => cat._id === value);
              if (category) {
                onSelectCategory(category);
              }
            }}
            className="w-full"
            size="large"
            showSearch
            filterOption={(input, option) =>
              String(option?.children)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
            suffixIcon={<AppstoreOutlined className="text-purple-500" />}
          >
            <Option value="" key="all">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>Tất cả danh mục</span>
              </div>
            </Option>
            {categories.map((category) => (
              <Option value={category._id} key={category._id}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <span>{category.name}</span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <FireOutlined className="text-red-500 text-lg" />
              <div>
                <Text className="text-sm font-semibold text-red-700">
                  Sản phẩm hot
                </Text>
                <Text className="text-xs text-red-600">Đang bán chạy</Text>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <StarOutlined className="text-yellow-500 text-lg" />
              <div>
                <Text className="text-sm font-semibold text-yellow-700">
                  Đánh giá cao
                </Text>
                <Text className="text-xs text-yellow-600">4.8/5 sao</Text>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <GiftOutlined className="text-green-500 text-lg" />
              <div>
                <Text className="text-sm font-semibold text-green-700">
                  Miễn phí ship
                </Text>
                <Text className="text-xs text-green-600">Đơn hàng 500k+</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategorySelector;
