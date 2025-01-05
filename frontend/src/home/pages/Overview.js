import React,{useEffect, useState} from 'react';
import { TbCurrencyRupee } from "react-icons/tb";
import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import classes from './Home.module.css';
import Wishlistbutton from "../../buttons/Wishlistbutton";
import Cartbutton from "../../buttons/Cartbutton";
import { cardbuttonsActions, wishlistCartActions } from '../../store';

function Overview({movie, type, onClick }) {
  const dispatch = useDispatch();
  const  [toggleSymbol, setToggleSymbol] = useState({
    cart : false,
    wishlist : false
  });
  const cartBadgeValue = useSelector(state => state.cardbuttons.cartCounter);
  const wishlishBadgeValue = useSelector(state => state.cardbuttons.wishlistCounter);
  const value = {cart:cartBadgeValue, wishlist:wishlishBadgeValue};
  console.log(value);
  const userId =Number(JSON.parse(localStorage.getItem('userinfo')).id);
  const token =localStorage.getItem('token');
  const wishlistItems = JSON.parse(localStorage.getItem('wishlist'));
  const cartItems = JSON.parse(localStorage.getItem('cart'));

  console.log("wishlistItems:", wishlistItems);
  console.log("cartItems:", cartItems);
  console.log("movie.id:", movie.id);

  // Check if the movie is already in the wishlist
  useEffect(() => {
    const isItemInWishlist = wishlistItems.some(item => item.id === movie.id);
    const isItemInCart = cartItems.some(item => item.id === movie.id);
  
    setToggleSymbol(prev => {
      // Avoid updating state unnecessarily to prevent re-renders
      if (prev.wishlist === isItemInWishlist && prev.cart === isItemInCart) {
        return prev; // No changes needed
      }
  
      return {
        wishlist: isItemInWishlist,
        cart: isItemInCart,
      };
    });
  }, [wishlistItems, cartItems, movie.id]);
  var itemPrice = type === "movie" ? 100.00 : 200.00;
  var title = type === "movie" ? movie.title : movie.name;

  const changeColor = async (identifier) =>{

    const currentWishlist = toggleSymbol.wishlist;
    const currentCart = toggleSymbol.cart;

        if(currentWishlist===false && currentCart===false)
        {
            //fetch
            try{
              const bodyData = {
                id: movie.id,
                type: type,
                title: title,
                price: itemPrice
              };
              if (identifier === 'cart') {
                bodyData.quantity = 1; 
              }
              const response_add = await fetch(`http://localhost:5000/api/${identifier}/add/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(bodyData)
              });
              const responseData_add = await response_add.json();
                  console.log(responseData_add);
                  if(!responseData_add.ok && (!responseData_add[identifier]))
                  { 
                     toast.error(responseData_add.message);
                     return;
                  }           
                 toast.success(responseData_add.message); 
                 let size = 0;
                 if (identifier === 'cart') {
                   size = responseData_add.cart.movie_tv.reduce((sum, item) => sum + Number(item.quantity), 0);
                 } else if (identifier === 'wishlist') {
                   size = responseData_add.wishlist.movie_tv.length;
                 }
                 console.log("both are false: ", size);
                 console.log("both are false: ", responseData_add);
                localStorage.setItem(`${identifier}Size`, size );
                dispatch(cardbuttonsActions.setInitialValue({type:`${identifier}`, value:size }));
                
                localStorage.setItem(`${identifier}`, JSON.stringify(responseData_add[identifier].movie_tv));
                dispatch(wishlistCartActions.setInitialValue({type:`${identifier}`, value:responseData_add[identifier].movie_tv}));
            }
            catch(err)
            {
              console.log(err);
            }

            setToggleSymbol(prevValues => ({
              ...prevValues,
              [identifier]: !prevValues[identifier]
            }));

        }
        else if(currentWishlist===true && currentCart===false)
        {
            if(identifier==="wishlist")
            { // /api/wishlist/delete/5/939243
              try{
                const response_remove = await fetch(`http://localhost:5000/api/${identifier}/delete/${userId}/${movie.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Authorization': 'Bearer '+token
                  }
                });
                const responseData_remove = await response_remove.json();
                    console.log(responseData_remove);
                    if(!responseData_remove.ok && (!responseData_remove.removedItem))
                    { 
                       toast.error(responseData_remove.message);
                       return;
                    }           
                   toast.success(responseData_remove.message); 
  
                  localStorage.setItem(`${identifier}Size`, responseData_remove[identifier].movie_tv.length );
                  dispatch(cardbuttonsActions.setInitialValue({type:`${identifier}`, value:responseData_remove[identifier].movie_tv.length}));
                  
                  localStorage.setItem(`${identifier}`, JSON.stringify(responseData_remove[identifier].movie_tv));
                  dispatch(wishlistCartActions.setInitialValue({type:`${identifier}`, value:responseData_remove[identifier].movie_tv}));
              }
              catch(err)
              {
                console.log(err);
              }

                setToggleSymbol(prevValues => ({
                  ...prevValues,
                  [identifier]: !prevValues[identifier]
                }));

            }
            else{
              try{
                const response_add = await fetch(`http://localhost:5000/api/cart/add/${userId}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+token
                  },
                  body: JSON.stringify({
                    id: movie.id,
                    type: type,
                    title: title,
                    price: itemPrice,
                    quantity: 1
                  })
                });
                const responseData_add = await response_add.json();
                    console.log(responseData_add);
                    if(!responseData_add.ok && (!responseData_add.cart))
                    { 
                       toast.error(responseData_add.message);
                       return;
                    }           
                   toast.success(responseData_add.message); 

                   let size = 0;
                   size = responseData_add.cart.movie_tv.reduce((sum, item) => sum + item.quantity, 0);
  
                  localStorage.setItem('cartSize', size );
                  dispatch(cardbuttonsActions.setInitialValue({type:'cart', value:size }));

                  localStorage.setItem('cart', JSON.stringify(responseData_add.cart.movie_tv));
                  dispatch(wishlistCartActions.setInitialValue({type:'cart', value:responseData_add.cart.movie_tv}));
  
              }
              catch(err)
              {
                console.log(err);
              }

              try{
                const response_remove = await fetch(`http://localhost:5000/api/wishlist/delete/${userId}/${movie.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Authorization': 'Bearer '+token
                  }
                });
                const responseData_remove = await response_remove.json();
                    console.log(responseData_remove);
                    if(!responseData_remove.ok && (!responseData_remove.removedItem))
                    { 
                       toast.error(responseData_remove.message);
                       return;
                    }           
                   toast.success(responseData_remove.message); 
  
                  localStorage.setItem('wishlistSize', responseData_remove.wishlist.movie_tv.length );
                  dispatch(cardbuttonsActions.setInitialValue({type:'wishlist', value:responseData_remove.wishlist.movie_tv.length}));

                  localStorage.setItem('wishlist', JSON.stringify(responseData_remove.wishlist.movie_tv));
                  dispatch(wishlistCartActions.setInitialValue({type:'wishlist', value:responseData_remove.wishlist.movie_tv}));
              }
              catch(err)
              {
                console.log(err);
              }

                setToggleSymbol(prevValues => ({
                  ...prevValues,
                  cart: true,
                  wishlist: false
                }));

            }
        }
        else if(currentWishlist===false && currentCart===true)
            {
                if(identifier==="cart")
                {
                  try{
                    const response_remove = await fetch(`http://localhost:5000/api/${identifier}/delete/${userId}/${movie.id}`, {
                      method: 'DELETE',
                      headers: {
                          'Authorization': 'Bearer '+token
                      }
                    });
                    const responseData_remove = await response_remove.json();
                        console.log(responseData_remove);
                        if(!responseData_remove.ok && (!responseData_remove.removedItem))
                        { 
                           toast.error(responseData_remove.message);
                           return;
                        }           
                       toast.success(responseData_remove.message); 

                       let size = 0;
                       size = responseData_remove[identifier].movie_tv.reduce((sum, item) => sum + item.quantity, 0); 
      
                      localStorage.setItem(`${identifier}Size`, size );
                      dispatch(cardbuttonsActions.setInitialValue({type:`${identifier}`, value:size }));
                      
                      localStorage.setItem(`${identifier}`, JSON.stringify(responseData_remove[identifier].movie_tv));
                      dispatch(wishlistCartActions.setInitialValue({type:`${identifier}`, value:responseData_remove[identifier].movie_tv}));
                  }
                  catch(err)
                  {
                    console.log(err);
                  }

                    setToggleSymbol(prevValues => ({
                      ...prevValues,
                      [identifier]: !prevValues[identifier]
                    }));
                }
                else{
                  try{
                    const response_add = await fetch(`http://localhost:5000/api/wishlist/add/${userId}`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer '+token
                      },
                      body: JSON.stringify({
                        id: movie.id,
                        type: type,
                        title: title,
                        price: itemPrice
                      })
                    });
                    const responseData_add = await response_add.json();
                        console.log(responseData_add);
                        if(!responseData_add.ok && (!responseData_add.wishlist))
                        { 
                           toast.error(responseData_add.message);
                           return;
                        }           
                       toast.success(responseData_add.message); 
      
                      localStorage.setItem('wishlistSize', responseData_add.wishlist.movie_tv.length );
                      dispatch(cardbuttonsActions.setInitialValue({type:'wishlist', value:responseData_add.wishlist.movie_tv.length}));

                      localStorage.setItem('wishlist', JSON.stringify(responseData_add.wishlist.movie_tv));
                      dispatch(wishlistCartActions.setInitialValue({type:'wishlist', value:responseData_add.wishlist.movie_tv}));
      
                  }
                  catch(err)
                  {
                    console.log(err);
                  }
    
                  try{
                    const response_remove = await fetch(`http://localhost:5000/api/cart/delete/${userId}/${movie.id}`, {
                      method: 'DELETE',
                      headers: {
                          'Authorization': 'Bearer '+token
                      }
                    });
                    const responseData_remove = await response_remove.json();
                        console.log(responseData_remove);
                        if(!responseData_remove.ok && (!responseData_remove.removedItem))
                        { 
                           toast.error(responseData_remove.message);
                           return;
                        }           
                       toast.success(responseData_remove.message); 

                       let size = 0;
                       size = responseData_remove.cart.movie_tv.reduce((sum, item) => sum + item.quantity, 0);
      
                      localStorage.setItem('cartSize', size );
                      dispatch(cardbuttonsActions.setInitialValue({type:'cart', value:size }));

                      localStorage.setItem('cart', JSON.stringify(responseData_remove.cart.movie_tv));
                      dispatch(wishlistCartActions.setInitialValue({type:'cart', value:responseData_remove.cart.movie_tv}));
                  }
                  catch(err)
                  {
                    console.log(err);
                  }
                    setToggleSymbol(prevValues => ({
                      ...prevValues,
                      cart: false,
                      wishlist: true
                    }));
                }
            }
            
    };


  return (
    <div className={classes.overview}>
            <div className={classes.text}>
              {movie.overview}
            </div>
            <span style={{fontSize : "12px",fontFamily: '"Times New Roman", Times, serif'}}>
            <a href="#" onClick={onClick}>Know more</a>
            </span>
            <hr></hr>
            <span style={{float:"left",marginTop: "5px"}}> 
              <TbCurrencyRupee className={classes.currency}></TbCurrencyRupee> 
              <span className={classes["currency-value"]}>{(itemPrice).toFixed(2)}</span>
            </span>
            <div style={{float:"right"}}>
            <button className={classes["card-button"]}>
             <Wishlistbutton toggleHeart={toggleSymbol.wishlist} changeColor={changeColor}/>
            </button>
            <button className={classes["card-button"]}>
              <Cartbutton toggleCart={toggleSymbol.cart} changeColor={changeColor}/>
            </button>
            </div>
          </div>
  )
};


export default Overview;