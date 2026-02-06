import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import { getProductThumbnailUrl } from "@/lib/cloudinary";

const SingleItem = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item.id));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 overflow-hidden">
              <Image src={getProductThumbnailUrl(item.imgs?.thumbnails?.[0] || '/images/products/product-placeholder.png')} alt={item.title} width={80} height={80} className="object-contain" />
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <a href="#"> {item.title} </a>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[205px]">
        <p className="text-dark">Rs. {item.discountedPrice.toLocaleString()}</p>
      </div>

      <div className="min-w-[265px]">
        <div className="flex items-center gap-1.5">
          {item.stock > 0 ? (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0.5C4.75 0.5 0.5 4.75 0.5 10C0.5 15.25 4.75 19.5 10 19.5C15.25 19.5 19.5 15.25 19.5 10C19.5 4.75 15.25 0.5 10 0.5ZM10 18.1C5.55 18.1 1.9 14.45 1.9 10C1.9 5.55 5.55 1.9 10 1.9C14.45 1.9 18.1 5.55 18.1 10C18.1 14.45 14.45 18.1 10 18.1Z" fill="#22AD5C" />
                <path d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z" fill="#22AD5C" />
              </svg>
              <span className="text-green text-custom-sm font-medium">In Stock</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0.5C4.75 0.5 0.5 4.75 0.5 10C0.5 15.25 4.75 19.5 10 19.5C15.25 19.5 19.5 15.25 19.5 10C19.5 4.75 15.25 0.5 10 0.5ZM10 18.1C5.55 18.1 1.9 14.45 1.9 10C1.9 5.55 5.55 1.9 10 1.9C14.45 1.9 18.1 5.55 18.1 10C18.1 14.45 14.45 18.1 10 18.1Z" fill="#F23030" />
                <path d="M13.6875 12.6875L8.125 7.125C7.84375 6.84375 7.40625 6.84375 7.125 7.125C6.84375 7.40625 6.84375 7.84375 7.125 8.125L12.6875 13.6875C12.9688 13.9688 13.4063 13.9688 13.6875 13.6875C13.9688 13.4062 13.9688 12.9688 13.6875 12.6875Z" fill="#F23030" />
                <path d="M7.125 12.6875L12.6875 7.12501C12.9688 6.84376 13.4063 6.84376 13.6875 7.12501C13.9688 7.40626 13.9688 7.84376 13.6875 8.12501L8.125 13.6875C7.84375 13.9688 7.40625 13.9688 7.125 13.6875C6.84375 13.4063 6.84375 12.9688 7.125 12.6875Z" fill="#F23030" />
              </svg>
              <span className="text-red text-custom-sm font-medium">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <button
          onClick={() => handleAddToCart()}
          className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
