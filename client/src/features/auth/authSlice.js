import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loginAdmin = createAsyncThunk(
    "/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/login", formData);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem("token"),
    },

    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );

                localStorage.setItem("token", action.payload.token);
            })

            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;