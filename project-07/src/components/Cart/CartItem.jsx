import React, { useState } from "react";
import { Button, Input, Card } from "../UI";
import "./CartItem.css";

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdate,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleQuantityChange = (newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, quantity);
    }
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(item.id, editedItem);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <Card className="cart-item">
      <div className="cart-item__content">
        {item.image && (
          <div className="cart-item__image">
            <img src={item.image} alt={item.name} />
          </div>
        )}

        <div className="cart-item__details">
          {isEditing ? (
            <div className="cart-item__edit-form">
              <Input
                label="Tên sản phẩm"
                value={editedItem.name}
                onChange={(e) =>
                  setEditedItem((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                label="Giá"
                type="number"
                value={editedItem.price}
                onChange={(e) =>
                  setEditedItem((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Mô tả"
                value={editedItem.description || ""}
                onChange={(e) =>
                  setEditedItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="cart-item__info">
              <h4 className="cart-item__name">{item.name}</h4>
              {item.description && (
                <p className="cart-item__description">{item.description}</p>
              )}
              <div className="cart-item__price">
                <span className="cart-item__unit-price">
                  {formatPrice(item.price)}
                </span>
                <span className="cart-item__total-price">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="cart-item__controls">
          {!readOnly && (
            <>
              <div className="cart-item__quantity">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="cart-item__quantity-input"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  +
                </Button>
              </div>

              <div className="cart-item__actions">
                {isEditing ? (
                  <div className="cart-item__edit-actions">
                    <Button
                      variant="success"
                      size="small"
                      onClick={handleSaveEdit}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <div className="cart-item__default-actions">
                    {onUpdate && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setIsEditing(true)}
                      >
                        Sửa
                      </Button>
                    )}
                    {onRemove && (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onRemove(item.id)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
