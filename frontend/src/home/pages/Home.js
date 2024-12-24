import React,{useEffect, useState, useRef} from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import MainNavigation from '../../navbar/pages/MainNavigation';
import SearchOverlay from "./SearchOverlay";
import Carousel from "./Carousel";


const Home = () => {

  const [movieList, setMovieList]= useState([]);
  const [loader, setLoader]=  useState(true);
  

  const getMovie = ()=>{
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=d987bb3825166942aa314c4768160995')
    .then(res => res.json())
    .then(json => setMovieList(json.results));

    setLoader(false);
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
    <SearchOverlay />

    {(loader) ? (<img src="./loader.svg" style={{width:"370", height:"290"}} />) :
    <><Carousel movieList={movieList} type={"movie"} modalType={"homemovie"}/>
    <Carousel movieList={movieList} type={"movie"} modalType={"homemovie"}/></>}
     
    </>
)
};

export default Home;
