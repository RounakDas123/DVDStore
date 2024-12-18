import React,{useEffect, useState, useCallback} from "react";
import { TbCurrencyRupee } from "react-icons/tb";
import {BrowserRouter as Router} from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import classes from './Home.module.css';
import Wishlistbutton from "../../buttons/Wishlistbutton";
import Cartbutton from "../../buttons/Cartbutton";
import MainNavigation from '../../navbar/pages/MainNavigation';

const Home = () => {

  const [movieList, setMovieList]= useState([]);


  const settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1
  };

  const getMovie = ()=>{
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=d987bb3825166942aa314c4768160995')
    .then(res => res.json())
    .then(json => setMovieList(json.results));
  }

  const getColor = (vote) =>{
    if(vote >= 8)
      return 'green';
    else if(vote>=5 && vote<8)
      return 'orange';
    else
      return 'red';
  }

  useEffect(()=>{
    getMovie();
  },[]);


  console.log(movieList);

  return (
    <>
    <Router>
      <MainNavigation />
    </Router>
    <div className={classes["container-carousel"]}>
      <div className={classes.overall}>
      <Slider {...settings}>  
      {
      movieList.map((movie)=>(
        <div className={classes.movie}>
          
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" title={movie.title} className={classes.image} />

          <div className={classes["movie-info"]}>
            <h3 className={classes.title}>{movie.title}</h3> 
            <span className={classes[`${getColor(movie.vote_average)}`]}>{(movie.vote_average).toFixed(1)}</span>
          </div>

          <div className={classes.overview}>
            <div className={classes.text}>
              {movie.overview}
            </div>
            <span style={{fontSize : "12px",fontFamily: '"Times New Roman", Times, serif'}}>
            <a href="https://google.com" >Know more</a>
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
          </div>
           
        </div>
      )
    )
    }
    </Slider>
      </div>
    </div>
    </>
)
};

export default Home;
