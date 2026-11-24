import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import formReducer from "../../features/forms/formSlice";
import dashboardReducer from "../../features/dashboard/dashboardSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        form: formReducer,
        dashboard: dashboardReducer,
    },
});