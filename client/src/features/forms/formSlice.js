
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import the SAME Axios instance used in authSlice
import api from "../../services/api";

// Create Form API
export const createForm = createAsyncThunk(
    "forms/createForm",

    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/forms", formData);

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create form"
            );
        }
    }
);

export const fetchForms = createAsyncThunk(
    "forms/fetchForms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/forms");
            console.log("Backend Response:", response.data);
            return response.data.forms;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch forms"
            );
        }
    }
);

export const deleteForm = createAsyncThunk(
    "form/deleteForm",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/forms/${id}`);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete form"
            );
        }
    }
);

const formSlice = createSlice({
    name: "forms",

    initialState: {
        forms: [],
        loading: false,
        error: null,
        success: false,
    },

    reducers: {
        clearFormStatus: (state) => {
            state.error = null;
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

          
            .addCase(createForm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(createForm.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.forms.unshift(action.payload.form);
            })

            .addCase(createForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create form";
            })
            .addCase(fetchForms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchForms.fulfilled, (state, action) => {
                console.log("FULFILLED PAYLOAD:", action.payload);

                state.loading = false;
                state.forms = action.payload;
            })

            .addCase(fetchForms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        
          .addCase(deleteForm.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
            .addCase(deleteForm.fulfilled, (state, action) => {
                state.loading = false;

                state.forms = state.forms.filter(
                    (form) => form._id !== action.payload
                );
            })
            .addCase(deleteForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        
        
    },
});

export const { clearFormStatus } = formSlice.actions;

export default formSlice.reducer;
