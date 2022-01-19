import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
}

export const athleteSlice = createSlice({
  name: 'athlete',
  initialState,
  reducers: {
    createAthleteName: (state, action) => {
      state.name = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { createAthleteName } = athleteSlice.actions

export default athleteSlice.reducer;