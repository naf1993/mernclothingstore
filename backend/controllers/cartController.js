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
  const { productId, color, size } = req.body;
  const count = Number.parseInt(req.body.count);
  const { _id } = req.user;

  //get user cart
  let cart = await Cart.findOne({ user: req.user._id });
  const productDetails = await Product.findById(productId);

  if (cart) {
    //check product exist in cart
    let itemIndex = cart.products.findIndex((p) => p.productId == productId);
    console.log("hello");
    if (itemIndex > -1) {
      //if product exists

      let productItem = cart.products[itemIndex];
      productItem.count = cart.products[itemIndex].count + count;
      productItem.price = productDetails.price;
      productItem.total = cart.products[itemIndex].count * productDetails.price;
      cart.products[itemIndex] = productItem;
      cart.subTotal = cart.products
        .map((item) => item.total)
        .reduce((acc, curr) => acc + curr);
    } else {
      let total = parseInt(productDetails.price * count);
      console.log("new product");
      cart.products.push({
        productId,
        count,
        color,
        size,
        price: productDetails.price,
        total: total,
      });
      cart.subTotal = cart.products
        .map((item) => item.total)
        .reduce((acc, curr) => acc + curr);
    }
    await updateStock(productId, count);
    cart = await cart.save();

    res.status(201).json({
      status: "success",
      data: {
        cart,
      },
    });
  } else {
    let total = parseInt(productDetails.price * count);
    let subTotal = parseInt(productDetails.price * count);

    const newCart = await Cart.create({
      user: _id,
      products: [
        {
          productId,
          count: count,
          color: color,
          size: size,
          total: total,
          price: productDetails.price,
        },
      ],
      subTotal: subTotal,
    });
    await updateStock(productId, count);
    res.status(201).json({
      status: "success",
      data: {
        newCart,
      },
    });
  }
});

export const removeItemFromCart = catchAsync(async (req, res, next) => {
  const productId = req.body.productId;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("No Cart found with that user", 404));
  }
  let itemIndex = cart.products.findIndex((p) => p.productId == productId);
  

  if (itemIndex > -1) {
    let total = cart.products[itemIndex].total
    console.log(total)
    cart.summary -= total
    cart.products.splice(itemIndex, 1);
    cart = await cart.save();
    res.status(200).json({
      status: "success",
      data: {
        updatedCart: cart,
      },
    });
  }
});
// const addToCart = catchAsync(async (req, res, next) => {
//   const { productId, color, size, count } = req.body;
//   const { _id } = req.user;
//   const user = await User.findById(_id);
//   const product = await Product.findById(productId);
//   const getPrice = await Product.findById(productId).select("price");
//   const price = getPrice.price * count;
//   console.log(price);

//   await updateStock(productId, count);

//   const cart = await new Cart({
//     color: color,
//     user: user,
//     product: product,
//     count: count,
//     size: size,
//     price: price,
//   }).save();
//   res.status(201).json({
//     status: "success",
//     data: {
//       cart,
//     },
//   });
// });

// let products = [];

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
  const cart = await Cart.find({ user: req.user._id });

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
  const query = { user: req.user._id };
  await Cart.remove(query);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const deleteAllCart = catchAsync(async (req, res, next) => {
  await Cart.deleteMany({});
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateStock = async (id, count) => {
  const product = await Product.findById(id);
  product.countInStock -= count;
  await product.save({ validateBeforeSave: false });
};

export { setUserIds, addToCart, getUserCart, emptyCartByUser };
