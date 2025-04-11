import { createSlice } from '@reduxjs/toolkit';
const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState: {
    menuList:[],
    menuListFavourites:[]
  },
  reducers: {
    setMenuList: (state, { payload }) => {      
      state.menuList = payload;
    },
    setMenuListFavourites:(state, { payload })=>{
      state.menuListFavourites = payload;
    } 
  },
});

export const {
  setMenuList,
  setMenuListFavourites
} = landingPageSlice.actions;
export default landingPageSlice.reducer;
