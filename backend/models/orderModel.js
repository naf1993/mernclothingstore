import mongoose from "mongoose";
import Coupon from "./couponModel.js";

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
          required: [true, "An Product must have price"],
        },
        total: {
          type: Number,
          required: [true, "An Product must have price"],
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
          const paymentStatus = this.paymentStatus; // Access paymentStatus directly from this
          
          if (paymentStatus === "Failed") {
            return v === "Cancelled";
          }
          if (paymentStatus === "Pending") {
            return v === "Not Processed" || v === "Cancelled";
          }
          if (paymentStatus === "Paid") {
            return v === "Processing" || v === "Cancelled" || v === 'Delivered';
          }
          return false;
        },
        message: (props) =>
          `Invalid order status for payment status '${props.value}'. Current payment status: '${this.paymentStatus}'`,
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
    },
    finalPrice: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      default: function () {
        return this.paymentMethod === "Cash on Delivery" ? 60 : 0;
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

// Pre-save hook for paymentStatus and orderStatus
orderSchema.pre("save", async function (next) {
  if (this.isModified("paymentStatus")) {
    if (this.paymentStatus === "Paid" && this.orderStatus != 'Delivered') {
      this.orderStatus = "Processing";
    }
  }
  
  // If the payment method is COD and the order is delivered, automatically set the paymentStatus to Paid
  if (this.paymentMethod === 'Cash on Delivery' && this.orderStatus === 'Delivered') {
    this.paymentStatus = 'Paid';
  }

  // Handle discounts if applicable
  if (this.discountCode && this.discountCode.trim() !== "") {
    const coupon = await Coupon.findOne({ code: this.discountCode });
    if (coupon && coupon.isActive) {
      this.discount = (this.totalPrice * coupon.discount) / 100;
    } else {
      this.discountCode = null;
      this.discount = 0;
    }
    this.finalPrice = this.totalPrice - this.discount + this.shippingFee;
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
