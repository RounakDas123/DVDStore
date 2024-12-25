// import { createStore } from 'redux';
import { createSlice, configureStore } from '@reduxjs/toolkit';

// const initialState = {showSearchOverlay : false};  

const searchOverlaySlice = createSlice({
    name:'searchoverlay',
    initialState : {showSearchOverlay : false},
    reducers: {
        showOverlay(state,action) {
            state.showSearchOverlay = action.payload;
        }
    }
});

const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState : {showHomeMovieDetails : false, showSearchMovieDetails : false, showSearchTvDetails : false},
    reducers : {
        openModal(state, action){
            if(action.payload === "homemovie")
            {
                state.showHomeMovieDetails = true;
            }
            else if(action.payload === "searchmovie")
            {
                state.showSearchMovieDetails = true;
            }
            else if(action.payload === "searchtv")
            {
                state.showSearchTvDetails = true;
            }
        },
        closeModal(state, action){
            if(action.payload === "homemovie")
            {
                state.showHomeMovieDetails = false;
            }
            else if(action.payload === "searchmovie")
            {
                state.showSearchMovieDetails = false;
            }
            else if(action.payload === "searchtv")
            {
                state.showSearchTvDetails = false;
            }
        }
    }
});

const searchDetailsSlice = createSlice({
    name: 'searchDetails',
    initialState : {showSearchDetails : true, searchText : ''},
    reducers : {
        showSearchCarousel(state){
            state.showSearchDetails = false;
        },
        hideSearchCarousel(state){
            state.showSearchDetails = true;
        },
        fillSearchText(state,action)
        {
            state.searchText= action.payload;
        }
    }
});

const cardButtonsSlice = createSlice({
    name: 'cardButtons',
    initialState : {wishlistCounter : 0, cartCounter : 0},
    reducers : {
        increment(state, action){
            if(action.payload === "heart")
            {
                state.wishlistCounter = state.wishlistCounter + 1;
            }
            else if(action.payload === "cart")
            {
                state.cartCounter = state.cartCounter + 1;
            }
            
        },
        decrement(state, action){
            if(action.payload === "heart")
            {
                state.wishlistCounter = state.wishlistCounter - 1;
            }
            else if(action.payload === "cart")
            {
                state.cartCounter = state.cartCounter - 1;
            }
        }
    }
});

// const counterReducer = (state = initialState ,action) => {

//     if(action.type==='showOverlay')
//     {
//         return {
//             showSearchOverlay : action.visibility,
//         };
//     }
    

//     return state;
// };


const store = configureStore({
    reducer: {searchOverlay : searchOverlaySlice.reducer,
              movieDetails  : movieDetailsSlice.reducer,
              searchDetails : searchDetailsSlice.reducer,
              cardbuttons   : cardButtonsSlice.reducer},
});

export const searchOverlayActions = searchOverlaySlice.actions;
export const movieDetailsActions = movieDetailsSlice.actions;
export const searchDetailsActions = searchDetailsSlice.actions;
export const cardbuttonsActions = cardButtonsSlice.actions;

export default store;