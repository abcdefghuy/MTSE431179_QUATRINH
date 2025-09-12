import { useState, useCallback } from "react";

export const useCartValidation = () => {
  const [errors, setErrors] = useState({});

  const validateItem = useCallback((item) => {
    const itemErrors = {};

    if (!item.id || String(item.id).trim() === "") {
      itemErrors.id = "ID sản phẩm là bắt buộc";
    }

    if (!item.name || String(item.name).trim() === "") {
      itemErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (item.price === undefined || item.price === null || item.price === "") {
      itemErrors.price = "Giá sản phẩm là bắt buộc";
    } else {
      const price = parseFloat(item.price);
      if (isNaN(price) || price < 0) {
        itemErrors.price = "Giá sản phẩm phải là số dương";
      }
    }

    if (item.quantity !== undefined) {
      const quantity = parseInt(item.quantity);
      if (isNaN(quantity) || quantity < 1) {
        itemErrors.quantity = "Số lượng phải là số nguyên dương";
      }
    }

    return itemErrors;
  }, []);

  const validateCart = useCallback(
    (items) => {
      const cartErrors = {};

      if (!Array.isArray(items)) {
        cartErrors.general = "Giỏ hàng phải là một mảng";
        return cartErrors;
      }

      items.forEach((item, index) => {
        const itemErrors = validateItem(item);
        if (Object.keys(itemErrors).length > 0) {
          cartErrors[`item_${index}`] = itemErrors;
        }
      });

      return cartErrors;
    },
    [validateItem]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    validateItem,
    validateCart,
    clearErrors,
    setFieldError,
    clearFieldError,
    setErrors,
  };
};

export default useCartValidation;
