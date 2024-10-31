import React from "react";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ products,categoryName }) => {
  return (
    <>
      <div className="heading">
        <h2>DISCOVER NEW {categoryName.toUpperCase()}</h2>
      </div>

      <div className="related-products-wrapper">
        {products?.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default RelatedProducts;
