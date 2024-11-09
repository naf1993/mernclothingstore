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

  // Get user cart
  let cart = await Cart.findOne({ user: _id }).populate("products.productId"); // Populate product details
  const productDetails = await Product.findById(productId);

  if (!productDetails) {
    return next(new AppError("Product not found", 404));
  }

  if (cart) {
    // Check if product exists in cart with same color and size
    const itemIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size
    );

    if (itemIndex > -1) {
      // If product exists, update count and total
      const productItem = cart.products[itemIndex];
      productItem.count += count;
      productItem.total = productItem.count * productDetails.price;
      cart.products[itemIndex] = productItem;
    } else {
      // If new product, push it to the products array
      const total = productDetails.price * count;
      cart.products.push({
        productId,
        count,
        color,
        size,
        price: productDetails.price,
        total: total,
      });
    }

    // Recalculate subtotal
    cart.subTotal = cart.products.reduce((acc, item) => acc + item.total, 0);
    await cart.save();

    // Re-populate the cart to include the updated product details
    cart = await cart.populate("products.productId");

    return res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } else {
    // Create new cart if none exists
    const total = productDetails.price * count;
    const newCart = await Cart.create({
      user: _id,
      products: [
        {
          productId,
          count,
          color,
          size,
          price: productDetails.price,
          total,
        },
      ],
      subTotal: total,
    });
    await newCart.populate("products.productId"); // Populate product details

    return res.status(201).json({
      status: "success",
      data: {
        cart: newCart,
      },
    });
  }
});

export const updateCartQuantity = catchAsync(async (req, res, next) => {
  const { productId, color, size, action } = req.body;
  console.log(productId, action, color, size);
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "products.productId"
  );
  if (!cart) {
    return next(new AppError("No Product found in cart", 404));
  }
  let cartItem = cart.products.find(
    (item) =>
      item.productId._id.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );

  if (action === "subtract" && cartItem.count > 1) {
    cartItem.count -= 1;
    cartItem.total = cartItem.count*cartItem.price
  } else if (action === "add") {
    cartItem.count += 1;
    cartItem.total = cartItem.count*cartItem.price
  } else {
    return next(new AppError("Unknown action", 404));
  }
  await cart.save();
  console.log('this is cart after updating qty',cart)

  res.status(200).json({
    status: "success",
    data: {
      cart: cart,
    },
  });
});

export const removeItemFromCart = catchAsync(async (req, res, next) => {
  const { productId, color, size } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("No Cart found with user", 404));
  }
  let itemIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.color === color &&
      p.size === size
  );
  if (itemIndex > -1) {
    let total = cart.products[itemIndex].total;
    cart.subTotal -= total;
    cart.products.splice(itemIndex, 1);
    cart = await cart.save();

    res.status(200).json({
      status: "success",
      data: {
        cart: cart,
      },
    });
  } else {
    return next(new AppError("Item not found in cart", 404));
  }
});

const getUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user._id }).populate(
    "products.productId"
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
  const query = { user: req.user._id };
  await Cart.deleteMany(query);

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
