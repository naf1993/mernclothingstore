import mongoose from "mongoose";
import validator from "validator";

const orderSchema = mongoose.Schema(
  {
    orderId:{
      type:String,
      unique:true,
      required:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must belong to a user"],
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "An order must contain a product"],
          ref: "Product",
        },
        count: {
          type: Number,
          required: [true, "Please provide the quantity"],
          min: [1, "Quantity must be at least 1"],
        },
        color: String,
        size: String,
        price: {
          type: Number,
          required: [true, "Please provide the product price"],
        },
      },
    ],
    address: {
      fullName: {
        type: String,
        required: [true, "Please provide your name"],
      },
      streetName: {
        type: String,
        required: [true, "Please provide street name"],
      },
      city: {
        type: String,
        required: [true, "Please provide city name"],
      },
      country: {
        type: String,
        required: [true, "Please provide country name"],
      },
      postalCode: {
        type: String,
        required: [true, "Please provide postal code"],
      },
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Credit Card", "PayPal"], // Adjust based on your payment methods
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
      validate: {
        validator: function (v) {
          const paymentStatus = this.paymentStatus; // Store paymentStatus in a variable
          if (paymentStatus === "Failed") {
            return v === "Cancelled";
          }
          if (paymentStatus === "Pending") {
            return v === "Not Processed" || v === "Cancelled";
          }
          if (paymentStatus === "Paid") {
            return v === "Processing" || v === "Cancelled";
          }
          return false;
        },
        message: (props) =>
          `Invalid order status for payment status '${props.instance.paymentStatus}'. Current value: ${props.value}`,
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Please provide the total price"],
    },
    discount: {
      type: Number,
      default: 0, // Default no discount
    },
    discountCode: {
      type: String,
      validate: {
        validator: function (v) {
          // Add logic to check if the discount code is valid
          return v === undefined || v === null || v.length > 0; // Example validation
        },
        message: "Invalid discount code.",
      },
    },
    finalPrice: {
      type: Number,
      required: true,
      default: function () {
        return this.totalPrice - this.discount;
      },
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    deliveryEstimate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre('save',function(next){
  if(this.isModified('paymentStatus')){
    if(this.paymentStatus === 'Paid'){
      this.orderStatus = 'Processing'
     
    }
  }
  if(this.discountCode){
    const discountDetails = getDiscountDetails(this.discountCode)
    if(discountDetails){
      this.discountCode = discountDetails.amount
    }
  }
  next()
})
const getDiscountDetails = (code) => {
  const discounts = {
    "SUMMER21": { amount: 10 },
    "FREESHIP": { amount: 5 },
  };
  return discounts[code] || null; // Return null if the code is not valid
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
