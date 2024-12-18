import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        otherUsers: null,
        profile: null,
    },
    reducers: {
        getUsers: (state, action) => {
            state.user = action.payload;
        },
        getOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        getprofile: (state, action) => {
            state.profile = action.payload;
        },
        followingUpdate: (state, action) => {
            if (state.user.following.includes(action.payload)) {
                state.user.following = state.user.following.filter((id) => id !== action.payload);
            } else {
                state.user.following.push(action.payload);
            }
        },
        updateUserBookmarks: (state, action) => {
            if (state.user) {
                state.user.Bookmarks = action.payload;
            }
        },
        updateUsersLikes: (state, action) => {
            if (state.user) {
                state.user.likes = action.payload;
            }
        },
        updateComments: (state, action) => {
            if (state.user) {
                state.user.addComment = action.payload;
            }
        },
        updateProfile: (state, action) => {
            if (state.profile && state.profile._id === state.user._id) {
                state.profile = {
                    ...state.profile,
                    ...action.payload, // Merge new profile data
                };
            }
        }
    },
});

export const { getUsers, getOtherUsers, getprofile, followingUpdate, updateUserBookmarks, updateUsersLikes, updateComments, updateProfile } = userSlice.actions;
export default userSlice.reducer;
