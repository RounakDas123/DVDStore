import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import classes from './SearchBar.module.css';
import {searchOverlayActions} from '../../store/index';
import { searchDetailsActions } from '../../store/index';

function SearchBar() {
const [searchText, setSearchText] = useState('');

const dispatch = useDispatch();

const handleInputChange = (value) => {
  
  var textPresence = value.length>0;
  dispatch(searchOverlayActions.showOverlay(textPresence));
  // if(value.length>0)
  // {
  //   dispatch({type : 'showOverlay'});
  // }
  // else{
  //   dispatch({type : 'hideOverlay'});
  // }
  if(!textPresence)
  {
    dispatch(searchDetailsActions.hideSearchCarousel());
    dispatch(searchDetailsActions.fillSearchText(''));
  }
  setSearchText(value);
};

const handleSubmit = (event)=>{
  event.preventDefault();
  if(searchText.trim())
  {
    console.log(searchText);
    dispatch(searchDetailsActions.showSearchCarousel());
    dispatch(searchDetailsActions.fillSearchText(searchText));
  }
    
};

  return (
    <form style={{paddingTop:"7px"}} onSubmit={handleSubmit}>
        <input 
        type="search" 
        placeholder="Search" 
        // onBlur={() => {handleInputBlur('login','email')}}
        onChange={(event)=>{handleInputChange(event.target.value)}} 
        value={searchText} 
        className= {classes.search}/>
    </form>
  )
};

export default SearchBar;