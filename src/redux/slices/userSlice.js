import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    details: null, // Initially null
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUserDetails: (state, action) => {
            state.details = action.payload;
        },
        // ... other reducers if needed
    },
});

export const { saveUserDetails } = userSlice.actions;
export default userSlice.reducer;