import mongoose from "mongoose";
import validator from "validator";

const orderSchema = mongoose.Schema(
  {
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
          if (this.paymentStatus === "Failed") {
            return v === "Cancelled";
          }
          if (this.paymentStatus === "Pending") {
            return v === "Not Processed" || "Cancelled";
          }
          if (this.paymentStatus === "Paid") {
            return v === "Processing" || "Cancelled";
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

const Order = mongoose.model("Order", orderSchema);

export default Order;
