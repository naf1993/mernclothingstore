import Cart from "../models/cartModels.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};



const addToCart = catchAsync(async (req, res, next) => {
  const { cart } = req.body;
  const { _id } = req.user;
 console.log('this is req user ',_id)
  let products = [];
  const user = await User.findById(_id);
  const alreadyAddedproduct = await Cart.findOne({ user: user._id });
  if (alreadyAddedproduct) {
    alreadyAddedproduct.remove();
  }
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i].productId;
    let totalCount = await Product.findById(cart[i].productId).select('countInStock').exec()
   
    object.count = cart[i].count;
    if(totalCount < object.count){
      return next(new AppError("Sorry no enough stock", 404));
    }

    object.color = cart[i].color;
    if(cart[i].hasOwnProperty('size'))
    {
      object.size = cart[i].size
    }
  
    let getPrice = await Product.findById(cart[i].productId).select("price").exec();
    object.price = getPrice.price;
    products.push(object);
  }
  
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  let newCart = await new Cart({
    products,
    cartTotal,
    user: user?._id,
  }).save();
  res.status(201).json({
    status: "success",
    data: {
      newCart,
    },
  });
});

const getUserCart = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const cart = await Cart.findOne({ user: _id }).populate(
    "user products.product"
  );
  if (!cart) {
    return next(new AppError("No Cart found with that user", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

const emptyCartByUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(req.params.id);
  const cart = await Cart.findOneAndRemove({ user: _id });
  if (!cart) {
    return next(new AppError("No Cart found with that user", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export { setUserIds, addToCart, getUserCart, emptyCartByUser };
