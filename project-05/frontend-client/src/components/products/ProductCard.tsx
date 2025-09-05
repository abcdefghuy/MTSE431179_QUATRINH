import React, { useContext, useState } from "react";
import { Rate, Typography, Button, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  LoginOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
  FireOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import type { Product } from "../../types/product.types";

const { Title, Text, Paragraph } = Typography;

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  const { authState } = useContext(AuthContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        text: "Hết hàng",
        color: "red",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      };
    if (stock < 10)
      return {
        text: "Sắp hết",
        color: "orange",
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
      };
    return {
      text: "Còn hàng",
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    };
  };

  const stockStatus = getStockStatus(product.stock);
  const isOnSale = product.price < 1000000;

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100/50 hover:border-indigo-200/50 hover:-translate-y-3 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 h-64">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Main Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-9xl transition-all duration-700 ${
              isHovered
                ? "text-indigo-400 scale-110 rotate-12"
                : "text-indigo-300"
            }`}
          >
            <ShoppingCartOutlined />
          </div>
        </div>

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              <FireOutlined className="mr-1" />
              SALE
            </div>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border ${stockStatus.bgColor} ${stockStatus.textColor} ${stockStatus.borderColor}`}
          >
            {stockStatus.text}
          </div>
        </div>

        {/* Stock Count Badge */}
        <div className="absolute top-16 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg border border-gray-200">
            📦 {product.stock}
          </div>
        </div>

        {/* Wishlist Button */}
        <div
          className={`absolute top-4 right-16 z-10 transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <Tooltip title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
            <Button
              type="text"
              shape="circle"
              icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
              className={`bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0 transition-all duration-300 ${
                isWishlisted
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-500 hover:text-red-500"
              }`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            />
          </Tooltip>
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Quick View Button */}
        <div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails?.(product)}
            className="bg-white/90 backdrop-blur-sm text-purple-600 border-0 hover:bg-white shadow-lg font-semibold"
          >
            Xem nhanh
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {product.category?.name || "Không phân loại"}
          </span>
        </div>

        {/* Product Name */}
        <Title
          level={4}
          className="!mb-0 !text-gray-800 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300 !text-lg !font-bold"
        >
          {product.name}
        </Title>

        {/* Description */}
        <Paragraph className="text-gray-600 line-clamp-2 !mb-0 text-sm leading-relaxed">
          {product.description}
        </Paragraph>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Rate
            disabled
            value={product.rating || 4.5}
            allowHalf
            className="text-yellow-400 text-sm"
          />
          <Text className="text-gray-500 text-xs flex items-center gap-1">
            <StarFilled className="text-yellow-400" />(
            {product.reviewCount || 445} đánh giá)
          </Text>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price * 1.3)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails?.(product)}
            className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-emerald-500 border-0 hover:from-indigo-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold rounded-xl hover:scale-105 hover:-translate-y-1"
          >
            Chi tiết
          </Button>

          <Button
            type={
              product.stock === 0 || !authState.isAuthenticated
                ? "default"
                : "primary"
            }
            icon={
              !authState.isAuthenticated ? (
                <LoginOutlined />
              ) : (
                <ShoppingCartOutlined />
              )
            }
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className={`h-12 px-6 font-semibold rounded-xl transition-all duration-500 ${
              product.stock === 0 || !authState.isAuthenticated
                ? "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 border-0 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            }`}
          >
            {!authState.isAuthenticated ? "Đăng nhập" : "Mua ngay"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
