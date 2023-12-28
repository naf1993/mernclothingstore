import mongoose from "mongoose";
import validator from "validator";

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must belong to a user"],
      ref: "User",
    },
    product:{
      type: mongoose.Schema.Types.ObjectId,
          required: [true, "An order must containe a product"],
          ref: "Product",
    },
    count:{
      type:Number,
      default:1
    },
    color:{
      type:String
    },
    size:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
