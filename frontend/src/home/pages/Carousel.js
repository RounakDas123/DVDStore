import React, {useRef, useEffect, useState} from 'react';
import { useSelector} from 'react-redux';
import Slider from "react-slick";
import { TbCurrencyRupee } from "react-icons/tb";
import { useDispatch } from 'react-redux';

import classes from './Home.module.css';
import Wishlistbutton from "../../buttons/Wishlistbutton";
import Cartbutton from "../../buttons/Cartbutton";
import {movieDetailsActions} from '../../store/index';
import DetailsModal from "./DetailsModal";
import Overview from './Overview';


function Carousel({movieList, type, modalType}) {
    
    const dispatch = useDispatch();
    const showHomeMovieDetails = useSelector(state => state.movieDetails.showHomeMovieDetails);
    const showSearchMovieDetails = useSelector(state => state.movieDetails.showSearchMovieDetails);
    const showSearchTvDetails = useSelector(state => state.movieDetails.showSearchTvDetails);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    console.log(showHomeMovieDetails, showSearchMovieDetails, showSearchTvDetails);

    const dialog = useRef();
    const dialog_homemov = useRef();
    const dialog_searchmov = useRef();
    const dialog_searchtv = useRef();


    useEffect(() => {
    if (showHomeMovieDetails && dialog_homemov.current) {
      dialog_homemov.current.open();
    }
    else if (showSearchMovieDetails && dialog_searchmov.current) {
      dialog_searchmov.current.open();
    }
    else if (showSearchTvDetails && dialog_searchtv.current) {
      dialog_searchtv.current.open();
    }
      
  }, [showHomeMovieDetails,showSearchMovieDetails,showSearchTvDetails]);

    const settings = {
        dots: false,
        lazyLoad: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
      };

      const getColor = (vote) =>{
        if(vote >= 8)
          return 'green';
        else if(vote>=5 && vote<8)
          return 'orange';
        else
          return 'red';
      }
      const openModal = (event, movieId)=>{
        event.preventDefault();
        setSelectedMovieId(movieId);
        dispatch(movieDetailsActions.openModal(modalType));
      };

  return (
    <>
    <DetailsModal ref={modalType === "homemovie" ? dialog_homemov : modalType === "searchmovie" ? dialog_searchmov 
      : modalType === "searchtv" ? dialog_searchtv : null} movieid={selectedMovieId} type={type} modalType={modalType}/>
    <div className={classes["container-carousel"]}>
      
      <Slider {...settings}>  
      {
      movieList.map((movie)=>(
        <div className={classes.movie} key={movie.id}>
          
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" title={movie.title} className={classes.image} />

          <div className={classes["movie-info"]}>
            <h3 className={classes.title}>{movie.title}</h3> 
            <span className={classes[`${getColor(movie.vote_average)}`]}>{(movie.vote_average).toFixed(1)}</span>
          </div>

          {/* <div className={classes.overview}>
            <div className={classes.text}>
              {movie.overview}
            </div>
            <span style={{fontSize : "12px",fontFamily: '"Times New Roman", Times, serif'}}>
            <a href="#" onClick={(e) => openModal(e, movie.id)}>Know more</a>
            </span>
            <hr></hr>
            <span style={{float:"left",marginTop: "5px"}}> 
              <TbCurrencyRupee className={classes.currency}></TbCurrencyRupee> 
              <span className={classes["currency-value"]}>{(100.00).toFixed(2)}</span>
            </span>
            <div style={{float:"right"}}>
            <button className={classes["card-button"]}>
             <Wishlistbutton />
            </button>
            <button className={classes["card-button"]}>
              <Cartbutton />
            </button>
            </div>
          </div> */}
          <Overview movie={movie} type={type} onClick={openModal}/>
           
        </div>
      )
    )
    }
    </Slider>
      
    </div>
    </>
  )
};

export default Carousel;