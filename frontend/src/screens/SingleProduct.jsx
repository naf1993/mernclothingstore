import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MobileScreenDetails from "../components/MobileScreenDetails";
import LargeScreenDetails from "../components/LargeScreenDetails";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState({});

  const [selectOptions, setSelectOptions] = useState([]);
  const [ifSize, setifSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  const [colorErr, setColorErr] = useState(null);
  const [sizeErr, setSizeErr] = useState(null);
  const [images, setImages] = useState([]);
  const [isMobile,setIsMobile] = useState(false)

  useEffect(()=>{
    console.log('parent rendered')
        },[])
  const getSingleProduct = async (id) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
     
      setProduct(data.data.product);
      setLoading(false);
     
      setImages((images) => [...images, data.data.product.imageCover]);
      let newArr = [];
      if (data.data.product.images) {
        // newArr = data.data.product.images?.map((item) => {
        //   return item;
        // });
        data.data.product.images.forEach((image)=>{
          newArr.push(image)
        })
        //setImages((images) => [...images, ...newArr]);
        setImages([data.data.product.imageCover,...newArr])
      }

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
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleProduct(id);
    }
  }, [id]);

  const options = [];

  const handleChange = (selectedOption) => {
    setSelectedSize(selectedOption.value);
  };



  const handleColor = (color) => {
    setSelectedColor(color);
  };

  

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
    dispatch(createCart(cart));
  };

  const handleScreenSize = () => {
    if(window.innerWidth < 400){
      setIsMobile(true)
    }
    else{
      setIsMobile(false)
    }
  }

  useEffect(()=>{
    window.addEventListener('resize',handleScreenSize)
  })

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
                <ProductImage images={images} />
              </div>

              <div className="productdisplay-right">
                <h2 className="product-category">
                  {product.SubCategory && product.SubCategory.name}
                </h2>
                <h1 className="product-name">{product.name}</h1>
                <Rating value={product.ratingsAverage} text={""} />

                {isMobile ? (<MobileScreenDetails onSizeChange={handleChange} sizeOptions={selectOptions && selectOptions} colors={product.colors && product.colors } onHandleColor={handleColor} ifSize={ifSize && ifSize} />) : 
                (<LargeScreenDetails onSizeChange={handleChange} sizeOptions={selectOptions && selectOptions} colors={product.colors && product.colors } onHandleColor={handleColor} ifSize={ifSize && ifSize} />)}

               
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
               
                {sizeErr !== "" && <p className="text-danger">{sizeErr}</p>}

               
                <button
                  type="submit"
                  className="submit-btn"
                  onClick={() => addToCart(product.id)}
                >
                  <span className="btn-title">Add to Cart</span>
                </button>
                       <p>Estimated Delivery Time: 21 November - 28 November</p>
             
              </div>
            </div>
            {/* <div className="related-products">
            <RelatedProducts
                categoryId={product.Category.id}
                productId={product.id}
                categoryName={product.Category.name}
              />
            </div>

            <div className="reviews-container">
              <ReviewsList product={product} reviews={product.reviews} />
            </div> */}

          </div>
        )

       

    
        //    </div>
        //    <div className="related-products">
        //      <RelatedProducts
        //        categoryId={product.Category.id}
        //        productId={product.id}
        //        categoryName={product.Category.name}
        //      />
        //    </div>

        //    <div className="reviews-container">
        //      <ReviewsList product={product} reviews={product.reviews} />
        //    </div>
        //  </div>
        //     )
      )}
    </>
  );
};

export default SingleProduct;
