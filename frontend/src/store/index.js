import { configureStore, createSlice } from "@reduxjs/toolkit";

const searchOverlaySlice = createSlice({
  name: "searchoverlay",
  initialState: { showSearchOverlay: false },
  reducers: {
    showOverlay(state, action) {
      state.showSearchOverlay = action.payload;
    },
  },
});

const searchDetailsSlice = createSlice({
  name: "searchDetails",
  initialState: { showSearchDetails: true, searchText: "" },
  reducers: {
    showSearchCarousel(state) {
      state.showSearchDetails = false;
    },
    hideSearchCarousel(state) {
      state.showSearchDetails = true;
    },
    fillSearchText(state, action) {
      state.searchText = action.payload;
    },
  },
});

const cardButtonsSlice = createSlice({
  name: "cardButtons",
  initialState: { wishlistCounter: 0, cartCounter: 0 },
  reducers: {
    setInitialValue(state, action) {
      if (action.payload.type === "wishlist") {
        state.wishlistCounter = action.payload.value;
      } else if (action.payload.type === "cart") {
        state.cartCounter = action.payload.value;
      }
    },
  },
});

const userInfoSlice = createSlice({
  name: "userinfo",
  initialState: { user: {}, token: null },
  reducers: {
    setUserInfo(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

const wishlistCartSlice = createSlice({
  name: "wishlistcart",
  initialState: { wishlist: [], cart: [] },
  reducers: {
    setInitialValue(state, action) {
      if (action.payload.type === "wishlist") {
        state.wishlist = action.payload.value;
      } else if (action.payload.type === "cart") {
        state.cart = action.payload.value;
      }
    },
  },
});

const store = configureStore({
  reducer: {
    searchOverlay: searchOverlaySlice.reducer,

    searchDetails: searchDetailsSlice.reducer,
    cardbuttons: cardButtonsSlice.reducer,
    userInfo: userInfoSlice.reducer,
    wishlistCart: wishlistCartSlice.reducer,
  },
});

export const searchOverlayActions = searchOverlaySlice.actions;
export const searchDetailsActions = searchDetailsSlice.actions;
export const cardbuttonsActions = cardButtonsSlice.actions;
export const userInfoActions = userInfoSlice.actions;
export const wishlistCartActions = wishlistCartSlice.actions;

export default store;
