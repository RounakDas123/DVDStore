import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import classes from "./Carousel.module.css";
import DetailsModal from "./DetailsModal";
import Overview from "./Overview";

function Carousel({ movieList, type }) {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedModalType, setSelectedModalType] = useState(null);

  const dialog = useRef();

  const settings = {
    dots: false,
    lazyLoad: true,
    infinite: movieList.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  const getColor = (vote) => {
    if (vote >= 8) return "green";
    else if (vote >= 5 && vote < 8) return "orange";
    else return "red";
  };
  const openModal = (event, movieId, modalType) => {
    event.preventDefault();
    setSelectedMovieId(movieId);
    setSelectedModalType(modalType);
    dialog.current.open();
  };

  return (
    <>
      <DetailsModal
        ref={dialog}
        movieid={selectedMovieId}
        type={type}
        modalType={selectedModalType}
      />
      <div className={classes["container-carousel"]}>
        <Slider {...settings}>
          {movieList.map((movie) => (
            <div className={classes.movie} key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt=""
                title={type === "movie" ? movie.title : movie.name}
                className={classes.image}
              />

              <div className={classes["movie-info"]}>
                <h3 className={classes.title}>
                  {type === "movie" ? movie.title : movie.name}
                </h3>
                <span className={classes[`${getColor(movie.vote_average)}`]}>
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>

              <Overview
                movie={movie}
                type={type}
                onClick={(e) => openModal(e, movie.id, "carouselModal")}
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}

export default Carousel;
