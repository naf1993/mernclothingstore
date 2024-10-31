import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MobileScreenDetails from "../components/MobileScreenDetails";
import LargeScreenDetails from "../components/LargeScreenDetails";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import ProductImage from "../components/ProductImage";
import RelatedProducts from "../components/RelatedProducts";
import ReviewsList from "../components/ReviewsList";
import {
  listProductDetails,
  getColors,
  getRelatedProducts,
} from "../actions/productActions";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.product);
  const {
    loading: loadingRelated,
    error: errorRelated,
    relatedProducts,
  } = useSelector((state) => state.product);
  useEffect(() => {
    if (id) {
      console.log("dispatching");
      dispatch(listProductDetails(id));
    } else {
      console.log("no id provided");
    }
  }, [id, dispatch]);

  const navigate = useNavigate();

  const [colors, setColors] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [isSize, setiSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [valid, setIsValid] = useState(false);

  const [colorErr, setColorErr] = useState(null);
  const [sizeErr, setSizeErr] = useState(null);

  const { colors: allColors } = useSelector((state) => state.product);

  const [isMobile, setIsMobile] = useState(false);
  let categoryId, productId;

  useEffect(() => {
    if (product) {
      console.log("dispatching getColors");
      dispatch(getColors());
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product && product.Category) {
      const productId = product._id;
      const categoryId = product.Category._id;
      console.log("this is product id", productId);
      console.log("this is category id", categoryId);
      dispatch(getRelatedProducts(productId, categoryId));
    }
  }, [product, dispatch]);



  useEffect(() => {
    let options = [];
    if (product) {
      if (product?.sizes?.length === 0) {
        setiSize(false);
      }
      if (product.sizes && product.sizes.length > 0) {
        setiSize(true);
        product.sizes.forEach((size) => {
          options.push({
            value: size,
            label: size,
          });
        });
        setSizeOptions([...options]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product && product.colors && allColors && allColors.length > 0) {
      let uniqueColors = allColors.filter((color) =>
        product.colors.includes(color)
      );
      setColors(uniqueColors);
    }
  }, [product, product.colors, allColors, allColors.length]);

  const { cartItems } = useSelector((state) => state.cart);

  const options = [];

  const handleChange = (selectedOption) => {
    setSelectedSize(selectedOption.value);
  };

  const handleColor = (color) => {
    setSelectedColor(color);
    console.log(color);
    setIsValid(true);
  };

  const goToCart = () => {
    navigate("/cart");
  };

  // const addToCart = (id) => {
  //   let color = "";
  //   let size = "";
  //   if (selectedColor && !selectedSize) {
  //     color = selectedColor;
  //     size = "";
  //   }
  //   if (selectedColor && selectedSize) {
  //     color = selectedColor;
  //     size = selectedSize;
  //   } else {
  //     if (!selectedColor) {
  //       setColorErr("Please Select Color");
  //     } else {
  //       setColorErr("");
  //     }
  //     if (isSize && !selectedSize) {
  //       setSizeErr("Please Select Size");
  //     } else {
  //       setSizeErr("");
  //     }
  //   }

  //   dispatch(createCart(id, color, size));
  //   navigate("/cart");
  // };
  // const buyNow = () => {
  //   addToCart(id);
  //   navigate("/shipping");
  // };

  const handleScreenSize = () => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleScreenSize);
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error" error={error} />
      ) : (
        product && (
          <div className="product-detail-wrapper">
            <div className="detail-wrapper">
              <div className="productdisplay-left">
                {Array.isArray(product.images) &&
                  product?.images?.length > 0 && (
                    <ProductImage images={product.images} />
                  )}
              </div>

              <div className="productdisplay-right">
                <h2 className="product-category">
                  {product.SubCategory && product.SubCategory.name}
                </h2>
                <h1 className="product-name">{product.name}</h1>
                <Rating value={product.ratingsAverage} text={""} />

                {isMobile ? (
                  <MobileScreenDetails
                    onSizeChange={handleChange}
                    sizeOptions={sizeOptions}
                    colors={colors}
                    onHandleColor={handleColor}
                    ifSize={isSize && isSize}
                    setColorErr={setColorErr}
                    colorErr={colorErr}
                    setSizeErr={setSizeErr}
                    sizeErr={sizeErr}
                  />
                ) : (
                  <LargeScreenDetails
                    onSizeChange={handleChange}
                    sizeOptions={sizeOptions}
                    colors={product.colors}
                    onHandleColor={handleColor}
                    ifSize={isSize}
                    setColorErr={setColorErr}
                    colorErr={colorErr}
                    setSizeErr={setSizeErr}
                    sizeErr={sizeErr}
                  />
                )}

                <div className="btn-container">
                  {/* {product.countInStock > 1 && (
                    <button
                      type="submit"
                      className="submit-btn"
                      onClick={() =>
                        cartItems &&
                        cartItems.some((item) => item.product === product.id)
                          ? goToCart
                          : addToCart(product.id)
                      }
                    >
                      <span className="btn-title">
                        {cartItems &&
                        cartItems.some((item) => item.product === product.id)
                          ? "Go to cart"
                          : "add to cart"}
                      </span>
                    </button>
                  )} */}
                </div>

                <p>
                  Estimated Delivery Date:{" "}
                  {new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="related-products">
              {loadingRelated && <Loader />}
              {errorRelated && <Message error={error} />}
              {relatedProducts && relatedProducts.length > 0 && (
                <RelatedProducts products={relatedProducts} categoryName={product && product.Category && product.Category.name} />
              )}
              {relatedProducts && relatedProducts.length === 0 && (
                <p>No Related Products</p>
              )}
            </div>

            <div className="reviews-container">
              {product && <ReviewsList product={product} />}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SingleProduct;
