import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";

import { listProductDetails } from "../actions/productActions";
import ColorButton from "../components/ui/ColorButton";
import ProductImage from "../components/ProductImage";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useNavigate();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const [images, setImages] = useState([]);

  useEffect(() => {
   
    if(id){
      dispatch(listProductDetails(id));
    }
    
  }, [dispatch,id]);

  useEffect(() => {
    if (product) {
      setImages((images) => [...images, product.imageCover]);
      let newArr = [];
    
      if (product.images) {
        product.images.forEach((image)=>{
          newArr.push(image)
        })
        setImages((images) => [...images, ...newArr]);
      }
     
    }
  }, [product,product.images]);

  const [selectedColor, setSelectedColor] = useState("");
  const handleColor = (color) => {
    setSelectedColor(color);
  };

  return (
    <>
     {loading ? (<Loader/>) : error ? (<Message severity='error' error={error}/>): (product && (
      <div className="product-detail-wrapper">
        <div className="detail-wrapper">
          <div className="productdisplay-left">
          <ProductImage images={images}/>
          </div>

          <div className="productdisplay-right">
          <h2 className="product-category">{product.SubCategory && product.SubCategory.name}</h2>
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


          </div>
       
        </div>
       
      </div>
     ))}
      {/* {loading ? (<Loader/>) :error? ( <Message severity="error" error={error} />):(
   <div className="product-detail-wrapper">
   //   <div className="detail-wrapper">
   //     <div className="productdisplay-left">
   //       <ProductImage images={images} />
   //     </div>
   //     <div className="productdisplay-right">
   //       <h2 className="product-category">{product.SubCategory.name}</h2>
   //       <h1 className="product-name">{product.name}</h1>
   //       <Rating value={product.ratingsAverage} text={""} />
   //       {product.colors && <h4 className="product-color">COLORS</h4>}
   //       {product.colors && (
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
          
           <span className="btn-title">Add to Cart</span>
         </button>

         <p>Estimated Delivery Time: 21 November - 28 November</p>
         <h4 className="product-details">Product Details</h4>
         <p>Product Details: 8834941</p>
         <p>Return within "30 days". For detailed information, Click.</p>
         <p>Fabric Info: 100% BARKCLOTH</p>
       </div>

       <div className="product-display-mobile">
         <MobileDisplay
           product={product}
           options={selectOptions}
           handleSelect={handleChange}
           ifSize={ifSize}
           handleClick={handleClick}
           ref={childRef}
         />
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
    
   )} */}
    </>
  );
};

export default ProductDetail;
