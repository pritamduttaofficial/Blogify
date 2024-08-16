import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state, action) => {
      state.status = false;
      state.userData = null;
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { login, logout, updateUserData } = authSlice.actions;

export default authSlice.reducer;
