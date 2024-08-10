import mongoose from "mongoose";
import validator from "validator";


let ItemSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must containe a product"],
      ref: "Product",
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    count: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must belong to a user"],
      ref: "User",
    },
    products: [ItemSchema],
    subTotal: {
      default: 0,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
