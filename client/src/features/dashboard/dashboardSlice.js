import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDashboard = createAsyncThunk(
    "dashboard/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch dashboard");
            }

            return result;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState: {
        stats: {
            totalForms: 0,
            publishedForms: 0,
            draftForms: 0,
            totalSubmissions: 0
        },
        recentForms: [],
        loading: false,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.recentForms = action.payload.recentForms;
            })

            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default dashboardSlice.reducer;