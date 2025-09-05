import React, { useContext } from "react";
import { Layout, Typography, Modal, message, Alert, Button, Rate } from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  InfoCircleOutlined,
  StarOutlined,
  FireOutlined,
  GiftOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { useProducts } from "../hooks/useProducts";
import CategorySelector from "../components/products/CategorySelector";
import ProductGrid from "../components/products/ProductGrid";
import type { Product } from "../types/product.types";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ProductsPage: React.FC = () => {
  const { authState } = useContext(AuthContext);
  const {
    categories,
    products,
    selectedCategory,
    loading,
    error,
    pagination,
    isInfiniteScroll,
    selectCategory,
    loadMoreProducts,
    retryLoadCategories,
    retryLoadProducts,
    changePage,
    changePageSize,
    togglePaginationMode,
  } = useProducts();

  const handleViewDetails = (product: Product) => {
    Modal.info({
      title: (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <CrownOutlined className="text-white" />
          </div>
          <span className="text-xl font-bold">{product.name}</span>
        </div>
      ),
      width: 700,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center">
                <ShoppingCartOutlined className="text-6xl text-purple-300" />
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Còn hàng: {product.stock}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {product.category?.name}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Text className="text-gray-600 text-sm">Mô tả sản phẩm</Text>
                <Paragraph className="text-gray-800 leading-relaxed">
                  {product.description}
                </Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <Rate
                  disabled
                  value={product.rating || 4.5}
                  className="text-yellow-400"
                />
                <Text className="text-gray-500">
                  ({product.reviewCount || 445} đánh giá)
                </Text>
              </div>
              <div className="pt-4">
                <Text className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ),
      okText: "Đóng",
      className: "modern-modal",
    });
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      message.error("Sản phẩm đã hết hàng!");
      return;
    }
    if (!authState.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-rose-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
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

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-8 animate-bounce-in">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 hover:scale-110 transition-all duration-500 group">
                <ShoppingCartOutlined className="text-5xl text-white group-hover:text-amber-300 transition-colors duration-500" />
              </div>
            </div>

            <div className="animate-fade-in-up">
              <Title
                level={1}
                className="!text-6xl !font-black !text-white !mb-6 tracking-tight"
              >
                Khám Phá Sản Phẩm
              </Title>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <Paragraph className="!text-2xl !text-white/95 !mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Trải nghiệm mua sắm tuyệt vời với bộ sưu tập sản phẩm đa dạng,
                chất lượng cao và giá cả hợp lý
              </Paragraph>
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <StarOutlined className="text-amber-300" />
                  <Text className="text-white font-semibold text-lg">
                    4.8/5 Đánh giá
                  </Text>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <FireOutlined className="text-orange-300" />
                  <Text className="text-white font-semibold text-lg">
                    Hot Sale
                  </Text>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <GiftOutlined className="text-emerald-300" />
                  <Text className="text-white font-semibold text-lg">
                    Miễn phí ship
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="space-y-12">
            {/* Welcome Alert for Guests */}
            {!authState.isAuthenticated && (
              <div className="animate-fade-in-up">
                <Alert
                  message="Chào mừng bạn đến với cửa hàng!"
                  description={
                    <div className="space-y-4">
                      <Text className="block text-lg">
                        Bạn có thể xem tất cả sản phẩm mà không cần đăng nhập.
                        Đăng nhập để có thể thêm sản phẩm vào giỏ hàng và mua
                        sắm.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/login">
                          <Button
                            type="primary"
                            size="large"
                            icon={<LoginOutlined />}
                            className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-emerald-500 border-0 hover:from-indigo-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold rounded-xl hover:scale-105 hover:-translate-y-1"
                          >
                            Đăng nhập
                          </Button>
                        </Link>
                        <Link to="/register">
                          <Button
                            size="large"
                            icon={<InfoCircleOutlined />}
                            className="h-12 px-6 border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-500 font-semibold rounded-xl hover:scale-105 hover:-translate-y-1"
                          >
                            Đăng ký
                          </Button>
                        </Link>
                      </div>
                    </div>
                  }
                  type="info"
                  showIcon
                  className="bg-white/95 backdrop-blur-xl border border-indigo-200/50 rounded-3xl shadow-xl"
                  icon={
                    <InfoCircleOutlined className="text-indigo-500 text-xl" />
                  }
                />
              </div>
            )}

            {/* Category Selector */}
            <div className="animate-slide-in-left">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={selectCategory}
                loading={loading.categories}
                onRetry={retryLoadCategories}
              />
            </div>

            {/* Product Grid */}
            <div className="animate-slide-in-right">
              <ProductGrid
                products={products}
                loading={loading.products}
                loadingMore={loading.loadingMore}
                error={error.products}
                hasMore={pagination.hasMore}
                totalItems={pagination.totalItems}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.itemsPerPage}
                isInfiniteScroll={isInfiniteScroll}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onLoadMore={loadMoreProducts}
                onRetry={retryLoadProducts}
                onChangePage={changePage}
                onChangePageSize={changePageSize}
                onTogglePaginationMode={togglePaginationMode}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modern-modal .ant-modal-content {
          border-radius: 20px;
          overflow: hidden;
        }

        .modern-modal .ant-modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid #e5e7eb;
        }

        .modern-modal .ant-modal-body {
          padding: 24px;
        }
      `}</style>
    </Content>
  );
};

export default ProductsPage;
