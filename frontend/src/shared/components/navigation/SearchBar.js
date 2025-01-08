import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchDetailsActions, searchOverlayActions } from "../../../store/index";
import classes from "./SearchBar.module.css";

function SearchBar() {
  const dispatch = useDispatch();

  const searchText = useSelector((state) => state.searchDetails.searchText);

  useEffect(() => {
    dispatch(searchDetailsActions.fillSearchText(searchText));
  }, [searchText, dispatch]);

  const handleInputChange = (value) => {
    var textPresence = value.length > 0;
    dispatch(searchOverlayActions.showOverlay(textPresence));
    if (!textPresence) {
      dispatch(searchDetailsActions.hideSearchCarousel());
      dispatch(searchDetailsActions.fillSearchText(""));
    }
    dispatch(searchDetailsActions.fillSearchText(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchText.trim()) {
      dispatch(searchDetailsActions.showSearchCarousel());
      dispatch(searchDetailsActions.fillSearchText(searchText));
    }
  };

  return (
    <form style={{ paddingTop: "7px" }} onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search"
        onChange={(event) => {
          handleInputChange(event.target.value);
        }}
        value={searchText}
        className={classes.search}
      />
    </form>
  );
}

export default SearchBar;
