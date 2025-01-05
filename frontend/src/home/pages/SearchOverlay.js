import React,{useEffect, useState} from 'react';
import {motion, Variants} from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { searchOverlayActions,searchDetailsActions } from '../../store';

import classes from './Home.module.css';
import Carousel from "./Carousel";

function SearchOverlay() {
  const dispatch = useDispatch();
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

  function checkDataTv(data) {
    return (data.poster_path !== null && data.poster_path !== undefined && data.poster_path !== "") 
        && (data.name !== null && data.name !== undefined && data.name !== "")
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
        ["tvResults"]: json.results.filter(checkDataTv)
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

   const closeOverlay = () => {
    dispatch(searchOverlayActions.showOverlay(false));
    dispatch(searchDetailsActions.hideSearchCarousel()); // Hide carousel
    dispatch(searchDetailsActions.fillSearchText('')); // Clear input field
  };

  const totalResults =
    searchResults.movieResults.length + searchResults.tvResults.length;
  console.log('movieSearch', searchResults.movieResults);
  console.log('tvSearch', searchResults.tvResults);

  return (
    <div className={`${classes.overlay} ${showOverlay ? classes.active : ""}`}>
      <button className={classes.closeButton} onClick={closeOverlay}>
        ✕
      </button>
      {showSearchCarousel && <motion.h1 initial="hidden" animate="reveal" variants={containerVariants} className={classes["overlay-text"]}>
        {searchOverlayText.map((char,index) => (
          <motion.span key={`${char}-${index}`} transition={{duration:1.5}} variants={charVariants}>{char}</motion.span>
        ))}
      </motion.h1>}
      {
        !showSearchCarousel && 
        (<>
        <h2 className={classes.resultsCount}>
            Search Results: Total {totalResults} results found
          </h2>
          <div className={classes.scrollableContent}>
          {searchResults.movieResults.length>0 && <><h2 className={classes.heading} style={{paddingLeft:"12.5%"}}>Movies</h2>
            <Carousel
              movieList={searchResults.movieResults}
              type={"movie"}
            /></>}
          {searchResults.tvResults.length>0 && <><h2 className={classes.heading} style={{paddingLeft:"12.5%"}}>Tv-Series</h2>
            <Carousel
              movieList={searchResults.tvResults}
              type={"tv"}
            /></>}
        </div>
        </>)
      }
    </div>
  )
};

export default SearchOverlay;