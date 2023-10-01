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
        count: Number,
        color: String,
        size:Number
      },
    ],
    address:{
      fullName:{ type: String,required: [true, "Please provide your name"]},
      streetName:{ type: String,required: [true, "Please provide street name"]},
      city:{ type: String,required: [true, "Please provide city name"]},
      country:{ type: String,required: [true, "Please provide country name"]},
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentIntent: {},
    totalPrice:Number,
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
