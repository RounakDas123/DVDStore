import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import { RiHeart3Fill } from "react-icons/ri";
import { TbCurrencyRupee } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cardbuttonsActions, wishlistCartActions } from "../../store";
import ConfirmationModalCart from "../components/ConfirmationModalCart";
import styles from "./Cart.module.css";

const Cart = () => {
  const userId = Number(JSON.parse(localStorage.getItem("userinfo")).id);
  const token = localStorage.getItem("token");
  const modalRef = useRef();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const handleQuantityChange = async (id, identifier) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/update/${userId}/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier }),
        }
      );
      const responseData = await response.json();
      if (!responseData.ok && !responseData.cart) {
        toast.error(responseData.message);
        return;
      }

      let size = 0;
      size = responseData.cart.movie_tv.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      localStorage.setItem("cart", JSON.stringify(responseData.cart.movie_tv));
      dispatch(
        wishlistCartActions.setInitialValue({
          type: "cart",
          value: responseData.cart.movie_tv,
        })
      );
      localStorage.setItem("cartSize", size);
      dispatch(
        cardbuttonsActions.setInitialValue({ type: "cart", value: size })
      );

      setCart(responseData.cart.movie_tv);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleIconClick = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    if (modalRef.current) modalRef.current.open();
  };

  const handleCheckout = () => {
    setActionType("checkout");
    if (modalRef.current) modalRef.current.open();
  };

  const rowVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCartUpdate = () => {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(updatedCart);
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.header}>
        <button className={styles.refreshButton} onClick={handleCartUpdate}>
          <LuRefreshCw /> Refresh
        </button>
      </div>
      {cart.length === 0 ? (
        <div className={styles.emptyMessage}>
          Cart is empty! Please add something!
        </div>
      ) : (
        <div className={styles.cartContainerinside}>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className={styles.cartItem}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.itemDetails}>
                  <p className={styles.itemType}>{item.type.toUpperCase()}</p>
                  <p className={styles.itemTitle}>{item.title}</p>
                </div>
                <div className={styles.itemControls}>
                  <button
                    className={styles.counterButton}
                    onClick={() => handleQuantityChange(item.id, "decrease")}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.counterButton}
                    onClick={() => handleQuantityChange(item.id, "increase")}
                  >
                    +
                  </button>
                </div>
                <p className={styles.itemPrice}>
                  <TbCurrencyRupee />
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                <RiHeart3Fill
                  className={styles.icon}
                  onClick={() => handleIconClick(item, "wishlist")}
                />
                <MdDeleteForever
                  className={`${styles.icon} ${styles.deleteIcon}`}
                  onClick={() => handleIconClick(item, "delete")}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className={styles.totalContainer}>
            <h3>
              Total: <TbCurrencyRupee />
              {totalPrice.toFixed(2)}
            </h3>
          </div>
          <div className={styles.checkoutContainer}>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}

      <ConfirmationModalCart
        ref={modalRef}
        item={selectedItem}
        userId={userId}
        token={token}
        onCartUpdate={() =>
          setCart(JSON.parse(localStorage.getItem("cart")) || [])
        }
        actionType={actionType}
      />
    </div>
  );
};

export default Cart;
