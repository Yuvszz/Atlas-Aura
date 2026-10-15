import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPackage: null,
  travelDate: "",
  travelers: 1,
  cart: [],
  packageCache: {},
};

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {

    // =========================
    // SELECTED PACKAGE
    // =========================

    setSelectedPackage: (state, action) => {
      state.selectedPackage = action.payload;
    },


    // =========================
    // TRAVEL DATE
    // =========================

    setTravelDate: (state, action) => {
      state.travelDate = action.payload;
    },


    // =========================
    // TRAVELERS
    // =========================

    setTravelers: (state, action) => {
      state.travelers = action.payload;
    },


    // =========================
    // ADD TO CART
    // =========================

    addToCart: (state, action) => {

      const existingItem = state.cart.find(
        (item) =>
          item.id === action.payload.id
      );

      if (!existingItem) {

        state.cart.push({
          ...action.payload,
          travelers:
            action.payload.travelers || 1,
        });

      }

    },


    // =========================
    // REMOVE FROM CART
    // =========================

    removeFromCart: (state, action) => {

      state.cart = state.cart.filter(
        (item) =>
          item.id !== action.payload
      );

    },


    // =========================
    // UPDATE CART
    // =========================

    updateCartItem: (state, action) => {

      const {
        id,
        travelers,
      } = action.payload;

      const item = state.cart.find(
        (item) =>
          item.id === id
      );

      if (item) {

        item.travelers =
          Number(travelers) || 1;

      }

    },


    // =========================
    // CLEAR CART
    // =========================

    clearCart: (state) => {

      state.cart = [];

    },


    // =========================
    // CACHE PACKAGE
    // =========================

    cachePackage: (state, action) => {

      const packageData =
        action.payload;

      state.packageCache[
        packageData.id
      ] = packageData;

    },


    // =========================
    // CLEAR CACHE
    // =========================

    clearPackageCache: (state) => {

      state.packageCache = {};

    },

  },

});


// =========================
// EXPORT ACTIONS
// =========================

export const {
  setSelectedPackage,
  setTravelDate,
  setTravelers,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  cachePackage,
  clearPackageCache,
} = bookingSlice.actions;


export default bookingSlice.reducer;