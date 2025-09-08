import React, { useState, useCallback, useRef } from "react";
import {
  Input,
  Dropdown,
  Button,
  Slider,
  Radio,
  Typography,
  Divider,
  Tag,
} from "antd";
import type { InputRef } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { Category, SearchFilters } from "../../types/product.types";

const { Text } = Typography;

interface SearchBarWithFiltersProps {
  categories: Category[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
}

const SearchBarWithFilters: React.FC<SearchBarWithFiltersProps> = ({
  categories,
  filters,
  onFiltersChange,
  onSearch,
  loading = false,
  placeholder = "Search",
  style,
  className = "",
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const searchRef = useRef<InputRef>(null);

  const updateFilter = useCallback(
    (
      key: keyof SearchFilters,
      value: string | number | boolean | [number, number]
    ) => {
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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categoryId && filters.categoryId !== "") count++;
    if (filters.priceRange[0] > 1 || filters.priceRange[1] < 5000) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    return count;
  };

  const clearFilter = (filterKey: keyof SearchFilters) => {
    switch (filterKey) {
      case "categoryId":
        updateFilter("categoryId", "");
        break;
      case "priceRange":
        updateFilter("priceRange", [1, 5000]);
        break;
      case "rating":
        updateFilter("rating", 0);
        break;
      case "minReviewCount":
        updateFilter("minReviewCount", 0);
        break;
      case "inStock":
        updateFilter("inStock", false);
        break;
    }
  };

  const filterDropdownContent = (
    <div className="w-80 p-5 bg-white rounded-xl shadow-xl border border-gray-100">
      {/* Category Filter */}
      <div className="mb-5">
        <Text className="font-semibold text-gray-800 block mb-3 text-sm">
          Category
        </Text>
        <div className="space-y-1.5">
          {categories.slice(0, 6).map((category) => (
            <div
              key={category._id}
              className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
                filters.categoryId === category._id
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
              onClick={() => updateFilter("categoryId", category._id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <Divider className="my-4" />

      {/* Price Range Filter */}
      <div className="mb-5">
        <Text className="font-semibold text-gray-800 block mb-3 text-sm">
          Price Range
        </Text>
        <div className="px-2">
          <Slider
            range
            min={1}
            max={5000}
            step={50}
            value={filters.priceRange}
            onChange={(value) =>
              handlePriceRangeChange(value as [number, number])
            }
            tooltip={{
              formatter: (value) => formatPrice(value || 0),
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Reviews Filter */}
      <div className="mb-5">
        <Text className="font-semibold text-gray-800 block mb-3 text-sm">
          Reviews
        </Text>
        <Radio.Group
          value={filters.rating}
          onChange={(e) => updateFilter("rating", e.target.value)}
          className="w-full"
        >
          <div className="space-y-2">
            <Radio value={0} className="w-full text-sm font-medium">
              All reviews
            </Radio>
            <Radio value={4.5} className="w-full text-sm font-medium">
              <div className="flex items-center">
                <span className="text-yellow-500 text-base">★★★★★</span>
                <span className="ml-2 text-gray-700">4.5 & above</span>
              </div>
            </Radio>
            <Radio value={4.0} className="w-full text-sm font-medium">
              <div className="flex items-center">
                <span className="text-yellow-500 text-base">★★★★</span>
                <span className="text-gray-300 text-base">☆</span>
                <span className="ml-2 text-gray-700">4.0 - 4.5</span>
              </div>
            </Radio>
            <Radio value={3.5} className="w-full text-sm font-medium">
              <div className="flex items-center">
                <span className="text-yellow-500 text-base">★★★</span>
                <span className="text-gray-300 text-base">☆☆</span>
                <span className="ml-2 text-gray-700">3.5 - 4.0</span>
              </div>
            </Radio>
            <Radio value={3.0} className="w-full text-sm font-medium">
              <div className="flex items-center">
                <span className="text-yellow-500 text-base">★★★</span>
                <span className="text-gray-300 text-base">☆☆</span>
                <span className="ml-2 text-gray-700">3.0 - 3.5</span>
              </div>
            </Radio>
            <Radio value={2.5} className="w-full text-sm font-medium">
              <div className="flex items-center">
                <span className="text-yellow-500 text-base">★★</span>
                <span className="text-gray-300 text-base">☆☆☆</span>
                <span className="ml-2 text-gray-700">2.5 - 3.0</span>
              </div>
            </Radio>
          </div>
        </Radio.Group>
      </div>

      <Divider className="my-4" />

      {/* Stock Filter */}
      <div className="mb-6">
        <Text className="font-semibold text-gray-800 block mb-3 text-sm">
          Availability
        </Text>
        <div className="space-y-1.5">
          <div
            className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
              !filters.inStock
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "hover:bg-gray-50 text-gray-600"
            }`}
            onClick={() => updateFilter("inStock", false)}
          >
            Tất cả sản phẩm
          </div>
          <div
            className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
              filters.inStock
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "hover:bg-gray-50 text-gray-600"
            }`}
            onClick={() => updateFilter("inStock", true)}
          >
            Chỉ sản phẩm còn hàng
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button
          type="text"
          onClick={() => {
            onFiltersChange({
              query: filters.query,
              categoryId: "",
              priceRange: [1, 5000],
              rating: 0,
              minReviewCount: 0,
              inStock: false,
              sortBy: "createdAt",
              sortOrder: "desc",
            });
          }}
          className="text-gray-500 text-sm font-medium hover:text-gray-700"
        >
          Reset Filter
        </Button>
        <Button
          type="primary"
          onClick={() => {
            onSearch();
            setDropdownVisible(false);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-sm font-medium px-6 rounded-lg"
        >
          Apply
        </Button>
      </div>
    </div>
  );

  const handleSearchSubmit = (value: string) => {
    updateFilter("query", value);
    onSearch();
  };

  return (
    <div className={`search-bar-container ${className}`} style={style}>
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-10">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            ref={searchRef}
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            onPressEnter={(e) =>
              handleSearchSubmit((e.target as HTMLInputElement).value)
            }
            placeholder={placeholder}
            size="middle"
            bordered={false}
            className="px-3 py-2 text-sm"
            suffix={
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => handleSearchSubmit(filters.query)}
                loading={loading}
                className="text-gray-400 hover:text-blue-500"
                size="small"
              />
            }
          />
        </div>

        {/* Filter Dropdown */}
        <Dropdown
          overlay={filterDropdownContent}
          trigger={["hover", "click"]}
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
          placement="bottomRight"
          overlayClassName="filter-dropdown"
        >
          <Button
            type="text"
            className="h-full px-3 border-l border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
            size="small"
          >
            <div className="flex items-center space-x-1.5">
              <FilterOutlined className="text-gray-600 text-sm" />
              <span className="text-gray-600 font-medium text-sm">Filter</span>
              {getActiveFiltersCount() > 0 && (
                <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {getActiveFiltersCount()}
                </div>
              )}
              <DownOutlined className="text-gray-400 text-xs" />
            </div>
          </Button>
        </Dropdown>
      </div>

      {/* Active Filters Tags */}
      {((filters.categoryId && filters.categoryId !== "") ||
        filters.priceRange[0] > 1 ||
        filters.priceRange[1] < 5000 ||
        filters.rating > 0 ||
        filters.inStock) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.categoryId && filters.categoryId !== "" && (
            <Tag
              closable
              onClose={() => clearFilter("categoryId")}
              color="blue"
              className="px-2 py-1 rounded-full text-xs"
            >
              {categories.find((c) => c._id === filters.categoryId)?.name}
            </Tag>
          )}
          {(filters.priceRange[0] > 1 || filters.priceRange[1] < 5000) && (
            <Tag
              closable
              onClose={() => clearFilter("priceRange")}
              color="green"
              className="px-2 py-1 rounded-full text-xs"
            >
              {formatPrice(filters.priceRange[0])} -{" "}
              {formatPrice(filters.priceRange[1])}
            </Tag>
          )}
          {filters.rating > 0 && (
            <Tag
              closable
              onClose={() => clearFilter("rating")}
              color="gold"
              className="px-2 py-1 rounded-full text-xs"
            >
              {filters.rating}+ ★
            </Tag>
          )}
          {filters.inStock && (
            <Tag
              closable
              onClose={() => clearFilter("inStock")}
              color="cyan"
              className="px-2 py-1 rounded-full text-xs"
            >
              Còn hàng
            </Tag>
          )}
        </div>
      )}

      <style>{`
        .search-bar-container .ant-input {
          font-size: 14px;
        }
        
        .header-search .search-bar-container {
          max-height: 40px;
        }
        
        .search-bar-container .ant-input::placeholder {
          color: #9ca3af;
        }
        
        .filter-dropdown .ant-dropdown-menu {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .ant-radio-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 4px 0;
        }
        
        .ant-slider-rail {
          background: #e2e8f0;
          height: 6px;
          border-radius: 3px;
        }

        .ant-slider-track {
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
          height: 6px;
          border-radius: 3px;
        }

        .ant-slider-handle {
          border: 3px solid #3b82f6;
          width: 18px;
          height: 18px;
          margin-top: -6px;
          background: white;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        .ant-slider-handle:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .ant-slider-handle:focus {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .ant-radio-wrapper .ant-radio {
          margin-right: 8px;
        }

        .ant-radio-checked .ant-radio-inner {
          border-color: #3b82f6;
          background-color: #3b82f6;
        }

        .ant-radio:hover .ant-radio-inner {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default SearchBarWithFilters;
