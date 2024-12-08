import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFavourites } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import EmptyMessage from "../components/EmptyMessage";

const Favourites = () => {
  const dispatch = useDispatch();
  const { isLoading, error, favourites } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getFavourites());
  }, [dispatch]);

  return (
    <>
      <div className="page-container">
        <div className="favourites-products">
          {isLoading && <Loader />}
          {error && <Message error={error} />}
          {favourites && favourites.length > 0 && (
            <div className="products-list">
              {favourites?.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          )}

          {favourites && favourites.length === 0 && (
            <EmptyMessage message="You have not favourite product..." />
          )}
        </div>
      </div>
    </>
  );
};

export default Favourites;
