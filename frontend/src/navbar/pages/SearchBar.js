import React,{useState} from 'react';
import classes from './SearchBar.module.css';

function SearchBar() {
const [searchText, setSearchText] = useState('');

  return (
    <form style={{paddingTop:"7px"}}>
        <input 
        type="text" 
        placeholder="Search" 
        // onBlur={() => {handleInputBlur('login','email')}}
        // onChange={(event)=>{handleInputChange('login','email',event.target.value)}} 
        // value={loginValues.email} 
        className= {classes.search}/>
    </form>
  )
};

export default SearchBar;