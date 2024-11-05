import React from "react";

const CartItem = ({
  color,
  productName,
  price,
  total,
  count,
  size,
  productImg,
  addQuantity,
  subQuantity,
  productId,
}) => {
  const handleDecreseQuantity = () => {
    console.log("decreasing ");
  };
  const handleIncreaseQuantity = () => {
    console.log("increasing");
  };
  return (
    <div className="cart-item">
      <img src={productImg} alt={productName} />
      <h6 className="cart-item__heading">{productName}</h6>
      <div className="cart-item__color">
        <span>Color</span>
        <div style={{ backgroundColor: color }}></div>
      </div>
      <h6 className="cart-item__size">Size: {size}</h6>
      <div className="cart-item__qty">
        <span>Quantity:</span>
        <button
          disabled={count < 1}
          className="cart-item__qty-btn"
          onClick={() => subQuantity(productId, color, size)}
        >
          -
        </button>
        <span>{count}</span>
        <button
          className="cart-item__qty-btn"
          onClick={() => addQuantity(productId, color, size)}
        >
          +
        </button>
      </div>
      <div className="cart-item__price">
        <span>Price:</span>
        <h6>${price}</h6>
      </div>
      <div className="cart-item__price">
        <span>Total:</span>
        <h6>${total}</h6>
      </div>
    </div>
  );
};

export default CartItem;
