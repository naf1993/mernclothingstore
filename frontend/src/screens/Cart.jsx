import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Headings from "../components/Headings";
import CartItem from "../components/CartItem"; // Ensure you have a CartItem component
import { getMyCart, updateCartQuantity,removeFromCart } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import toast from "react-hot-toast";
import axios from "axios";
import { validateCoupon } from "../actions/orderActions";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({
    code: "",
    discount: 0,
  });

  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  const [isQuantityUpdated, setIsQuantityUpdated] = useState(false);
  const [finalPrice, setFinalPrice] = useState(Number(subTotal));

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
    dispatch(validateCoupon(selectedCoupon.code))
      .then(() => {
        toast.success("Coupon Applied");
        setFinalPrice(
          (subTotal - (subTotal * selectedCoupon.discount) / 100).toFixed(2)
        );
      })
      .catch((err) => {
        toast.error("Failed to apply coupon", err.message);
      });
  };

  const handleClick = () => {
    navigate("/placeorder", {
      state: {
        finalPrice,
        selectedCoupon
      },
    });
  };

  const handleRemoveItem = async (productId,color,size) => {
    dispatch(removeFromCart(productId, color, size))
      .then(() => {
        toast.success("Product removed from cart");
        dispatch(getMyCart())
      })
      .catch((err) => {
        toast.error(
          "Unable to remove item from cart..Plase try again later",
          err.message
        );
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
          {cartItems && cartItems.length === 0 && <p>cartitems empty</p>}
          {error && <Message error={error} />}
          {cartItems && cartItems.length > 0 && cartItems?.map((item, index) => (
            <CartItem
              key={index}
              productId={item.productId}
              color={item.color}
              total={item.total}
              price={item.price}
              count={item.count}
              size={item.size || ""}
              productName={item.name}
              productImg={item.image} removeItem={handleRemoveItem}
              addQuantity={(productId, color, size) =>
                handleQuantityChange(productId, color, size, "add")
              }
              subQuantity={(productId, color, size) =>
                handleQuantityChange(productId, color, size, "subtract")
              }
            />
            ))}
        </div>
        {cartItems && cartItems.length > 0 && (
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
             <span> {selectedCoupon ? selectedCoupon.code : "NIL"}</span>
           </div>
           <div>
             <span>Final Price</span>
             {finalPrice}
           </div>
 
           <button className="right_coupon_btn-checkout" onClick={handleClick}>
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
        )}
       
      </div>
    </div>
  );
};

export default Cart;
