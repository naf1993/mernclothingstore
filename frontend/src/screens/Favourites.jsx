import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFavourites } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import Headings from "../components/Headings";

const Favourites = () => {
  const dispatch = useDispatch();
  const { isLoading, error, favourites } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getFavourites());
  }, [dispatch]);

  return (
    <>
      <div className="favourites-container">
      <div className="heading">
        <Headings>Favourites</Headings>
      </div>
        <div className="favourites-products">
          {isLoading && <Loader />}
          {error && <Message error={error} />}
          {favourites && favourites.length === 0 && <p>No Favourites</p>}
          {favourites &&
            favourites.length > 0 &&
            favourites?.map((product) => (
              <Product key={product.id} product={product} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Favourites;
