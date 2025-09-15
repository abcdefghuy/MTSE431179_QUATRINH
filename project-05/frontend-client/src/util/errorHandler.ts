import { message } from "antd";

export interface ApiErrorHandlerOptions {
  showAuthError?: boolean;
  authErrorMessage?: string;
  defaultErrorMessage?: string;
  onAuthError?: () => void;
}

export const handleApiError = (
  error: unknown,
  options: ApiErrorHandlerOptions = {}
) => {
  const {
    showAuthError = true,
    authErrorMessage = "Vui lòng đăng nhập để sử dụng tính năng này",
    defaultErrorMessage = "Có lỗi xảy ra, vui lòng thử lại",
    onAuthError,
  } = options;

  console.error("API Error:", error);

  // Type guard to check if error has response property
  const isAxiosError = (
    err: unknown
  ): err is { response?: { status?: number }; code?: string } => {
    return typeof err === "object" && err !== null;
  };

  if (!isAxiosError(error)) {
    message.error(defaultErrorMessage);
    return "UNKNOWN_ERROR";
  }

  if (error.response?.status === 401) {
    if (showAuthError) {
      message.warning(authErrorMessage);
    }
    if (onAuthError) {
      onAuthError();
    }
    return "AUTH_ERROR";
  }

  if (error.response?.status === 403) {
    message.error("Bạn không có quyền thực hiện hành động này");
    return "FORBIDDEN_ERROR";
  }

  if (error.response?.status === 404) {
    message.error("Không tìm thấy tài nguyên được yêu cầu");
    return "NOT_FOUND_ERROR";
  }

  if (error.response?.status === 400) {
    message.error("Dữ liệu gửi lên không hợp lệ");
    return "BAD_REQUEST_ERROR";
  }

  if (error.response?.status === 429) {
    message.warning("Bạn đã thực hiện quá nhiều yêu cầu, vui lòng thử lại sau");
    return "RATE_LIMIT_ERROR";
  }

  if (error.response?.status >= 500) {
    message.error("Lỗi máy chủ, vui lòng thử lại sau");
    return "SERVER_ERROR";
  }

  if (error.code === "NETWORK_ERROR" || !error.response) {
    message.error("Lỗi kết nối mạng, vui lòng kiểm tra kết nối internet");
    return "NETWORK_ERROR";
  }

  // Default error
  message.error(defaultErrorMessage);
  return "UNKNOWN_ERROR";
};

export const createAuthErrorHandler = (navigate: (path: string) => void) => {
  return (
    error: unknown,
    options: Omit<ApiErrorHandlerOptions, "onAuthError"> = {}
  ) => {
    return handleApiError(error, {
      ...options,
      onAuthError: () => navigate("/login"),
    });
  };
};
