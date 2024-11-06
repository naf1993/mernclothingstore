import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';  // Assuming you have a Loader component
import { createNewOrder } from '../actions/orderActions';
import { getMyCart } from '../actions/cartActions';
import Headings from '../components/Headings';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading:loadingCart,
    error:errorCart,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  // const { order, loading, error } = useSelector((state) => state.order);

  const [shippingFee] = useState(60); // Example shipping fee
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [finalPrice, setFinalPrice] = useState(subTotal + shippingFee);

  const [address, setAddress] = useState({
    fullName: '',
    streetName: '',
    city: '',
    country: '',
    postalCode: '',
  });
useEffect(()=>{
  if(isAuthenticated){
    dispatch(getMyCart())
  }
},[])
  // Recalculate final price when subtotal or shipping fee changes
  useEffect(() => {
    setFinalPrice(subTotal + shippingFee);
  }, [subTotal]);

  // const handlePlaceOrder = () => {
  //   const orderData = {
  //     products: cartItems,
  //     paymentMethod,
  //     totalPrice: subTotal,
  //     shippingFee,
  //     finalPrice,
  //     address,
  //   };
  //   dispatch(createNewOrder(orderData)); // Dispatch the action to create the order
  // };

  // Redirect if order is created successfully
  // useEffect(() => {
  //   if (order) {
  //     navigate(`/orders/${order._id}`); // Redirect to order details page (for example)
  //   }
  // }, [order, navigate]);

  // if (loading) return <Loader />;  // Show loader while order is being created
  // if (error) return <div>{error}</div>;  // Show error message if any

  return (
    <div className='place-order-container'>
       <div className="heading">
        <Headings>Order Summary</Headings>
      </div>
      <div className='place-order-wrapper'>
        <div className='place-order-wrapper__left'>
        <h3>Shipping Address</h3>
        <form>
          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street Address"
            value={address.streetName}
            onChange={(e) => setAddress({ ...address, streetName: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          />
        </form>
        </div>
        <div className='place-order-wrapper__right'>right</div>
      </div>
    </div>
    // <div className="place-order-container">
    //   <h2>Order Summary</h2>
    //   <div>
    //     <h3>Shipping Address</h3>
    //     <form>
    //       <input
    //         type="text"
    //         placeholder="Full Name"
    //         value={address.fullName}
    //         onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
    //       />
    //       <input
    //         type="text"
    //         placeholder="Street Address"
    //         value={address.streetName}
    //         onChange={(e) => setAddress({ ...address, streetName: e.target.value })}
    //       />
    //       <input
    //         type="text"
    //         placeholder="City"
    //         value={address.city}
    //         onChange={(e) => setAddress({ ...address, city: e.target.value })}
    //       />
    //       <input
    //         type="text"
    //         placeholder="Country"
    //         value={address.country}
    //         onChange={(e) => setAddress({ ...address, country: e.target.value })}
    //       />
    //       <input
    //         type="text"
    //         placeholder="Postal Code"
    //         value={address.postalCode}
    //         onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
    //       />
    //     </form>
    //   </div>

    //   <div>
    //     <h3>Order Items</h3>
    //     <ul>
    //       {cartItems.map((item) => (
    //         <li key={item.product}>
    //           <div>{item.name}</div>
    //           <div>Price: ${item.price}</div>
    //           <div>Quantity: {item.count}</div>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>

    //   <div>
    //     <h3>Payment Method</h3>
    //     <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
    //       <option value="Cash on Delivery">Cash on Delivery</option>
    //       <option value="PayPal">PayPal</option>
    //       <option value="Credit Card">Credit Card</option>
    //     </select>
    //   </div>

    //   <div>
    //     <h3>Order Summary</h3>
    //     <div>Total Price: ${subTotal.toFixed(2)}</div>
    //     <div>Shipping Fee: ${shippingFee}</div>
    //     <div>Final Price: ${finalPrice.toFixed(2)}</div>
    //   </div>

    //   <button onClick={handlePlaceOrder}>Place Order</button>
    // </div>
  );
};

export default PlaceOrder;
