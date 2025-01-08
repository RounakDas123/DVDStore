import React from "react";
import Carousel from "./Carousel";
import classes from "./CarouselContainer.module.css";
import Pagination from "./Pagination";

const CarouselContainer = ({
  id,
  heading,
  movieList,
  type,
  currentPage,
  onPageChange,
}) => {
  return (
    <div id={id} className={classes["carousel-container"]}>
      <div className={classes["heading-container"]}>
        <h2 className={classes.heading}>{heading}</h2>
      </div>
      <Carousel movieList={movieList} type={type} />
      <Pagination currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};

export default CarouselContainer;
