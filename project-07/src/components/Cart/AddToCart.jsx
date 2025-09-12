import React, { useState } from "react";
import { Button, Input, Modal } from "../UI";
import { useCartOperations, useCartValidation } from "../../hooks";
import "./AddToCart.css";

const AddToCart = ({
  product,
  showModal = false,
  onClose,
  onSuccess,
  showAsButton = true,
  buttonText = "Thêm vào giỏ hàng",
  buttonVariant = "primary",
  buttonSize = "medium",
  allowQuantitySelection = true,
  defaultQuantity = 1,
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(showModal);
  const [formData, setFormData] = useState({
    id: product?.id || "",
    name: product?.name || "",
    price: product?.price || "",
    quantity: defaultQuantity,
    description: product?.description || "",
    image: product?.image || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cart = useCartOperations();
  const validation = useCartValidation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    validation.clearErrors();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (validation.errors[field]) {
      validation.clearFieldError(field);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const errors = validation.validateItem(formData);

      if (Object.keys(errors).length > 0) {
        validation.setErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Add item to cart
      const addedItem = cart.addItem(formData);

      // Success callback
      if (onSuccess) {
        onSuccess(addedItem);
      }

      // Close modal and reset form
      handleCloseModal();
      if (!product) {
        setFormData({
          id: "",
          name: "",
          price: "",
          quantity: defaultQuantity,
          description: "",
          image: "",
        });
      }
    } catch (error) {
      validation.setFieldError("general", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = () => {
    if (product) {
      try {
        const itemToAdd = {
          ...product,
          quantity: defaultQuantity,
        };

        const addedItem = cart.addItem(itemToAdd);

        if (onSuccess) {
          onSuccess(addedItem);
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      handleOpenModal();
    }
  };

  // If product is provided and showAsButton is true, show quick add button
  if (product && showAsButton && !showModal) {
    return (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleQuickAdd}
        className={`add-to-cart-button ${className}`}
      >
        {buttonText}
      </Button>
    );
  }

  const modalContent = (
    <form onSubmit={handleSubmit} className="add-to-cart-form">
      {validation.errors.general && (
        <div className="add-to-cart-error">{validation.errors.general}</div>
      )}

      <Input
        label="ID sản phẩm"
        value={formData.id}
        onChange={(e) => handleInputChange("id", e.target.value)}
        error={validation.errors.id}
        required
        disabled={!!product}
      />

      <Input
        label="Tên sản phẩm"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        error={validation.errors.name}
        required
        disabled={!!product}
      />

      <Input
        label="Giá"
        type="number"
        value={formData.price}
        onChange={(e) => handleInputChange("price", e.target.value)}
        error={validation.errors.price}
        required
        min="0"
        step="0.01"
        disabled={!!product}
      />

      <Input
        label="Mô tả"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        disabled={!!product}
      />

      <Input
        label="URL hình ảnh"
        value={formData.image}
        onChange={(e) => handleInputChange("image", e.target.value)}
        disabled={!!product}
      />

      {allowQuantitySelection && (
        <Input
          label="Số lượng"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleInputChange("quantity", e.target.value)}
          error={validation.errors.quantity}
          required
          min="1"
        />
      )}
    </form>
  );

  const modalFooter = (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button
        variant="secondary"
        onClick={handleCloseModal}
        disabled={isSubmitting}
      >
        Hủy
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Đang thêm..." : "Thêm vào giỏ hàng"}
      </Button>
    </div>
  );

  return (
    <div className={`add-to-cart ${className}`}>
      {showAsButton && !product && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleOpenModal}
          className="add-to-cart-button"
        >
          {buttonText}
        </Button>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          product ? `Thêm "${product.name}" vào giỏ hàng` : "Thêm sản phẩm mới"
        }
        size="medium"
        footer={modalFooter}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default AddToCart;
