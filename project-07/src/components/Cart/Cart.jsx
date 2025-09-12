import React, { useState } from "react";
import { Button, Modal } from "../UI";
import CartItem from "./CartItem";
import { useCartOperations } from "../../hooks";
import "./Cart.css";

const Cart = ({
  showHeader = true,
  showFooter = true,
  showClearButton = true,
  readOnly = false,
  className = "",
  emptyMessage = "Giỏ hàng của bạn đang trống",
  onCheckout,
  onClearCart,
  maxHeight = "600px",
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const cart = useCartOperations();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleClearCart = () => {
    if (showClearModal) {
      cart.clearCart(true); // Skip confirmation since we're using modal
      setShowClearModal(false);
      onClearCart && onClearCart();
    } else {
      setShowClearModal(true);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(cart.getCartSummary());
    }
  };

  const cartClass = `cart ${className}`.trim();

  if (cart.isEmpty) {
    return (
      <div className={`${cartClass} cart--empty`}>
        {showHeader && (
          <div className="cart__header">
            <h2 className="cart__title">Giỏ hàng</h2>
            <span className="cart__count">0 sản phẩm</span>
          </div>
        )}
        <div className="cart__empty-state">
          <div className="cart__empty-icon">🛒</div>
          <p className="cart__empty-message">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cartClass}>
      {showHeader && (
        <div className="cart__header">
          <h2 className="cart__title">Giỏ hàng</h2>
          <span className="cart__count">
            {cart.totalItems} sản phẩm ({cart.itemCount} loại)
          </span>
        </div>
      )}

      <div className="cart__items" style={{ maxHeight: maxHeight }}>
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={!readOnly ? cart.updateQuantity : undefined}
            onRemove={!readOnly ? cart.removeItem : undefined}
            onUpdate={!readOnly ? cart.updateItem : undefined}
            readOnly={readOnly}
          />
        ))}
      </div>

      {showFooter && (
        <div className="cart__footer">
          <div className="cart__summary">
            <div className="cart__summary-row">
              <span className="cart__summary-label">Tổng số lượng:</span>
              <span className="cart__summary-value">{cart.totalItems}</span>
            </div>
            <div className="cart__summary-row cart__summary-row--total">
              <span className="cart__summary-label">Tổng tiền:</span>
              <span className="cart__summary-value cart__total-price">
                {formatPrice(cart.totalPrice)}
              </span>
            </div>
          </div>

          {!readOnly && (
            <div className="cart__actions">
              {showClearButton && cart.itemCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="cart__clear-button"
                >
                  Xóa tất cả
                </Button>
              )}

              {onCheckout && (
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  className="cart__checkout-button"
                >
                  Thanh toán
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Clear confirmation modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Xác nhận xóa giỏ hàng"
        size="small"
        footer={
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowClearModal(false)}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleClearCart}>
              Xóa tất cả
            </Button>
          </div>
        }
      >
        <p>
          Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng? Hành động này
          không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
};

export default Cart;
