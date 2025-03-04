import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cardbuttonsActions, wishlistCartActions } from "../../store";
import styles from "./ConfirmationModalCart.module.css";

const ConfirmationModalCart = forwardRef(
  ({ item, userId, token, onCartUpdate, actionType }, ref) => {
    const dialog = useRef();
    const dispatch = useDispatch();
    var modalMessage = "";
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
        if (actionType === "checkout") {
          const responseRemove = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/cart/checkout/${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseDataRemove = await responseRemove.json();
          if (!responseDataRemove.ok && !responseDataRemove.cart) {
            toast.error(responseDataRemove.message);
            return;
          }
          toast.success(responseDataRemove.message);

          let size = 0;
          size = responseDataRemove.cart.movie_tv.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          localStorage.setItem("cartSize", size);
          dispatch(
            cardbuttonsActions.setInitialValue({ type: "cart", value: size })
          );

          localStorage.setItem(
            "cart",
            JSON.stringify(responseDataRemove.cart.movie_tv)
          );
          dispatch(
            wishlistCartActions.setInitialValue({
              type: "cart",
              value: responseDataRemove.cart.movie_tv,
            })
          );
        } else {
          if (actionType === "wishlist") {
            const responseAdd = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/wishlist/add/${userId}`,
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
                }),
              }
            );
            const responseDataAdd = await responseAdd.json();
            if (!responseDataAdd.ok && !responseDataAdd.wishlist) {
              toast.error(responseDataAdd.message);
              return;
            }
            toast.success(responseDataAdd.message);

            // Remove from Cart API call
            const responseRemove = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/cart/delete/${userId}/${item.id}`,
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
            size = responseDataRemove.cart.movie_tv.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            localStorage.setItem("cartSize", size);
            dispatch(
              cardbuttonsActions.setInitialValue({ type: "cart", value: size })
            );

            localStorage.setItem(
              "cart",
              JSON.stringify(responseDataRemove.cart.movie_tv)
            );
            dispatch(
              wishlistCartActions.setInitialValue({
                type: "cart",
                value: responseDataRemove.cart.movie_tv,
              })
            );

            localStorage.setItem(
              "wishlistSize",
              responseDataAdd.wishlist.movie_tv.length
            );
            dispatch(
              cardbuttonsActions.setInitialValue({
                type: "wishlist",
                value: responseDataAdd.wishlist.movie_tv.length,
              })
            );

            localStorage.setItem(
              "wishlist",
              JSON.stringify(responseDataAdd.wishlist.movie_tv)
            );
            dispatch(
              wishlistCartActions.setInitialValue({
                type: "wishlist",
                value: responseDataAdd.wishlist.movie_tv,
              })
            );
          } else if (actionType === "delete") {
            const response_remove = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/cart/delete/${userId}/${item.id}`,
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

            let size = 0;
            size = responseData_remove.cart.movie_tv.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            localStorage.setItem("cartSize", size);
            dispatch(
              cardbuttonsActions.setInitialValue({ type: "cart", value: size })
            );

            localStorage.setItem(
              "cart",
              JSON.stringify(responseData_remove.cart.movie_tv)
            );
            dispatch(
              wishlistCartActions.setInitialValue({
                type: "cart",
                value: responseData_remove.cart.movie_tv,
              })
            );
          }
        }
        onCartUpdate();
        closeModal();
      } catch (err) {
        console.error(err.message);
        toast.error("An error occurred. Please try again.");
      }
    };

    if (actionType === "checkout") {
      modalMessage = "Do you wish to Checkout?";
    } else if (actionType === "wishlist") {
      modalMessage =
        "If you add to Wishlist, it will be removed from Cart. Do you wish to proceed?";
    } else if (actionType === "delete") {
      modalMessage = "Do you wish to delete this item from Cart?";
    }

    return createPortal(
      <dialog ref={dialog} className={styles.modal}>
        <h2>Confirmation</h2>
        <p>{modalMessage}</p>
        <div className={styles.buttonGroup}>
          <button className={styles.yesButton} onClick={handleYes}>
            Yes
          </button>
          <button className={styles.noButton} onClick={closeModal}>
            No
          </button>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default ConfirmationModalCart;
