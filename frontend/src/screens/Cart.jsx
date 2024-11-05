import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Headings from "../components/Headings";
import CartItem from "../components/CartItem"; // Ensure you have a CartItem component
import { getMyCart, updateCartQuantity } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { products:cartItems, subTotal, loading, error } = useSelector(
    (state) => state.cart
  );
  
  const { isAuthenticated } = user;

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
    }
    dispatch(getMyCart());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(()=>{
    if(cartItems){
      console.log(cartItems)
    }
  },[cartItems])

  const handleQuantityChange = (productId, color, size, action) => {
    // Dispatch update cart quantity
    dispatch(updateCartQuantity(productId, color, size, action));

    // Fetch the updated cart after quantity change
    dispatch(getMyCart()); // Refresh the cart to reflect the new quantity
  };

  return (
    <div className="cart-container">
      <div className="heading">
        <Headings>Your Cart</Headings>
      </div>
      <div className="cart-wrapper">
        <div className="left">
          {loading && <Loader />}
          {error && <Message error={error} />}
          {cartItems?.map((item,index) => (
            <CartItem
              key={index}
              productId={item.productId}
              color={item.color}
              total={item.total} price={item.price}
              count={item.count}
              size={item.size || ""}
              productName={item.name}
              productImg={item.image}
              addQuantity={(productId, color, size) =>
                handleQuantityChange(productId, color, size, "add")
              }
              subQuantity={(productId, color, size) =>
                handleQuantityChange(productId, color, size, "subtract")
              }
            />
          ))}
        </div>
        <div className="right">
          <h3>Total Price: ${subTotal.toFixed(2)}</h3>
          <button onClick={() => console.log("Place Order")}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
