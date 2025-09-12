import React, { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { Cart, AddToCart } from "./components/Cart";
import { Button, Card } from "./components/UI";
import { useCartOperations } from "./hooks";
import "./App.css";

// Sample products for demo
const sampleProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 29990000,
    description: "Điện thoại thông minh cao cấp từ Apple",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 25990000,
    description: "Flagship Android với camera AI",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
  },
  {
    id: "3",
    name: "MacBook Pro M3",
    price: 49990000,
    description: "Laptop chuyên nghiệp cho developers",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
  },
  {
    id: "4",
    name: "iPad Air",
    price: 18990000,
    description: "Máy tính bảng đa năng",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
  },
];

// Product grid component
function ProductGrid() {
  const cart = useCartOperations();

  const handleAddSuccess = (addedItem) => {
    console.log("Đã thêm sản phẩm:", addedItem);
  };

  return (
    <div className="product-grid">
      <h2>Sản phẩm</h2>
      <div className="products">
        {sampleProducts.map((product) => (
          <Card
            key={product.id}
            className="product-card"
            footer={
              <AddToCart
                product={product}
                onSuccess={handleAddSuccess}
                buttonText="Thêm vào giỏ"
                buttonVariant="primary"
                buttonSize="medium"
              />
            }
          >
            <div className="product-content">
              {product.image && (
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </div>
                <div className="product-status">
                  {cart.hasItem(product.id) ? (
                    <span className="in-cart">✓ Đã có trong giỏ hàng</span>
                  ) : (
                    <span className="not-in-cart">Chưa có trong giỏ hàng</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Quick stats component
function QuickStats() {
  const cart = useCartOperations();

  return (
    <div className="quick-stats">
      <div className="stat">
        <div className="stat-number">{cart.itemCount}</div>
        <div className="stat-label">Loại sản phẩm</div>
      </div>
      <div className="stat">
        <div className="stat-number">{cart.totalItems}</div>
        <div className="stat-label">Tổng số lượng</div>
      </div>
      <div className="stat">
        <div className="stat-number">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(cart.totalPrice)}
        </div>
        <div className="stat-label">Tổng tiền</div>
      </div>
    </div>
  );
}

// Demo actions component
function DemoActions() {
  const cart = useCartOperations();
  const [showAddModal, setShowAddModal] = useState(false);

  const addRandomProduct = () => {
    const randomProduct =
      sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    cart.addItem({
      ...randomProduct,
      quantity: Math.floor(Math.random() * 3) + 1,
    });
  };

  return (
    <div className="demo-actions">
      <h3>Demo Actions</h3>
      <div className="action-buttons">
        <Button variant="secondary" onClick={addRandomProduct}>
          Thêm sản phẩm ngẫu nhiên
        </Button>

        <Button variant="outline" onClick={() => setShowAddModal(true)}>
          Thêm sản phẩm tùy chỉnh
        </Button>

        <Button
          variant="danger"
          onClick={() => cart.clearCart()}
          disabled={cart.isEmpty}
        >
          Xóa tất cả
        </Button>
      </div>

      <AddToCart
        showModal={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => setShowAddModal(false)}
      />
    </div>
  );
}

// Main demo app content
function DemoApp() {
  const handleCheckout = (cartSummary) => {
    alert(
      `Thanh toán thành công!\nTổng tiền: ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(cartSummary.totalPrice)}`
    );
  };

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1>React Cart Library Demo</h1>
        <p>
          Thư viện React cho chức năng giỏ hàng với các component UI chuẩn hóa
        </p>
        <QuickStats />
      </header>

      <div className="demo-content">
        <div className="demo-left">
          <ProductGrid />
          <DemoActions />
        </div>

        <div className="demo-right">
          <div className="cart-container">
            <Cart
              onCheckout={handleCheckout}
              showClearButton={true}
              maxHeight="500px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Root app with provider
function App() {
  return (
    <CartProvider persistToLocalStorage={true}>
      <DemoApp />
    </CartProvider>
  );
}

export default App;
