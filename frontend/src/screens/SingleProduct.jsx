import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import Select from "react-select";
import ProductImage from "../components/ProductImage";
import MobileDisplay from "../components/MobileDisplay";
import RelatedProducts from "../components/RelatedProducts";
import ReviewsList from "../components/ReviewsList";
import { createCart } from "../actions/cartActions";
const SingleProduct = () => {
  const { id } = useParams();
  const childRef = useRef(null);

  const dispatch = useDispatch();
  const history = useNavigate();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const [selectOptions, setSelectOptions] = useState([]);
  const [ifSize, setifSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [colorErr, setColorErr] = useState(null);
  const [sizeErr, setSizeErr] = useState(null);

  const options = [];
  const images = [];
  images.push(product.imageCover);

  if (product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      images.push(product.images[i]);
    }
  }

  const handleChange = (selectedOption) => {
    setSelectedSize(selectedOption.value);
  };

  useEffect(() => {
    dispatch(listProductDetails(`${id}`));
  }, [dispatch]);

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleColor = (color) => {
    setSelectedColor(color);
  };

  async function fetchSizes() {
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${id}`
    );
    const sizes = data.data.product.size;

    if (sizes[0] === 0) {
      setSelectOptions([]);
      setifSize(false);
    } else {
      setifSize(true);
      sizes.forEach((size) => {
        options.push({
          value: size,
          label: size,
        });
      });

      setSelectOptions([...options]);
    }
  }

  let cart = { productId: "", color: "", size: "", count: 1 };

  const addToCart = (id) => {
    if (selectedColor && !selectedSize) {
      cart = {
        productId: id,
        color: selectedColor,
        size: "",
      };
    }
    if (selectedColor && selectedSize) {
      cart = {
        productId: id,
        color: selectedColor,
        size: selectedSize,
      };
    } else {
      if (!selectedColor) {
        setColorErr("Please Select Color");
      } else {
        setColorErr("");
      }
      if (ifSize && !selectedSize) {
        setSizeErr("Please Select Size");
      } else {
        setSizeErr("");
      }
    }
    dispatch(createCart(cart))
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error" error={error} />
      ) : (
        <div className="product-detail-wrapper">
          <div className="detail-wrapper">
            <div className="productdisplay-left">
              <ProductImage images={images} />
            </div>
            <div className="productdisplay-right">
              <h2 className="product-category">{product.SubCategory.name}</h2>
              <h1 className="product-name">{product.name}</h1>
              <Rating value={product.ratingsAverage} text={""} />
              {product.colors && <h4 className="product-color">COLORS</h4>}
              {product.colors && (
                <div className="buttons-wrapper">
                  {product.colors?.map((color, index) => (
                    <span key={index} className="filter-color-btn">
                      <button
                        value={color}
                        type="submit"
                        onClick={() => handleColor(color)}
                        style={{
                          backgroundColor: `${color}`,
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
              {colorErr !== "" && (
                <p
                  style={{
                    color: "#ffa07a",
                    padding: "0.4rem 0rem",
                    borderRadius: "5px",
                  }}
                >
                  {colorErr}
                </p>
              )}

              {ifSize && <h4 className="product-size">SIZE</h4>}
              {ifSize && (
                <Select
                  isClearable={true}
                  options={selectOptions}
                  defaultValue={{ label: "Select Size", value: 0 }}
                  onChange={handleChange}
                />
              )}
              {sizeErr !== "" && <p className="text-danger">{sizeErr}</p>}

              <button
                type="submit"
                className="submit-btn"
                onClick={() => addToCart(product.id)}
              >
                {/* <CiShoppingCart
                  className="addcart-icon"
                  style={{ width: "1.2rem", height: "1.2rem" }}
                /> */}
                <span className="btn-title">Add to Cart</span>
              </button>

              <p>Estimated Delivery Time: 21 November - 28 November</p>
              <h4 className="product-details">Product Details</h4>
              <p>Product Details: 8834941</p>
              <p>Return within "30 days". For detailed information, Click.</p>
              <p>Fabric Info: 100% BARKCLOTH</p>
            </div>

            <div className="product-display-mobile">
              {/* <MobileDisplay
                product={product}
                options={selectOptions}
                handleSelect={handleChange}
                ifSize={ifSize}
                handleClick={handleClick}
                ref={childRef}
              /> */}
            </div>
          </div>
          <div className="related-products">
            <RelatedProducts
              categoryId={product.Category.id}
              productId={product.id}
              categoryName={product.Category.name}
            />
          </div>

          <div className="reviews-container">
            <ReviewsList product={product} reviews={product.reviews} />
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
