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
  const {productId,color,size,count} = req.body
  const {_id} = req.user
  const user = await User.findById(_id)
  const product = await Product.findById(productId)
  const cart = await new Cart({
    color:color,
    user:user,
    product:product,
    count:count,
    size:size
  })
  res.status(201).json({
    status:'success',
    data:{
      cart
    }
  })
});

  // let products = [];
  //
  // const alreadyAddedproduct = await Cart.findOne({ user: user._id });
  // if (alreadyAddedproduct) {
  //   alreadyAddedproduct.remove();
  // }
  // for (let i = 0; i < cart.length; i++) {
  //   let object = {};
  //   object.product = cart[i].productId;
  //   let totalCount = await Product.findById(cart[i].productId).select('countInStock').exec()

  //   object.count = cart[i].count;
  //   if(totalCount < object.count){
  //     return next(new AppError("Sorry no enough stock", 404));
  //   }

  //   object.color = cart[i].color;
  //   if(cart[i].hasOwnProperty('size'))
  //   {
  //     object.size = cart[i].size
  //   }

  //   let getPrice = await Product.findById(cart[i].productId).select("price").exec();

  //   object.price = getPrice.price;
  //   products.push(object);
  // }

  // let cartTotal = 0;
  // for (let i = 0; i < products.length; i++) {
  //   cartTotal = cartTotal + products[i].price * products[i].count;
  // }


 



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
