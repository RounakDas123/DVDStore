import React from "react";
import classes from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages = 10, onPageChange }) => {
  const handlePageChange = (event, page) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <div className={classes.pagination}>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`${classes.pageButton} ${
            currentPage === index + 1 ? classes.active : ""
          }`}
          onClick={(event) => handlePageChange(event, index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
