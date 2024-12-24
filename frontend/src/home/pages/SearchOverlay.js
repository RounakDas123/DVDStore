import React,{useEffect, useState} from 'react';
import {motion, Variants} from 'framer-motion';
import { useSelector } from 'react-redux';

import classes from './Home.module.css';
import Carousel from "./Carousel";

function SearchOverlay() {
    const showOverlay = useSelector(state => state.searchOverlay.showSearchOverlay);
    const showSearchCarousel = useSelector(state => state.searchDetails.showSearchDetails);
    const searchText = useSelector(state => state.searchDetails.searchText);
    const [searchResults, setSearchResults]= useState({
      movieResults: [],
      tvResults: []
    });

  const searchOverlayText = splitStringUsingRegex("Please press Enter!");
  const charVariants = {
    hidden: { opacity: 0, y: 10 }, // Add a slight translation for better visibility
    reveal: { opacity: 1, y: 0 }
  }
  const containerVariants = {
    hidden: {},
    reveal: { transition: { delayChildren: 0, staggerChildren: 0.25 } }
  };

  function splitStringUsingRegex(inputstring) {
    const characters = [];
    const regex = /[\s\S]/gu;
  
    let match;
    while((match = regex.exec(inputstring)) != null)
    {
      characters.push(match[0]);
    }
    
    return characters;
  };

  function checkData(data) {
    return (data.poster_path !== null && data.poster_path !== undefined && data.poster_path !== "") 
        && (data.title !== null && data.title !== undefined && data.title !== "")
        && (data.vote_average !== null && data.vote_average !== undefined && data.vote_average !== "")
        && (data.overview !== null && data.overview !== undefined && data.overview !== "");
  }

  const getSearchResults = ()=>{
    console.log("movieResults: ");
      fetch(`https://api.themoviedb.org/3/search/movie?language=en-US&api_key=d987bb3825166942aa314c4768160995&query=${searchText}&with_original_language=en`)
      .then(res => res.json())
      .then(json => setSearchResults(prevValues => ({
        ...prevValues,
        ["movieResults"]: json.results.filter(checkData)
    })) );
      
    console.log("tvResults: ");
      fetch(`https://api.themoviedb.org/3/search/tv?language=en-US&api_key=d987bb3825166942aa314c4768160995&query=${searchText}&with_original_language=en`)
      .then(res => res.json())
      .then(json => setSearchResults(prevValues => ({
        ...prevValues,
        ["tvResults"]: json.results.filter(checkData)
    })) );
    }
  
    useEffect(()=>{
      getSearchResults();
    },[]);

    useEffect(()=>{
          if((searchText!==null || searchText!==undefined || searchText!=='') && !showSearchCarousel)
          {
            getSearchResults();           
          }
        },[searchText, showSearchCarousel]);

    // if(showSearchCarousel && (searchText===null || searchText===undefined || searchText===''))
    // {
    //   setSearchResults( {
    //     movieResults: [],
    //     tvResults: []
    //   });
    // }
   console.log(searchResults.movieResults);
   console.log(searchResults.tvResults);

  return (
    <div className={`${classes.overlay} ${showOverlay ? classes.active : ""}`}>

      {showSearchCarousel && <motion.h1 initial="hidden" animate="reveal" variants={containerVariants} className={classes["overlay-text"]}>
        {searchOverlayText.map((char,index) => (
          <motion.span key={`${char}-${index}`} transition={{duration:1.5}} variants={charVariants}>{char}</motion.span>
        ))}
      </motion.h1>}
      {
        !showSearchCarousel && 
        (<>
        <Carousel movieList={searchResults.movieResults.concat(searchResults.tvResults)} type={"movie"} modalType={"searchmovie"}/>
        {/* <Carousel movieList={searchResults.tvResults} type={"tv"} modalType={"searchtv"}/> */}
        </>)
      }
    </div>
  )
};

export default SearchOverlay;