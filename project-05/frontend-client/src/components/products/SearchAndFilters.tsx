import React, { useState, useCallback } from "react";
import {
  Card,
  Input,
  Select,
  Slider,
  Rate,
  Switch,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  Collapse,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  SlidersOutlined,
  DollarOutlined,
  StarOutlined,
  ShopOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import type { Category, SearchFilters } from "../../types/product.types";

const { Text, Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface SearchAndFiltersProps {
  categories: Category[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  categories,
  filters,
  onFiltersChange,
  onSearch,
  onClearFilters,
  loading = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: any) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handlePriceRangeChange = useCallback(
    (value: [number, number]) => {
      updateFilter("priceRange", value);
    },
    [updateFilter]
  );

  const handleSearch = useCallback(() => {
    onSearch();
  }, [onSearch]);

  const isFiltersActive = () => {
    return (
      filters.query ||
      filters.categoryId ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 10000000 ||
      filters.rating > 0 ||
      filters.minReviewCount > 0 ||
      filters.inStock ||
      filters.sortBy !== "createdAt"
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.categoryId) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++;
    if (filters.rating > 0) count++;
    if (filters.minReviewCount > 0) count++;
    if (filters.inStock) count++;
    if (filters.sortBy !== "createdAt") count++;
    return count;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/20 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <SearchOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={4} className="!mb-1 !text-gray-800">
                Tìm kiếm & Lọc sản phẩm
              </Title>
              <Text className="text-sm text-gray-500">
                Tìm kiếm sản phẩm với các bộ lọc chi tiết
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isFiltersActive() && (
              <Tag color="blue" className="px-3 py-1 rounded-full">
                {getActiveFiltersCount()} bộ lọc đang áp dụng
              </Tag>
            )}
            <Button
              icon={<ClearOutlined />}
              onClick={onClearFilters}
              disabled={!isFiltersActive()}
              className="rounded-xl"
            >
              Xóa tất cả
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm theo tên, mô tả..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            onSearch={handleSearch}
            enterButton={
              <Button
                type="primary"
                loading={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 rounded-r-xl"
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            className="search-input"
          />
        </div>

        {/* Filters Collapse */}
        <Collapse
          activeKey={collapsed ? [] : ["filters"]}
          onChange={(keys) => setCollapsed(keys.length === 0)}
          className="bg-transparent border-0"
          expandIcon={({ isActive }) => (
            <FilterOutlined
              className={`text-blue-500 transition-transform duration-300 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          )}
        >
          <Panel
            header={
              <div className="flex items-center gap-2">
                <SlidersOutlined className="text-blue-500" />
                <Text className="font-semibold text-gray-700">
                  Bộ lọc nâng cao
                </Text>
              </div>
            }
            key="filters"
            className="bg-transparent border-0"
          >
            <div className="pt-4">
              <Row gutter={[24, 24]}>
                {/* Category Filter */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShopOutlined className="text-purple-500" />
                      <Text className="font-semibold text-gray-700">
                        Danh mục
                      </Text>
                    </div>
                    <Select
                      placeholder="Chọn danh mục"
                      value={filters.categoryId || undefined}
                      onChange={(value) =>
                        updateFilter("categoryId", value || "")
                      }
                      className="w-full"
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {categories.map((category) => (
                        <Option value={category._id} key={category._id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                {/* Price Range Filter */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarOutlined className="text-green-500" />
                      <Text className="font-semibold text-gray-700">
                        Khoảng giá
                      </Text>
                    </div>
                    <div className="px-3">
                      <Slider
                        range
                        min={0}
                        max={10000000}
                        step={100000}
                        value={filters.priceRange}
                        onChange={handlePriceRangeChange}
                        tooltip={{
                          formatter: (value) =>
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(value || 0),
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(filters.priceRange[0])}
                      </span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(filters.priceRange[1])}
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Rating Filter */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarOutlined className="text-yellow-500" />
                      <Text className="font-semibold text-gray-700">
                        Đánh giá tối thiểu
                      </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Rate
                        value={filters.rating}
                        onChange={(value) => updateFilter("rating", value)}
                        allowClear
                        allowHalf
                      />
                      <Text className="text-sm text-gray-500">
                        {filters.rating > 0
                          ? `Từ ${filters.rating} sao trở lên`
                          : "Tất cả đánh giá"}
                      </Text>
                    </div>
                  </div>
                </Col>

                {/* Stock Filter */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShopOutlined className="text-blue-500" />
                      <Text className="font-semibold text-gray-700">
                        Tình trạng kho
                      </Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={filters.inStock}
                        onChange={(checked) => updateFilter("inStock", checked)}
                        checkedChildren="Còn hàng"
                        unCheckedChildren="Tất cả"
                      />
                      <Text className="text-sm text-gray-500">
                        {filters.inStock
                          ? "Chỉ hiển thị sản phẩm còn hàng"
                          : "Hiển thị tất cả"}
                      </Text>
                    </div>
                  </div>
                </Col>

                {/* Min Review Count */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarOutlined className="text-orange-500" />
                      <Text className="font-semibold text-gray-700">
                        Số lượng đánh giá tối thiểu
                      </Text>
                    </div>
                    <InputNumber
                      min={0}
                      max={10000}
                      value={filters.minReviewCount}
                      onChange={(value) =>
                        updateFilter("minReviewCount", value || 0)
                      }
                      placeholder="Số lượng đánh giá"
                      className="w-full"
                    />
                  </div>
                </Col>

                {/* Sort Options */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <SortAscendingOutlined className="text-indigo-500" />
                      <Text className="font-semibold text-gray-700">
                        Sắp xếp theo
                      </Text>
                    </div>
                    <Select
                      value={filters.sortBy}
                      onChange={(value) => updateFilter("sortBy", value)}
                      className="w-full"
                    >
                      <Option value="createdAt">Ngày tạo</Option>
                      <Option value="price">Giá</Option>
                      <Option value="rating">Đánh giá</Option>
                      <Option value="reviewCount">Số lượng đánh giá</Option>
                      <Option value="name">Tên sản phẩm</Option>
                    </Select>
                  </div>
                </Col>

                {/* Sort Order */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {filters.sortOrder === "asc" ? (
                        <SortAscendingOutlined className="text-indigo-500" />
                      ) : (
                        <SortDescendingOutlined className="text-indigo-500" />
                      )}
                      <Text className="font-semibold text-gray-700">
                        Thứ tự
                      </Text>
                    </div>
                    <Select
                      value={filters.sortOrder}
                      onChange={(value) => updateFilter("sortOrder", value)}
                      className="w-full"
                    >
                      <Option value="asc">Tăng dần</Option>
                      <Option value="desc">Giảm dần</Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Divider className="my-6" />

              {/* Action Buttons */}
              <div className="flex justify-center">
                <Space size="large">
                  <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 rounded-xl px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    size="large"
                    icon={<ClearOutlined />}
                    onClick={onClearFilters}
                    className="rounded-xl px-8 h-12 font-semibold border-2 border-gray-300 hover:border-blue-400 transition-all duration-300"
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Active Filters Display */}
        {isFiltersActive() && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FilterOutlined className="text-blue-500" />
              <Text className="font-semibold text-gray-700">
                Bộ lọc đang áp dụng:
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Tag
                  closable
                  onClose={() => updateFilter("query", "")}
                  color="blue"
                  className="px-3 py-1 rounded-full"
                >
                  Từ khóa: "{filters.query}"
                </Tag>
              )}
              {filters.categoryId && (
                <Tag
                  closable
                  onClose={() => updateFilter("categoryId", "")}
                  color="purple"
                  className="px-3 py-1 rounded-full"
                >
                  Danh mục:{" "}
                  {categories.find((c) => c._id === filters.categoryId)?.name}
                </Tag>
              )}
              {(filters.priceRange[0] > 0 ||
                filters.priceRange[1] < 10000000) && (
                <Tag
                  closable
                  onClose={() => updateFilter("priceRange", [0, 10000000])}
                  color="green"
                  className="px-3 py-1 rounded-full"
                >
                  Giá:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(filters.priceRange[0])}{" "}
                  -{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(filters.priceRange[1])}
                </Tag>
              )}
              {filters.rating > 0 && (
                <Tag
                  closable
                  onClose={() => updateFilter("rating", 0)}
                  color="gold"
                  className="px-3 py-1 rounded-full"
                >
                  Đánh giá: từ {filters.rating} sao
                </Tag>
              )}
              {filters.minReviewCount > 0 && (
                <Tag
                  closable
                  onClose={() => updateFilter("minReviewCount", 0)}
                  color="orange"
                  className="px-3 py-1 rounded-full"
                >
                  Tối thiểu {filters.minReviewCount} đánh giá
                </Tag>
              )}
              {filters.inStock && (
                <Tag
                  closable
                  onClose={() => updateFilter("inStock", false)}
                  color="cyan"
                  className="px-3 py-1 rounded-full"
                >
                  Còn hàng
                </Tag>
              )}
              {filters.sortBy !== "createdAt" && (
                <Tag
                  closable
                  onClose={() => updateFilter("sortBy", "createdAt")}
                  color="geekblue"
                  className="px-3 py-1 rounded-full"
                >
                  Sắp xếp: {filters.sortBy} (
                  {filters.sortOrder === "asc" ? "tăng dần" : "giảm dần"})
                </Tag>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .search-input .ant-input {
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .search-input .ant-input:focus,
        .search-input .ant-input:hover {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding: 16px 0;
          background: transparent;
          border: none;
        }

        .ant-collapse-content > .ant-collapse-content-box {
          padding: 0;
        }

        .ant-slider-rail {
          background: #f1f5f9;
          height: 6px;
        }

        .ant-slider-track {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          height: 6px;
        }

        .ant-slider-handle {
          border: 3px solid #3b82f6;
          width: 16px;
          height: 16px;
          margin-top: -5px;
        }

        .ant-rate-star {
          font-size: 20px;
        }
      `}</style>
    </Card>
  );
};

export default SearchAndFilters;
