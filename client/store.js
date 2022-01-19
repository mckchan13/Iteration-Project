import { configureStore } from '@reduxjs/toolkit'
import athleteReducer from './reducers/athleteSlice';

export const store = configureStore({
  reducer: {
      athlete: athleteReducer,
  },
})