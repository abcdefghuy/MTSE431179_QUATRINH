import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Button,
  Rate,
  message,
  Card,
  Row,
  Col,
  Divider,
  Avatar,
  Form,
  Input,
  Modal,
  Badge,
  Tooltip,
  Spin,
  Alert,
  Image,
  InputNumber,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  UserOutlined,
  CalendarOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../components/context/auth.context";
import { useFavoritesContext } from "../components/context/favorites.context";
import {
  getProductDetailAPI,
  addToFavoritesAPI,
  removeFromFavoritesAPI,
  createPurchaseAPI,
  createCommentAPI,
  recordProductViewAPI,
  getUserPurchasesAPI,
  getSimilarProductsAPI,
} from "../util/api.ts";
import { handleApiError } from "../util/errorHandler";
import type {
  ProductDetail,
  Purchase,
  CreateCommentRequest,
  CreatePurchaseRequest,
  Product,
} from "../types/product.types";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const { addToFavoritesLocal, removeFromFavoritesLocal } =
    useFavoritesContext();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [commentForm] = Form.useForm();

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProductDetailAPI(productId!);
      setProduct(response.data);
    } catch (error) {
      handleApiError(error, {
        authErrorMessage: "Vui lòng đăng nhập để xem đầy đủ thông tin sản phẩm",
        defaultErrorMessage: "Không thể tải thông tin sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchUserPurchases = useCallback(async () => {
    try {
      const response = await getUserPurchasesAPI();
      setUserPurchases(response.data);
    } catch (error) {
      const errorType = handleApiError(error, {
        showAuthError: false, // Don't show auth error for background data fetching
        defaultErrorMessage: "Không thể tải lịch sử mua hàng",
      });
      if (errorType === "AUTH_ERROR") {
        console.log("User not authenticated for purchases");
      }
    }
  }, []);

  const recordView = useCallback(async () => {
    try {
      await recordProductViewAPI(productId!);
    } catch (error) {
      const errorType = handleApiError(error, {
        showAuthError: false, // Don't show auth error for background operations
        defaultErrorMessage: "Không thể lưu lịch sử xem sản phẩm",
      });
      if (errorType === "AUTH_ERROR") {
        console.log("User not authenticated for recording view");
      }
    }
  }, [productId]);

  const fetchSimilarProducts = useCallback(async () => {
    if (!productId) return;

    setLoadingSimilar(true);
    try {
      const response = await getSimilarProductsAPI(productId);
      setSimilarProducts(response.data.slice(0, 4) || []); // Lấy 4 sản phẩm tương tự
    } catch (error) {
      handleApiError(error, {
        defaultErrorMessage: "Không thể tải sản phẩm tương tự",
        showAuthError: false, // Silent fail for similar products
      });
    } finally {
      setLoadingSimilar(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
      fetchSimilarProducts(); // Always fetch similar products (public endpoint)
      if (authState.isAuthenticated) {
        fetchUserPurchases();
        recordView();
      }
    }
  }, [
    productId,
    authState.isAuthenticated,
    fetchProductDetail,
    fetchSimilarProducts,
    fetchUserPurchases,
    recordView,
  ]);

  const handleToggleFavorite = async () => {
    if (!authState.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      return;
    }

    try {
      setFavoriteLoading(true);
      if (product?.isFavorited) {
        await removeFromFavoritesAPI(productId!);
        setProduct((prev) => (prev ? { ...prev, isFavorited: false } : null));
        removeFromFavoritesLocal(productId!);
        message.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        const response = await addToFavoritesAPI(productId!);
        setProduct((prev) => (prev ? { ...prev, isFavorited: true } : null));
        // Add to favorites context if response contains the favorite object
        if (response.data && product) {
          addToFavoritesLocal({
            _id: response.data._id || "",
            user: authState.user.name || authState.user.email,
            product: product,
            createdAt: new Date().toISOString(),
          });
        }
        message.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      handleApiError(error, {
        authErrorMessage: "Vui lòng đăng nhập để sử dụng tính năng yêu thích",
        defaultErrorMessage: "Có lỗi xảy ra khi cập nhật danh sách yêu thích",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!authState.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để mua hàng");
      return;
    }

    if (!product || (product.stock || 0) < quantity) {
      message.error("Sản phẩm không đủ số lượng trong kho");
      return;
    }

    try {
      setPurchaseLoading(true);
      const purchaseData: CreatePurchaseRequest = {
        productId: productId!,
        quantity,
      };
      const purchaseResponse = await createPurchaseAPI(purchaseData);

      // Enhanced success notification
      message.success({
        content: (
          <div>
            <div className="font-semibold text-green-700">
              🎉 Mua hàng thành công!
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Đơn hàng #{purchaseResponse.data._id?.slice(-6)} đã được tạo
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Bạn có thể viết đánh giá sau khi nhận hàng
            </div>
          </div>
        ),
        duration: 6,
        className: "purchase-success-message",
      });

      fetchProductDetail(); // Refresh to update stock
      fetchUserPurchases(); // Refresh user purchases
      setPurchaseModalVisible(false);
      setQuantity(1);
    } catch (error) {
      handleApiError(error, {
        authErrorMessage: "Vui lòng đăng nhập để mua hàng",
        defaultErrorMessage: "Có lỗi xảy ra khi mua hàng",
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleAddComment = async (values: {
    content: string;
    rating: number;
  }) => {
    if (!selectedPurchase) return;

    try {
      const commentData: CreateCommentRequest = {
        content: values.content,
        rating: values.rating,
        purchaseId: selectedPurchase._id,
      };
      await createCommentAPI(commentData);

      // Enhanced success notification for comment
      message.success({
        content: (
          <div>
            <div className="font-semibold text-green-700">
              ⭐ Đánh giá đã được gửi!
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Cảm ơn bạn đã chia sẻ trải nghiệm về sản phẩm
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Đánh giá của bạn sẽ giúp người khác đưa ra quyết định tốt hơn
            </div>
          </div>
        ),
        duration: 5,
        className: "comment-success-message",
      });

      commentForm.resetFields();
      setCommentModalVisible(false);
      setSelectedPurchase(null);
      fetchProductDetail(); // Refresh to show new comment
    } catch (error) {
      handleApiError(error, {
        authErrorMessage: "Vui lòng đăng nhập để viết đánh giá",
        defaultErrorMessage: "Có lỗi xảy ra khi gửi đánh giá",
      });
    }
  };

  const canComment = () => {
    return userPurchases.some(
      (purchase) =>
        purchase.product._id === productId &&
        purchase.status === "completed" &&
        !(product?.comments || []).some(
          (comment) => comment.purchase === purchase._id
        )
    );
  };

  const getAvailablePurchasesForComment = () => {
    return userPurchases.filter(
      (purchase) =>
        purchase.product._id === productId &&
        purchase.status === "completed" &&
        !(product?.comments || []).some(
          (comment) => comment.purchase === purchase._id
        )
    );
  };

  if (loading) {
    return (
      <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spin size="large" />
      </Content>
    );
  }

  if (!product) {
    return (
      <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Alert
          message="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại."
          type="error"
          action={
            <Button type="primary" onClick={() => navigate("/products")}>
              Quay lại danh sách sản phẩm
            </Button>
          }
        />
      </Content>
    );
  }

  return (
    <Content className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-rose-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            Quay lại
          </Button>
        </div>

        <Row gutter={[48, 48]}>
          {/* Product Images and Basic Info */}
          <Col xs={24} lg={12}>
            <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mb-6">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-cover rounded-2xl"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L9gzwRqMGYjZgI3YTXYDYuQsXYHYyKyBA4pbBBZgdYydWK9EFGBiM2YUDZ8YGbQMWwzLv9Z39qmd6Z4aKVlXfqne9T0JXVVG9ee895/1kqSuqtu2Ng== "
                  preview={false}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    status={(product.stock || 0) > 0 ? "success" : "error"}
                    text={
                      (product.stock || 0) > 0
                        ? `Còn ${product.stock || 0} sản phẩm`
                        : "Hết hàng"
                    }
                    className="text-lg font-semibold"
                  />
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {product.category?.name || "Chưa phân loại"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Rate
                    disabled
                    value={product.rating}
                    className="text-yellow-400"
                  />
                  <Text className="text-gray-500">
                    ({product.totalComments || 0} đánh giá)
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Product Details and Actions */}
          <Col xs={24} lg={12}>
            <div className="space-y-6">
              <div>
                <Title
                  level={1}
                  className="!text-4xl !font-black !text-gray-800 !mb-4"
                >
                  {product.name}
                </Title>
                <Text className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price || 0)}
                </Text>
              </div>

              <Divider />

              <div>
                <Title level={4} className="!text-gray-800 !mb-3">
                  Mô tả sản phẩm
                </Title>
                <Paragraph className="text-gray-600 text-lg leading-relaxed">
                  {product.description || "Chưa có mô tả sản phẩm"}
                </Paragraph>
              </div>

              <Divider />

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => setPurchaseModalVisible(true)}
                    disabled={(product.stock || 0) === 0}
                    className="flex-1 h-14 bg-gradient-to-r from-indigo-500 to-emerald-500 border-0 hover:from-indigo-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold text-lg rounded-xl hover:scale-105"
                  >
                    Mua ngay
                  </Button>

                  <Tooltip
                    title={
                      product.isFavorited
                        ? "Bỏ yêu thích"
                        : "Thêm vào yêu thích"
                    }
                  >
                    <Button
                      size="large"
                      icon={
                        product.isFavorited ? (
                          <HeartFilled />
                        ) : (
                          <HeartOutlined />
                        )
                      }
                      onClick={handleToggleFavorite}
                      loading={favoriteLoading}
                      className={`h-14 w-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                        product.isFavorited
                          ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                          : "border-2 border-gray-300 hover:border-red-500 hover:text-red-500"
                      }`}
                    />
                  </Tooltip>
                </div>

                {authState.isAuthenticated &&
                  (canComment() ? (
                    <Button
                      icon={<CommentOutlined />}
                      onClick={() => setCommentModalVisible(true)}
                      className="w-full h-12 border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-500 font-semibold rounded-xl hover:scale-105"
                    >
                      Viết đánh giá ({getAvailablePurchasesForComment().length}{" "}
                      đơn hàng)
                    </Button>
                  ) : userPurchases.length > 0 ? (
                    <div className="text-center py-3 px-4 bg-gray-50 rounded-xl">
                      <Text className="text-gray-500 text-sm">
                        ✅ Bạn đã đánh giá tất cả đơn hàng của sản phẩm này
                      </Text>
                    </div>
                  ) : (
                    <div className="text-center py-3 px-4 bg-amber-50 rounded-xl border border-amber-200">
                      <Text className="text-amber-600 text-sm">
                        💡 Mua sản phẩm để có thể viết đánh giá
                      </Text>
                    </div>
                  ))}
              </div>

              {/* Product Info */}
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-0 rounded-2xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <SafetyCertificateOutlined className="text-2xl text-indigo-600" />
                    <Text className="font-semibold text-gray-700">
                      Bảo hành
                    </Text>
                    <Text className="text-sm text-gray-500">12 tháng</Text>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <ShopOutlined className="text-2xl text-emerald-600" />
                    <Text className="font-semibold text-gray-700">
                      Giao hàng
                    </Text>
                    <Text className="text-sm text-gray-500">2-3 ngày</Text>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Comments Section */}
        <div className="mt-16">
          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
            <Title
              level={3}
              className="!text-2xl !font-bold !text-gray-800 !mb-6 flex items-center gap-3"
            >
              <CommentOutlined className="text-indigo-600" />
              Đánh giá của khách hàng ({product.totalComments || 0})
            </Title>

            {product.comments && product.comments.length > 0 ? (
              <div className="space-y-6">
                {product.comments.map((comment) => (
                  <div key={comment._id} className="p-6 bg-gray-50 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-indigo-500 to-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Text className="font-semibold text-lg text-gray-800">
                              {comment.user.name}
                            </Text>
                            <div className="flex items-center gap-2 mt-1">
                              <Rate
                                disabled
                                value={comment.rating}
                                className="text-sm"
                              />
                              <Text className="text-gray-500 text-sm flex items-center gap-1">
                                <CalendarOutlined />
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <Paragraph className="text-gray-700 mb-0">
                          {comment.content}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CommentOutlined className="text-6xl text-gray-300 mb-4" />
                <Text className="text-xl text-gray-500">
                  Chưa có đánh giá nào cho sản phẩm này
                </Text>
              </div>
            )}
          </Card>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
            <Title
              level={3}
              className="!text-2xl !font-bold !text-gray-800 !mb-6 flex items-center gap-3"
            >
              <TagOutlined className="text-emerald-600" />
              Sản phẩm tương tự
            </Title>

            {loadingSimilar ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : similarProducts.length > 0 ? (
              <Row gutter={[24, 24]}>
                {similarProducts.map((similarProduct) => (
                  <Col xs={24} sm={12} lg={6} key={similarProduct._id}>
                    <Card
                      hoverable
                      className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 overflow-hidden hover:scale-105"
                      cover={
                        <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
                          <ShoppingCartOutlined className="text-4xl text-purple-300" />
                        </div>
                      }
                      onClick={() =>
                        navigate(`/products/${similarProduct._id}`)
                      }
                    >
                      <Card.Meta
                        title={
                          <Text className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {similarProduct.name || "Sản phẩm"}
                          </Text>
                        }
                        description={
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {similarProduct.category?.name ||
                                  "Chưa phân loại"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  (similarProduct.stock || 0) > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {(similarProduct.stock || 0) > 0
                                  ? "Còn hàng"
                                  : "Hết hàng"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Rate
                                disabled
                                value={similarProduct.rating || 0}
                                className="text-sm"
                              />
                              <Text className="text-gray-500 text-sm">
                                ({similarProduct.reviewCount || 0})
                              </Text>
                            </div>
                            <Text className="text-xl font-bold text-emerald-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(similarProduct.price || 0)}
                            </Text>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-12">
                <Paragraph className="text-gray-500">
                  Không có sản phẩm tương tự nào
                </Paragraph>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        title="Xác nhận mua hàng"
        open={purchaseModalVisible}
        onOk={handlePurchase}
        onCancel={() => setPurchaseModalVisible(false)}
        confirmLoading={purchaseLoading}
        okText="Mua ngay"
        cancelText="Hủy"
        className="purchase-modal"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
              <ShoppingCartOutlined className="text-2xl text-purple-500" />
            </div>
            <div className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {product.name || "Tên sản phẩm"}
              </Text>
              <div className="text-xl font-bold text-indigo-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price || 0)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Text className="text-lg font-semibold">Số lượng:</Text>
            <InputNumber
              min={1}
              max={product.stock || 0}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              className="flex-1"
            />
            <Text className="text-gray-500">
              Còn {product.stock || 0} sản phẩm
            </Text>
          </div>

          <Divider />

          <div className="flex justify-between items-center text-xl font-bold">
            <Text>Tổng cộng:</Text>
            <Text className="text-2xl text-indigo-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format((product.price || 0) * quantity)}
            </Text>
          </div>
        </div>
      </Modal>

      {/* Comment Modal */}
      <Modal
        title="Viết đánh giá"
        open={commentModalVisible}
        onOk={() => commentForm.submit()}
        onCancel={() => {
          setCommentModalVisible(false);
          setSelectedPurchase(null);
          commentForm.resetFields();
        }}
        okText="Gửi đánh giá"
        cancelText="Hủy"
        className="comment-modal"
      >
        <Form
          form={commentForm}
          onFinish={handleAddComment}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item label="Chọn đơn hàng để đánh giá" required>
            <div className="space-y-2">
              {getAvailablePurchasesForComment().map((purchase) => (
                <Card
                  key={purchase._id}
                  size="small"
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPurchase?._id === purchase._id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => setSelectedPurchase(purchase)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text className="font-semibold">
                        Đơn hàng #{purchase._id.slice(-6)}
                      </Text>
                      <div className="text-sm text-gray-500">
                        Số lượng: {purchase.quantity} | Ngày mua:{" "}
                        {new Date(purchase.purchaseDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                    <Badge status="success" text="Đã hoàn thành" />
                  </div>
                </Card>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[
              { required: true, message: "Vui lòng chọn số sao đánh giá" },
            ]}
          >
            <Rate className="text-2xl" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung đánh giá"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung đánh giá" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="resize-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .purchase-modal .ant-modal-content,
        .comment-modal .ant-modal-content {
          border-radius: 20px;
          overflow: hidden;
        }

        .purchase-modal .ant-modal-header,
        .comment-modal .ant-modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid #e5e7eb;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .purchase-success-message .ant-message-notice-content {
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .comment-success-message .ant-message-notice-content {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #86efac;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }
      `}</style>
    </Content>
  );
};

export default ProductDetailPage;
