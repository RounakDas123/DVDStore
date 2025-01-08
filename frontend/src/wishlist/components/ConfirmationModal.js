import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { cardbuttonsActions, wishlistCartActions } from "../../store/index";
import classes from "./ConfirmationModal.module.css";

const ConfirmationModal = forwardRef(
  ({ item, userId, token, onWishlistUpdate, actionType }, ref) => {
    const dialog = useRef();
    const dispatch = useDispatch();
    useImperativeHandle(ref, () => ({
      open() {
        if (dialog.current) dialog.current.showModal();
      },
      close() {
        if (dialog.current) dialog.current.close();
      },
    }));

    const closeModal = () => {
      if (dialog.current) dialog.current.close();
    };

    const handleYes = async () => {
      try {
        if (actionType === "cart") {
          const responseAdd = await fetch(
            `http://localhost:5000/api/cart/add/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: item.id,
                type: item.type,
                title: item.title,
                price: item.price,
                quantity: 1,
              }),
            }
          );
          const responseDataAdd = await responseAdd.json();
          if (!responseDataAdd.ok && !responseDataAdd.cart) {
            toast.error(responseDataAdd.message);
            return;
          }
          toast.success(responseDataAdd.message);

          // Remove from Wishlist API call
          const responseRemove = await fetch(
            `http://localhost:5000/api/wishlist/delete/${userId}/${item.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseDataRemove = await responseRemove.json();
          if (!responseDataRemove.ok && !responseDataRemove.removedItem) {
            toast.error(responseDataRemove.message);
            return;
          }
          toast.success(responseDataRemove.message);

          let size = 0;
          size = responseDataAdd.cart.movie_tv.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          localStorage.setItem("cartSize", size);
          dispatch(
            cardbuttonsActions.setInitialValue({ type: "cart", value: size })
          );

          localStorage.setItem(
            "cart",
            JSON.stringify(responseDataAdd.cart.movie_tv)
          );
          dispatch(
            wishlistCartActions.setInitialValue({
              type: "cart",
              value: responseDataAdd.cart.movie_tv,
            })
          );

          localStorage.setItem(
            "wishlistSize",
            responseDataRemove.wishlist.movie_tv.length
          );
          dispatch(
            cardbuttonsActions.setInitialValue({
              type: "wishlist",
              value: responseDataRemove.wishlist.movie_tv.length,
            })
          );

          localStorage.setItem(
            "wishlist",
            JSON.stringify(responseDataRemove.wishlist.movie_tv)
          );
          dispatch(
            wishlistCartActions.setInitialValue({
              type: "wishlist",
              value: responseDataRemove.wishlist.movie_tv,
            })
          );
        } else if (actionType === "delete") {
          const response_remove = await fetch(
            `http://localhost:5000/api/wishlist/delete/${userId}/${item.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const responseData_remove = await response_remove.json();
          if (!responseData_remove.ok && !responseData_remove.removedItem) {
            toast.error(responseData_remove.message);
            return;
          }
          toast.success(responseData_remove.message);

          localStorage.setItem(
            "wishlistSize",
            responseData_remove.wishlist.movie_tv.length
          );
          dispatch(
            cardbuttonsActions.setInitialValue({
              type: "wishlist",
              value: responseData_remove.wishlist.movie_tv.length,
            })
          );

          localStorage.setItem(
            "wishlist",
            JSON.stringify(responseData_remove.wishlist.movie_tv)
          );
          dispatch(
            wishlistCartActions.setInitialValue({
              type: "wishlist",
              value: responseData_remove.wishlist.movie_tv,
            })
          );
        }

        onWishlistUpdate();
        closeModal();
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    };
    const modalMessage =
      actionType === "cart"
        ? "If you add to Cart, it will be removed from Wishlist. Do you wish to proceed?"
        : "Do you wish to delete from Wishlist?";

    return createPortal(
      <dialog ref={dialog} className={classes.modal}>
        <h2>Confirmation</h2>
        <p>{modalMessage}</p>
        <div className={classes.buttonGroup}>
          <button className={classes.yesButton} onClick={handleYes}>
            Yes
          </button>
          <button className={classes.noButton} onClick={closeModal}>
            No
          </button>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default ConfirmationModal;
