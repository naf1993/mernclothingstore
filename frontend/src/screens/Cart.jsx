import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Headings from "../components/Headings";
import CartItem from "../components/CartItem"; // Ensure you have a CartItem component
import {
  getMyCart,
  updateCartQuantity,
  removeFromCart,
} from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import toast from "react-hot-toast";
import axios from "axios";
import { checkIsFirstOrder, validateCoupon } from "../actions/orderActions";
import EmptyMessage from "../components/EmptyMessage";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({
    code: "",
    discount: 0,
  });
  
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  const [isQuantityUpdated, setIsQuantityUpdated] = useState(false);
  const { isFirstOrder } = useSelector((state) => state.order);
  const [finalPrice, setFinalPrice] = useState(subTotal ? subTotal : 0);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
    }
    dispatch(getMyCart());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/coupon`);
        console.log(data.data.coupons);
        setCoupons(data.data.coupons);
      } catch (error) {
        toast.error("Error Fetching Coupons", error.message);
        console.log(error.message);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    dispatch(checkIsFirstOrder());
  }, [dispatch]);

  useEffect(() => {
    setFinalPrice(subTotal); // Update final price when subTotal changes
  }, [subTotal]);

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

  const handleValidateCoupon = () => {
    if (!subTotal) {
      toast.error("Invalid cart amount");
      return;
    }

    dispatch(validateCoupon(selectedCoupon.code))
      .then(() => {
        toast.success("Coupon Applied");
        let priceAfterCoupon =
          subTotal - (subTotal * selectedCoupon.discount) / 100;
        if (isFirstOrder) {
          priceAfterCoupon = priceAfterCoupon - (priceAfterCoupon * 20) / 100;
        }
        setFinalPrice(priceAfterCoupon.toFixed(2));
      })
      .catch((err) => {
        toast.error("Failed to apply coupon", err.message);
      });
  };

  const handleRemoveItem = async (productId, color, size) => {
    dispatch(removeFromCart(productId, color, size))
      .then(() => {
        toast.success("Product removed from cart");
        dispatch(getMyCart());
      })
      .catch((err) => {
        toast.error(
          "Unable to remove item from cart..Plase try again later",
          err.message
        );
      });
  };
  const handleApplyCoupon = () => {
    if (couponCode === "GET20") {
      toast.success("Coupon applied successfully! You get a 20% discount.");
      setFinalPrice((subTotal - (subTotal * 20) / 100).toFixed(2));
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  const handlePasteCoupon = async () => {
    try {
      // Read text from clipboard
      const text = await navigator.clipboard.readText();
      setCouponCode(text); // Set the coupon code from clipboard into input
    } catch (err) {
      console.error("Failed to paste coupon code: ", err);
    }
  };

  const handleClick = () => {
    navigate("/placeorder", {
      state: {
        finalPrice,
        selectedCoupon,
      },
    });
  };

  return (
    <div className="page-container">
      <div className="cart-wrapper">
        {loading && <Loader />}
        {error && <Message error={error} />}
        {cartItems && cartItems.length > 0 && (
          <>
            <div className="left">
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
                  removeItem={handleRemoveItem}
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
              <div className="coupon-code-wrapper">
                <input
                  className="coupon-code"
                  type="text"
                  id="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon Code"
                />
                <button onClick={handlePasteCoupon}>Paste Code</button>
                <button onClick={handleApplyCoupon}>Apply Coupon</button>
              </div>

              <div>
                <span>Total Items In Cart</span>
                <span>{cartItems.reduce((acc, it) => acc + it.count, 0)}</span>
              </div>
              <div>
                <span>Amount</span>
                <span> ₹{subTotal.toFixed(2)}</span>
              </div>
              <div>
                <span>Any Coupon Applied</span>
                <span> {selectedCoupon ? selectedCoupon.code : "NIL"}</span>
              </div>
              <div>
                <span>Final Price</span>₹{finalPrice}
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
                    <button
                      onClick={() => {
                        setSelectedCoupon({
                          code: coupon.code,
                          discount: coupon.discount,
                        });
                      }}
                      className="right_coupon_item"
                      key={coupon._id}
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>

                {selectedCoupon && (
                  <button
                    onClick={handleValidateCoupon}
                    className="right_coupon_btn"
                  >
                    Apply Coupon
                  </button>
                )}
              </div>
            </div>
          </>
        )}
        {cartItems && cartItems.length === 0 && (
          <EmptyMessage message="Your Cart is empty..." />
        )}
      </div>
    </div>
  );
};

export default Cart;
