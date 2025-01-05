import React,{useState,useRef} from "react";
import { motion } from "framer-motion";
import { IoMdCart } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { TbCurrencyRupee } from "react-icons/tb";

import ConfirmationModal from "./ConfirmationModal";
import classes from "./Wishlist.module.css";

const Wishlist = () => {
   const userId =Number(JSON.parse(localStorage.getItem('userinfo')).id);
   const token =localStorage.getItem('token');

   const [selectedItem, setSelectedItem] = useState(null); // To store the clicked item for modal
   const [actionType, setActionType] = useState(""); // To determine the modal context
   const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
   const modalRef = useRef();

   const handleCartClick = (item) => {
     setSelectedItem(item); // Set the selected item for modal
     setActionType("cart");
     if (modalRef.current) modalRef.current.open(); // Open the modal
   };

   const handleDeleteClick = (item) => {
    setSelectedItem(item); // Set the selected item for modal
    setActionType("delete");
    if (modalRef.current) modalRef.current.open(); // Open the modal
  };

   const handleWishlistUpdate = () => {
    const updatedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(updatedWishlist);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 }, // Start with opacity 0 and move from the right
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, type: "spring", stiffness: 100 },
    }),
  };

  return (
    <div className={classes.wishlistContainer}>
    <div className={classes.header}>
        <button className={classes.refreshButton} onClick={handleWishlistUpdate}>
          <LuRefreshCw /> Refresh
        </button>
      </div>
    {wishlist.length === 0 ? (
          <div className={classes.emptyMessage}>
            Wishlist is empty! Please add something!
          </div>
        ) :
    (<div className={classes.wishlist}>
      {wishlist.map((item, index) => (
        <motion.div
          className={classes.wishlistItem}
          key={item.id}
          custom={index} // Pass the index for staggered animation
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className={classes.type}>{item.type.toUpperCase()}</div>
          <div className={classes.title}>{item.title}</div>
          <div className={classes.price}><TbCurrencyRupee/>{item.price}</div>
          <div className={classes.actions}>
            <IoMdCart className={classes.icon} onClick={() => handleCartClick(item)} />
            <MdDeleteForever className={classes.icon} onClick={() => handleDeleteClick(item)}/>
          </div>
        </motion.div>
      ))}
    </div>)}

    <ConfirmationModal
    ref={modalRef}
    item={selectedItem}
    userId={userId}
    token={token}
    onWishlistUpdate={handleWishlistUpdate}
    actionType={actionType}
    />

    </div>
  );
};

export default Wishlist;
