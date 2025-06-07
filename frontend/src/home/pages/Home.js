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
  const [genreData, setGenreData] = useState([]);
  const [contentType, setContentType] = useState("movie");
  const [loader, setLoader] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreLoading, setGenreLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState({
    nowPlaying: 1,
    trending: 1,
    topRated: 1,
    upcoming: 1,
    onTheAir: 1,
    trendingTv: 1,
    topRatedTv: 1,
    genre: 1,
  });

  const apiKey = "d987bb3825166942aa314c4768160995";

  const movieGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
  ];

  const tvGenres = [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 99, name: "Documentary" },
  ];

  function checkData(data) {
    return contentType === "movie"
      ? data.poster_path && data.title && data.vote_average && data.overview
      : data.poster_path && data.name && data.vote_average && data.overview;
  }

  const handlePageChange = (type, page) => {
    setCurrentPage((prev) => ({ ...prev, [type]: page }));

    if (type === "genre" && selectedGenre) {
      fetchGenreData(selectedGenre.id, page);
    }

    setTimeout(() => {
      const targetCarousel = document.getElementById(type);
      if (targetCarousel) {
        targetCarousel.scrollIntoView({ behavior: "instant", block: "center" });
      }
    }, 500);
  };

  const fetchGenreData = async (genreId, page = currentPage.genre) => {
    try {
      setLoader(true);
      const url =
        contentType === "movie"
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`
          : `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();
      setGenreData(data.results.filter(checkData));
    } catch (error) {
      console.error("Error fetching genre data:", error);
    } finally {
      setLoader(false);
      setGenreLoading(false);
    }
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage((prev) => ({ ...prev, genre: 1 }));

    setTimeout(() => {
      const targetCarousel = document.getElementById("genre");
      if (targetCarousel) {
        targetCarousel.scrollIntoView({ behavior: "instant", block: "center" });
      }
    }, 500);
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setGenreData([]);
    setGenreLoading(true);
  };

  // Set first genre on contentType change
  useEffect(() => {
    const firstGenre = contentType === "movie" ? movieGenres[0] : tvGenres[0];
    setSelectedGenre(firstGenre);
    setGenreData([]);
    setCurrentPage((prev) => ({ ...prev, genre: 1 }));
  }, [contentType]);

  // Fetch genre data after selectedGenre and genre page are properly set
  useEffect(() => {
    if (selectedGenre && currentPage.genre === 1) {
      fetchGenreData(selectedGenre.id, 1);
    }
  }, [selectedGenre, currentPage.genre]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoader(true);

        if (contentType === "movie") {
          const [nowPlayingRes, trendingRes, topRatedRes, upcomingRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage.nowPlaying}&api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${currentPage.trending}&api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage.topRated}&api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${currentPage.upcoming}&api_key=${apiKey}`),
          ]);

          const [nowPlayingData, trendingData, topRatedData, upcomingData] = await Promise.all([
            nowPlayingRes.json(),
            trendingRes.json(),
            topRatedRes.json(),
            upcomingRes.json(),
          ]);

          setNowPlaying(nowPlayingData.results.filter(checkData));
          setTrending(trendingData.results.filter(checkData));
          setTopRated(topRatedData.results.filter(checkData));
          setUpcoming(upcomingData.results.filter(checkData));
        } else {
          const [onAirRes, trendingTvRes, topRatedTvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${currentPage.onTheAir}&api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${currentPage.trendingTv}&api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/tv/top_rated?&language=en-US&page=${currentPage.topRatedTv}&api_key=${apiKey}`),
          ]);

          const [onAirData, trendingTvData, topRatedTvData] = await Promise.all([
            onAirRes.json(),
            trendingTvRes.json(),
            topRatedTvRes.json(),
          ]);

          setOnTheAir(onAirData.results.filter(checkData));
          setTrendingTv(trendingTvData.results.filter(checkData));
          setTopRatedTv(topRatedTvData.results.filter(checkData));
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
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
          className={`${classes.homebutton} ${contentType === "movie" ? classes.active : ""}`}
          onClick={() => handleContentTypeChange("movie")}
        >
          Movies
        </button>
        <button
          className={`${classes.homebutton} ${contentType === "tv" ? classes.active : ""}`}
          onClick={() => handleContentTypeChange("tv")}
        >
          TV-Series
        </button>
      </div>

      {loader ? (
        <LoadingSpinner />
      ) : contentType === "movie" ? (
        <>
          <CarouselContainer id="nowPlaying" heading="Now Playing" movieList={nowPlaying} type={contentType} currentPage={currentPage.nowPlaying} onPageChange={(page) => handlePageChange("nowPlaying", page)} />
          <CarouselContainer id="trending" heading="Trending" movieList={trending} type={contentType} currentPage={currentPage.trending} onPageChange={(page) => handlePageChange("trending", page)} />
          <CarouselContainer id="topRated" heading="Top Rated" movieList={topRated} type={contentType} currentPage={currentPage.topRated} onPageChange={(page) => handlePageChange("topRated", page)} />
          <CarouselContainer id="upcoming" heading="Upcoming" movieList={upcoming} type={contentType} currentPage={currentPage.upcoming} onPageChange={(page) => handlePageChange("upcoming", page)} />

          <div className={classes.genreButtons}>
            {movieGenres.map((genre) => (
              <button key={genre.id} className={`${classes.genreButton} ${selectedGenre?.id === genre.id ? classes.activeGenre : ""}`} onClick={() => handleGenreClick(genre)}>
                {genre.name}
              </button>
            ))}
          </div>

          <CarouselContainer id="genre" heading={`${selectedGenre?.name || "Genre"} Movies`} movieList={genreData} type={contentType} currentPage={currentPage.genre} onPageChange={(page) => handlePageChange("genre", page)} />
        </>
      ) : (
        <>
          <CarouselContainer id="onTheAir" heading="On the Air" movieList={onTheAir} type={contentType} currentPage={currentPage.onTheAir} onPageChange={(page) => handlePageChange("onTheAir", page)} />
          <CarouselContainer id="trendingTv" heading="Trending" movieList={trendingTv} type={contentType} currentPage={currentPage.trendingTv} onPageChange={(page) => handlePageChange("trendingTv", page)} />
          <CarouselContainer id="topRatedTv" heading="Top Rated" movieList={topRatedTv} type={contentType} currentPage={currentPage.topRatedTv} onPageChange={(page) => handlePageChange("topRatedTv", page)} />

          <div className={classes.genreButtons}>
            {tvGenres.map((genre) => (
              <button key={genre.id} className={`${classes.genreButton} ${selectedGenre?.id === genre.id ? classes.activeGenre : ""}`} onClick={() => handleGenreClick(genre)}>
                {genre.name}
              </button>
            ))}
          </div>

          <CarouselContainer id="genre" heading={`${selectedGenre?.name || "Genre"} TV Series`} movieList={genreData} type={contentType} currentPage={currentPage.genre} onPageChange={(page) => handlePageChange("genre", page)} />
        </>
      )}
    </>
  );
};

export default Home;
