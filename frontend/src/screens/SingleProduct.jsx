import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileScreenDetails from "../components/MobileScreenDetails";
import LargeScreenDetails from "../components/LargeScreenDetails";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import ReviewsList from "../components/ReviewsList";
import {
  listProductDetails,
  getColors,
  getRelatedProducts,
} from "../actions/productActions";
import { addToCart, getMyCart } from "../actions/cartActions";
import {
  checkEligibleForReview,
  createNewReview,
} from "../actions/reviewActions";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { RiStarHalfLine } from "react-icons/ri";
import toast from "react-hot-toast";
import StarRating from "../components/StarRating";
import Product from "../components/Product";
const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, product } = useSelector((state) => state.product);
  const {
    loading: loadingRelated,
    error: errorRelated,
    relatedProducts,
  } = useSelector((state) => state.product);

  const [colors, setColors] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [isSize, setIsSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [colorErr, setColorErr] = useState(null);
  const [sizeErr, setSizeErr] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);
  const user = useSelector((state) => state.user);
  const { products:cartItems } = useSelector((state) => state.cart);
 
  const { isAuthenticated } = user;
  const {
    loading: loadingReview,
    error: errorReview,
    eligible,
  } = useSelector((state) => state.review);
  const [mainImage, setMainImage] = useState(null);
  const [isInCart, setIsInCart] = useState(false); // State to track if product was added to cart

  useEffect(() => {
    if (id) {
      dispatch(listProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      dispatch(getColors());
      const productId = product._id;
      const categoryId = product.Category?._id;
      if (categoryId) {
        dispatch(getRelatedProducts(productId, categoryId));
      }
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setIsSize(true);
      setSizeOptions(
        product.sizes.map((size) => ({ value: size, label: size }))
      );
    } else {
      setIsSize(false);
    }
  }, [product]);

  useEffect(() => {
    if (product?.colors) {
      const uniqueColors = product.colors.filter((color) => color);
      setColors(uniqueColors);
    }
  }, [product]);
  useEffect(() => {
    if (isAuthenticated && product) {
      dispatch(checkEligibleForReview(product.id));
    }
  }, [isAuthenticated, product, dispatch]);
  useEffect(() => {
    if (product) {
      if (product.images) {
        setMainImage(product.images[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('getting my cart')
      dispatch(getMyCart());
      console.log('after get my cart')
    }
  }, [isAuthenticated,dispatch]);

  useEffect(()=>{
    if(cartItems){
      console.log('these are cart items')
      console.log(cartItems)
    }
  },[cartItems])
   useEffect(() => {
   
    if (cartItems && selectedColor && (!isSize || selectedSize)) {
      console.log('Checking cart items...');
      console.log(cartItems);//getting undefined
  
      const inCart = cartItems.find((item) => {
        console.log("item.productId._id:", item.productId); // Log the product ID in the cart
        console.log("product.id (from params):", id); // Log the current product ID
        console.log("item.color:", item.color); // Log the item color in the cart
        console.log("selectedColor:", selectedColor); // Log the selected color
        console.log("item.size:", item.size); // Log the item size in the cart
        console.log("selectedSize:", selectedSize); // Log the selected size
  
        // Check if productId, color, and size (if required) match
        const productIdMatch = item.productId === id;
        const colorMatch = item.color === selectedColor;
        const sizeMatch = isSize ? item.size === selectedSize : true;
  
        console.log("productIdMatch:", productIdMatch);
        console.log("colorMatch:", colorMatch);
        console.log("sizeMatch:", sizeMatch);
  
        // Return true if all conditions match, otherwise false
        return productIdMatch && colorMatch && sizeMatch;
      });
  
      // Update the state with whether the product is in the cart
      setIsInCart(inCart);
    }
  }, [cartItems, selectedColor, selectedSize, isSize, id]);

  useEffect(()=>{
    if(isInCart){
      console.log('yes it is in cart',isInCart)
    }
  },[isInCart])
  

  const handleChange = (selectedOption) => {
    setSelectedSize(selectedOption.value);
  };

  const handleColor = (color) => {
    setSelectedColor(color);
  };

  const validateSelection = () => {
    let isValid = true;

    // Validate color
    if (!selectedColor) {
      if (colorErr !== "Please select a color") {
        setColorErr("Please select a color");
      }
      isValid = false;
    } else {
      if (colorErr !== null) {
        setColorErr(null);
      }
    }

    // Validate size
    if (isSize && !selectedSize) {
      if (sizeErr !== "Please select a size") {
        setSizeErr("Please select a size");
      }
      isValid = false;
    } else {
      if (sizeErr !== null) {
        setSizeErr(null);
      }
    }

    return isValid;
  };
 
  
  const handleAddToCart = async (id) => {
    if (!validateSelection()) {
      return; // Stop if validation fails
    }

    const color = selectedColor;
    const size = isSize ? selectedSize : ""; // Size is optional if `isSize` is false
    console.log("this is product to cart details", id, color, size);
    const inCart = cartItems?.find((item) => {
      return (
        item.productId._id === id &&
        (selectedColor ? item.color === selectedColor : true) &&
        (isSize ? item.size === selectedSize : true)
      );
    });
    if (inCart) {
      console.log("Product already in cart");
      setIsInCart(true);
      return; // Do not add the product again
    }
    try {
      await dispatch(addToCart(id, 1, color, size)); // Adjust according to your action
      dispatch(getMyCart());
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleGoToCart = () => {
    navigate("/cart"); // Navigates to the cart page
  };

  const buyNow = () => {
    if (validateSelection()) {
      addToCart(id);
      navigate("/shipping");
    }
  };

  const handleScreenSize = () => {
    setIsMobile(window.innerWidth < 400);
  };

  useEffect(() => {
    window.addEventListener("resize", handleScreenSize);
    return () => window.removeEventListener("resize", handleScreenSize);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      await dispatch(createNewReview(id, review, rating));
      toast.success("New Review Added");
      dispatch(listProductDetails(id));
    } catch (error) {
      toast.error(
        `Unable to submit review. Please try again later. Error: ${error.message}`
      );
    }
  };
  return (
    <>
      <div className="page-container">
        <div className="detail-wrapper">
          {loading && <Loader />}
          {error && <Message error={error} />}
          {product && (
            <>
              <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                  {product?.images &&
                    product?.images.length > 1 &&
                    product?.images.map((image, index) => (
                      <img
                        key={index}
                        onClick={() => setMainImage(image)}
                        src={image}
                      />
                    ))}
                </div>
                <div className="productdisplay-img">
                  <img
                    className="productdisplay-main-img"
                    src={`${mainImage}`}
                  />
                </div>
              </div>
              <div className="productdisplay-right">
                <h2 className="product-category">
                  {product.SubCategory?.name}
                </h2>
                <h1 className="product-name">{product.name}</h1>
                <StarRating rating={product.ratingsAverage} />
                <h2 className="product-price">₹{product.price}</h2>

                {isMobile ? (
                  <MobileScreenDetails
                    onSizeChange={handleChange}
                    sizeOptions={sizeOptions}
                    colors={colors}
                    onHandleColor={handleColor}
                    ifSize={isSize}
                    setColorErr={setColorErr}
                    colorErr={colorErr}
                    setSizeErr={setSizeErr}
                    sizeErr={sizeErr}
                    description={product.description}
                  />
                ) : (
                  <LargeScreenDetails
                    onSizeChange={handleChange}
                    sizeOptions={sizeOptions}
                    colors={colors}
                    onHandleColor={handleColor}
                    ifSize={isSize}
                    setColorErr={setColorErr}
                    colorErr={colorErr}
                    setSizeErr={setSizeErr}
                    sizeErr={sizeErr}
                    description={product.description}
                  />
                )}

                <div className="btn-container">
                  {product.countInStock < 5 && (
                    <button type="button" disabled className="submit-btn">
                      <span className="btn-title">Out Of Stock</span>
                    </button>
                  )}
                  {product.countInStock > 5 && (
                    <button
                      type="button"
                      className="submit-btn"
                      onClick={() => {
                        if (isInCart) {
                          console.log('already in cart')
                          handleGoToCart(); // If product is already in cart, navigate to the cart page
                        } else {
                          console.log('not in cart')
                          handleAddToCart(product.id); // If not in cart, add to cart
                        }
                      }}
                    >
                      <span className="btn-title">
                        {isInCart && 'Go to cart'}
                        {!isInCart && 'Add to cart'}
                      </span>
                    </button>
                  )}
                </div>

                <p>
                  Estimated Delivery Date:{" "}
                  {new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="related-products">
          {loadingRelated && <Loader />}
          {errorRelated && <Message error={errorRelated} />}
          {relatedProducts && relatedProducts.length > 0 && (
            <>
              <div className="heading">
                <h2>DISCOVER NEW {product?.Category?.name?.toUpperCase()}</h2>
              </div>
              <div className="products-list">
                {relatedProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
          {relatedProducts?.length === 0 && <p>No Related Products</p>}
        </div>

        <div className="reviews-container">
          {product?.reviews && product.reviews?.length > 0 && (
            <ReviewsList product={product} />
          )}
          {product?.reviews && product.reviews?.length == 0 && (
            <p style={{ textAlign: "center" }}>No Reviews yet</p>
          )}

          {eligible && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here"
                required
              />
              <div className="rating-starbtn-container">
                <div className="rating-star">
                  {[...Array(5)].map((_, index) => {
                    const fullStarValue = index + 1;
                    const halfStarValue = index + 0.5;
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() =>
                          setRating((prev) =>
                            prev === fullStarValue
                              ? fullStarValue - 0.5
                              : fullStarValue
                          )
                        }
                        className={
                          rating >= fullStarValue
                            ? "active"
                            : rating >= halfStarValue
                            ? "half-active"
                            : ""
                        }
                      >
                        {rating >= fullStarValue ? (
                          <AiFillStar />
                        ) : rating >= halfStarValue ? (
                          <RiStarHalfLine />
                        ) : (
                          <AiOutlineStar />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button className="btn-submit" type="submit">
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
