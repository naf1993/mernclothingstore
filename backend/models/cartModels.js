import mongoose from "mongoose";
import validator from "validator";

const cartSchema = mongoose.Schema(
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
          required: [true, "An order must containe a product"],
          ref: "Product",
        },
        count: Number,
        color: String,
        price:Number,
        size:Number
      },
    ],
    cartTotal:Number,
    totalAfterDiscount:Number
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
