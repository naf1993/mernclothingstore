import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Headings from "../components/Headings";
import CartItem from "../components/CartItem"; // Ensure you have a CartItem component
import { getMyCart, updateCartQuantity } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import toast from "react-hot-toast";
import axios from "axios";



const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState([]);
  const [seletedCoupon, setSelectedCoupon] = useState("");
  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  const [isQuantityUpdated, setIsQuantityUpdated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
    }
    dispatch(getMyCart());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/coupon");
        console.log(data.data.coupons);
        setCoupons(data.data.coupons);
      } catch (error) {
        toast.error("Error Fetching Coupons", error.message);
        console.log(error.message);
      }
    };
    fetchCoupons();
  }, []);
  const handleClick = () => {
    // Navigate directly to the PlaceOrder page
    navigate("/placeorder"); // This will go to the top-level /placeorder route
  };


  const handleQuantityChange = (productId, color, size, action) => {
    dispatch(updateCartQuantity(productId, color, size, action))
      .then(() => {
        setIsQuantityUpdated(true);
        dispatch(getMyCart());
      })
      .catch((err) => {
        toast.error("Error updating cart", err.message);
        setIsQuantityUpdated(false);
      });
  };

  return (
    <div className="cart-container">
      <div className="heading">
        <Headings>YOUR CART</Headings>
      </div>
      <div className="cart-wrapper">
        <div className="left">
          {loading && <Loader />}
          {error && <Message error={error} />}
          {cartItems?.map((item, index) => (
            <CartItem
              key={index}
              productId={item.productId}
              color={item.color}
              total={item.total}
              price={item.price}
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
          <h2>Cart Summary</h2>
          <div>
            <span>Total Items In Cart</span>
            <span>{cartItems.reduce((acc, it) => acc + it.count, 0)}</span>
          </div>
          <div>
            <span>Amount</span>
            <span> ${subTotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Any Coupon Applied</span>
            <span> {seletedCoupon ? seletedCoupon : "NIL"}</span>
          </div>
          <div>
            <span>Final Price</span>
            <span> ${subTotal.toFixed(2)}</span>
          </div>

          <button
            className="right_coupon_btn-checkout"
            onClick={handleClick}
          >
            Continue To Checkout
          </button>

          <div className="right_coupon">
            <div>
              {coupons?.map((coupon) => (
                <button onClick={()=>setSelectedCoupon(coupon.code)} className="right_coupon_item" key={coupon._id}>
                  {coupon.code}
                </button>
              ))}
            </div>

            <button  className="right_coupon_btn">Apply Coupon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
