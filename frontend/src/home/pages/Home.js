import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Carousel from "./Carousel";
import Pagination from "./Pagination";
import classes from "./Home.module.css";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [topRatedTv, setTopRatedTv] = useState([]);
  const [contentType, setContentType] = useState("movie");
  const [loader, setLoader] = useState(true);

  const [currentPage, setCurrentPage] = useState({
    nowPlaying: 1,
    trending: 1,
    topRated: 1,
    upcoming: 1,
    onTheAir: 1,
    trendingTv: 1,
    topRatedTv: 1
  });

  const apiKey = "d987bb3825166942aa314c4768160995";

  function checkData(data) {
    if(contentType === "movie")
    {
      return (
        data.poster_path &&
        data.title &&
        data.vote_average &&
        data.overview
      );
    }
    else if(contentType === "tv")
    {
      return (
        data.poster_path &&
        data.name &&
        data.vote_average &&
        data.overview
      );
    }
  }


  const handlePageChange = (type, page) => {
    setCurrentPage((prev) => ({ ...prev, [type]: page }));

    setTimeout(() => {
      const targetCarousel = document.getElementById(`${type}`);
      console.log("Scrolling to element with ID:", type, targetCarousel);
  
      if (targetCarousel) {
        targetCarousel.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("Scrolled into view:", type);
      } else {
        console.error("Element not found for ID:", type);
      }
    }, 300); 
  };


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if(contentType === "movie")
        {
            setLoader(true);
            const nowPlayingResponse = await fetch(
              `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage.nowPlaying}&api_key=${apiKey}`
            );
            const nowPlayingData = await nowPlayingResponse.json();
            setNowPlaying(nowPlayingData.results.filter(checkData));

            const trendingResponse = await fetch(
              `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${currentPage.trending}&api_key=${apiKey}`
            );
            const trendingData = await trendingResponse.json();
            setTrending(trendingData.results.filter(checkData));

            const topRatedResponse = await fetch(
              `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage.topRated}&api_key=${apiKey}`
            );
            const topRatedData = await topRatedResponse.json();
            setTopRated(topRatedData.results.filter(checkData));

            const upcomingResponse = await fetch(
              `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${currentPage.upcoming}&api_key=${apiKey}`
            );
            const upcomingData = await upcomingResponse.json();
            setUpcoming(upcomingData.results.filter(checkData));

            setLoader(false);
      }
      else if(contentType === "tv")
      {
            setLoader(true);
            const onTheAirResponse = await fetch(
              `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${currentPage.onTheAir}&api_key=${apiKey}`
            );
            const onTheAirData = await onTheAirResponse.json();
            setOnTheAir(onTheAirData.results.filter(checkData));
            
            const trendingTvResponse = await fetch(
              `https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${currentPage.trendingTv}&api_key=${apiKey}`
            );
            const trendingTvData = await trendingTvResponse.json();
            setTrendingTv(trendingTvData.results.filter(checkData));     

            const topRatedTvResponse = await fetch(
              `https://api.themoviedb.org/3/tv/top_rated?&language=en-US&page=${currentPage.topRatedTv}&api_key=${apiKey}`
            );
            const topRatedTvData = await topRatedTvResponse.json();
            setTopRatedTv(topRatedTvData.results.filter(checkData));
            

            setLoader(false);
      }

      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoader(false); 
      }
    };

    fetchMovies();
  }, [
    currentPage.nowPlaying,
    currentPage.trending,
    currentPage.topRated,
    currentPage.upcoming,
    currentPage.onTheAir,
    currentPage.trendingTv,
    currentPage.topRatedTv,
    contentType
  ]);

  return (
    <>
    <div className={classes["button-container"]}>
        <button
          className={`${classes.homebutton} ${
            contentType === "movie" ? classes.active : ""
          }`}
          onClick={() => setContentType("movie")}
        >
          Movies
        </button>
        <button
          className={`${classes.homebutton} ${
            contentType === "tv" ? classes.active : ""
          }`}
          onClick={() => setContentType("tv")}
        >
          TV-Series
        </button>
      </div>

      {loader ? (
        <LoadingSpinner />
      ) : (
         (contentType === "movie") ? (<>
          <div id="nowPlaying" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Now Playing</h2>
            </div>
            <Carousel movieList={nowPlaying} type={contentType} />
            <Pagination
              currentPage={currentPage.nowPlaying}
              onPageChange={(page) => handlePageChange("nowPlaying", page)}
            />
          </div>
          <div id="trending" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Trending</h2>
            </div>
            <Carousel movieList={trending} type={contentType} />
            <Pagination
              currentPage={currentPage.trending}
              onPageChange={(page) => handlePageChange("trending", page)}
            />
          </div>
          <div id="topRated" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Top Rated</h2>
            </div>
            <Carousel movieList={topRated} type={contentType} />
            <Pagination
              currentPage={currentPage.topRated}
              onPageChange={(page) => handlePageChange("topRated", page)}
            />
          </div>
          <div id="upcoming" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Upcoming</h2>
            </div>
            <Carousel movieList={upcoming} type={contentType} />
            <Pagination
              currentPage={currentPage.upcoming}
              onPageChange={(page) => handlePageChange("upcoming", page)}
            />
          </div>
        </>) : 
        (<>
        <div id="onTheAir" className={classes["carousel-container"]} >
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>On the air</h2>
            </div>
            <Carousel movieList={onTheAir} type={contentType} />
            <Pagination
              currentPage={currentPage.onTheAir}
              onPageChange={(page) => handlePageChange("onTheAir", page)}
            />
          </div>
          <div id="trendingTv" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Trending</h2>
            </div>
            <Carousel movieList={trendingTv} type={contentType} />
            <Pagination
              currentPage={currentPage.trendingTv}
              onPageChange={(page) => handlePageChange("trendingTv", page)}
            />
          </div>
          <div id="topRatedTv" className={classes["carousel-container"]}>
            <div className={classes["heading-container"]}>
              <h2 className={classes.heading}>Top Rated</h2>
            </div>
            <Carousel movieList={topRatedTv} type={contentType} />
            <Pagination
              currentPage={currentPage.topRatedTv}
              onPageChange={(page) => handlePageChange("topRatedTv", page)}
            />
          </div>
        </>) 
      )}
    </>
  );
};

export default Home;
