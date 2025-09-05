import React, { useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Typography,
  Empty,
  Card,
  Statistic,
} from "antd";
import {
  ReloadOutlined,
  ShoppingOutlined,
  FireOutlined,
  StarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import ProductCard from "./ProductCard";
import PaginationControls from "./PaginationControls";
import type { Product } from "../../types/product.types";

const { Text, Title } = Typography;

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isInfiniteScroll: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
  onTogglePaginationMode: (isInfiniteScroll: boolean) => void;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  loadingMore,
  error,
  hasMore,
  totalItems,
  currentPage,
  totalPages,
  itemsPerPage,
  isInfiniteScroll,
  onLoadMore,
  onRetry,
  onChangePage,
  onChangePageSize,
  onTogglePaginationMode,
  onViewDetails,
  onAddToCart,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (
        target.isIntersecting &&
        hasMore &&
        !loadingMore &&
        isInfiniteScroll
      ) {
        onLoadMore();
      }
    },
    [hasMore, loadingMore, isInfiniteScroll, onLoadMore]
  );

  useEffect(() => {
    if (isInfiniteScroll) {
      const element = loadMoreRef.current;
      if (element) {
        observerRef.current = new IntersectionObserver(handleObserver, {
          threshold: 0.1,
        });
        observerRef.current.observe(element);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, isInfiniteScroll]);

  if (error) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200/20">
        <Alert
          message="Lỗi tải sản phẩm"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              danger
              onClick={onRetry}
              icon={<ReloadOutlined />}
            >
              Thử lại
            </Button>
          }
          className="rounded-2xl"
        />
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-purple-200/20">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <Text className="text-lg text-gray-600">Đang tải sản phẩm...</Text>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-purple-200/20">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="space-y-2">
              <Text className="text-lg text-gray-600">
                Không có sản phẩm nào
              </Text>
              <Text className="text-gray-500">Hãy thử chọn danh mục khác</Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Statistic
            title={<Text className="text-white/90">Tổng sản phẩm</Text>}
            value={totalItems}
            prefix={<ShoppingOutlined className="text-white" />}
            valueStyle={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Statistic
            title={<Text className="text-white/90">Đánh giá trung bình</Text>}
            value={4.8}
            precision={1}
            prefix={<StarOutlined className="text-white" />}
            suffix="/5"
            valueStyle={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Statistic
            title={<Text className="text-white/90">Sản phẩm hot</Text>}
            value={12}
            prefix={<FireOutlined className="text-white" />}
            valueStyle={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          isInfiniteScroll={isInfiniteScroll}
          onPageChange={onChangePage}
          onPageSizeChange={onChangePageSize}
          onToggleMode={onTogglePaginationMode}
        />
      )}

      {/* Product Grid */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200/20 relative overflow-hidden">
        {/* Grid Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Title level={3} className="!mb-2 !text-gray-800">
              Danh sách sản phẩm
            </Title>
            <Text className="text-gray-600">
              Hiển thị {products.length} sản phẩm
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Text className="text-sm text-gray-500">Đang cập nhật</Text>
          </div>
        </div>

        {/* Products Grid */}
        <Row gutter={[24, 24]}>
          {products.map((product, index) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              xl={6}
              key={product._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            </Col>
          ))}
        </Row>

        {/* Loading More Indicator */}
        {loadingMore && isInfiniteScroll && (
          <div className="text-center py-8">
            <Spin size="large" className="mb-4" />
            <Text className="text-gray-600">Đang tải thêm sản phẩm...</Text>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loadingMore && products.length > 0 && isInfiniteScroll && (
          <div ref={loadMoreRef} className="text-center py-8">
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={onLoadMore}
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Tải thêm sản phẩm
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && products.length > 0 && isInfiniteScroll && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <GiftOutlined className="text-gray-500" />
              <Text className="text-gray-600">Đã hiển thị tất cả sản phẩm</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
