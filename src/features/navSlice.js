import { createSlice } from "@reduxjs/toolkit";

export const navSlice = createSlice({
  name: "nav",
  initialState: [
    { id: 0, name: "Каталог", to: "/catalog" },
    { id: 1, name: "Акции", to: "/promo" },
    { id: 2, name: "О компании", to: "/about" },
  ],
  reducers: {
    reducer: (state) => state,
  },
});

export const { reducer } = navSlice.actions;

export default navSlice.reducer;
