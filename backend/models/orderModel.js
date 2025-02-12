import mongoose from "mongoose";
import Coupon from "./couponModel.js";
import { isValidPhoneNumber } from "libphonenumber-js";

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must belong to a user"],
      ref: "User",
    },
    products: [
      {
        productId: {
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
          required: [true, "A product must have price"],
        },
        total: {
          type: Number,
          required: [true, "A product must have a total price"],
        },
      },
    ],
    address: {
      fullName: {
        type: String,
        required: [true, "Please provide your name"],
      },
      houseName: String,
      contactNumber: {
        type: String,
        required: [true, "Please provide phone number"],
        validate: {
          validator: function (v) {
            return isValidPhoneNumber(v, "IN");
          },
          message: (props) => `${props.value} is not a valid phone number..Please provide Indian Phone Numbers`,
        },
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
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    refundStatus: {
      type: String,
      enum: ["Not Returned", "Returned", "Refunded"],
      default: "Not Returned",
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
        "Returned",
      ],
    },
    stripeChargeId: {
      type: String,
      required: false,
    },
    totalPrice: {
      type: Number,
      required: [true, "Please provide the total price"],
    },
    discount: {
      type: Number,
      default: 0, // Default no discount
    },
    discountCode: String,
    finalPrice: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      default: function () {
        return this.paymentMethod === "Cash on Delivery" ? 60 : 0;
      },
    },
    deliveredDate: {
      type: Date,
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    refundAmount: {
      type: Number,
    },
    deliveryEstimate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for paymentStatus and orderStatus
orderSchema.pre("save", async function (next) {
  if (this.isModified("paymentStatus")) {
    if (this.paymentStatus === "Paid" && this.orderStatus !== "Delivered") {
      this.orderStatus = "Processing";
    }
  }

  if (
    this.paymentMethod === "Cash on Delivery" &&
    this.orderStatus === "Delivered"
  ) {
    this.paymentStatus = "Paid";
  }

  // Handle the first order discount (20% discount for first-time orders)
  const userId = this.user;
  const existingOrders = await mongoose.model("Order").find({ user: userId });

  if (existingOrders.length === 0) {
    this.discount += this.totalPrice * 0.2; // 20% discount for first-time orders
  }

  // Handle discount code (if provided)
  if (this.discountCode && this.discountCode.trim() !== "") {
    const coupon = await Coupon.findOne({ code: this.discountCode });
    if (coupon && coupon.isActive) {
      this.discount += (this.totalPrice * coupon.discount) / 100;
    } else {
      this.discountCode = null; // Invalidate invalid coupon code
    }
  }

  // Calculate the final price
  this.finalPrice = this.totalPrice - this.discount + this.shippingFee;

  next();
});

orderSchema.index({ orderId: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
