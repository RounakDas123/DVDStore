import React,{use, useState} from 'react';
import { TbCurrencyRupee } from "react-icons/tb";
import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import classes from './Home.module.css';
import Wishlistbutton from "../../buttons/Wishlistbutton";
import Cartbutton from "../../buttons/Cartbutton";
import { cardbuttonsActions } from '../../store';

function Overview({movie, onClick }) {
  const dispatch = useDispatch();
  const  [toggleSymbol, setToggleSymbol] = useState({
    cart : false,
    heart : false
  });
  const cartBadgeValue = useSelector(state => state.cardbuttons.cartCounter);
  const wishlishBadgeValue = useSelector(state => state.cardbuttons.wishlistCounter);
  const value = {cart:cartBadgeValue, heart:wishlishBadgeValue};
  console.log(value);

  const changeColor = (identifier) =>{
    toast.success(`You have clicked ${identifier} !`);

    setToggleSymbol((prevValues)=>{
        var toggle,prevValue ;

        if(prevValues.heart===false && prevValues.cart===false)
        {
            dispatch(cardbuttonsActions.increment(identifier)); //only increment will happen for 1st time

            toggle = !prevValues[identifier];
            return ({
                ...prevValues,
                [identifier]: toggle
            });
        }
        else if(prevValues.heart===true && prevValues.cart===false)
        {
            if(identifier==="heart")
            {
                dispatch(cardbuttonsActions.decrement(identifier));
                toggle = !prevValues[identifier];
                return ({
                    ...prevValues,
                    [identifier]: toggle
                });
            }
            else{
                dispatch(cardbuttonsActions.increment("cart"));
                dispatch(cardbuttonsActions.decrement("heart"));
                return ({
                    ...prevValues,
                    cart: true,
                    heart: false
                });
            }
        }
        else if(prevValues.heart===false && prevValues.cart===true)
            {
                if(identifier==="cart")
                {
                    dispatch(cardbuttonsActions.decrement(identifier));
                    toggle = !prevValues[identifier];
                    return ({
                        ...prevValues,
                        [identifier]: toggle
                    });
                }
                else{
                    dispatch(cardbuttonsActions.increment("heart"));
                    dispatch(cardbuttonsActions.decrement("cart"));
                    return ({
                        ...prevValues,
                        cart: false,
                        heart: true
                    });
                }
            }
            

        });
    };


  return (
    <div className={classes.overview}>
            <div className={classes.text}>
              {movie.overview}
            </div>
            <span style={{fontSize : "12px",fontFamily: '"Times New Roman", Times, serif'}}>
            <a href="#" onClick={(e) => onClick(e, movie.id)}>Know more</a>
            </span>
            <hr></hr>
            <span style={{float:"left",marginTop: "5px"}}> 
              <TbCurrencyRupee className={classes.currency}></TbCurrencyRupee> 
              <span className={classes["currency-value"]}>{(100.00).toFixed(2)}</span>
            </span>
            <div style={{float:"right"}}>
            <button className={classes["card-button"]}>
             <Wishlistbutton toggleHeart={toggleSymbol.heart} changeColor={changeColor}/>
            </button>
            <button className={classes["card-button"]}>
              <Cartbutton toggleCart={toggleSymbol.cart} changeColor={changeColor}/>
            </button>
            </div>
          </div>
  )
};

export default Overview;