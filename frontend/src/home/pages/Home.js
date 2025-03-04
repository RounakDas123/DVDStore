import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../shared/components/loader/LoadingSpinner";
import CarouselContainer from "../components/CarouselContainer";
import classes from "./Home.module.css";

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
    topRatedTv: 1,
  });

  const apiKey = process.env.REACT_APP_API_KEY;

  function checkData(data) {
    if (contentType === "movie") {
      return (
        data.poster_path && data.title && data.vote_average && data.overview
      );
    } else if (contentType === "tv") {
      return (
        data.poster_path && data.name && data.vote_average && data.overview
      );
    }
  }

  const handlePageChange = (type, page) => {
    setCurrentPage((prev) => ({ ...prev, [type]: page }));

    setTimeout(() => {
      const targetCarousel = document.getElementById(`${type}`);

      if (targetCarousel) {
        targetCarousel.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error("Element not found for ID:", type);
      }
    }, 500);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (contentType === "movie") {
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
        } else if (contentType === "tv") {
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
    contentType,
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
      ) : contentType === "movie" ? (
        <>
          <CarouselContainer
            id="nowPlaying"
            heading="Now Playing"
            movieList={nowPlaying}
            type={contentType}
            currentPage={currentPage.nowPlaying}
            onPageChange={(page) => handlePageChange("nowPlaying", page)}
          />

          <CarouselContainer
            id="trending"
            heading="Trending"
            movieList={trending}
            type={contentType}
            currentPage={currentPage.trending}
            onPageChange={(page) => handlePageChange("trending", page)}
          />

          <CarouselContainer
            id="topRated"
            heading="Top Rated"
            movieList={topRated}
            type={contentType}
            currentPage={currentPage.topRated}
            onPageChange={(page) => handlePageChange("topRated", page)}
          />

          <CarouselContainer
            id="upcoming"
            heading="Upcoming"
            movieList={upcoming}
            type={contentType}
            currentPage={currentPage.upcoming}
            onPageChange={(page) => handlePageChange("upcoming", page)}
          />
        </>
      ) : (
        <>
          <CarouselContainer
            id="onTheAir"
            heading="On the Air"
            movieList={onTheAir}
            type={contentType}
            currentPage={currentPage.onTheAir}
            onPageChange={(page) => handlePageChange("onTheAir", page)}
          />

          <CarouselContainer
            id="trendingTv"
            heading="Trending"
            movieList={trendingTv}
            type={contentType}
            currentPage={currentPage.trendingTv}
            onPageChange={(page) => handlePageChange("trendingTv", page)}
          />

          <CarouselContainer
            id="topRatedTv"
            heading="Top Rated"
            movieList={topRatedTv}
            type={contentType}
            currentPage={currentPage.topRatedTv}
            onPageChange={(page) => handlePageChange("topRatedTv", page)}
          />
        </>
      )}
    </>
  );
};

export default Home;
