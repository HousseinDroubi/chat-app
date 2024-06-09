import { createSlice } from "@reduxjs/toolkit";

interface themeInterface {
  isLight: boolean;
}
const initialState: themeInterface = {
  isLight: !(
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isLight = !state.isLight;
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
