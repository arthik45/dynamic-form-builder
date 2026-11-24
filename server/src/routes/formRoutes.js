import express from "express";
import { createForm, updateForm, getForms, getformById, Deleteform,getPublicForm} from "../controllers/formController.js";
import {
    authenticate,
    authorizeAdmin
} from "../middleware/authMiddleware.js";
const formRoutes = express.Router();

// Public route - users can open published forms
formRoutes.get("/:formId", getPublicForm);

// Admin routes
formRoutes.post(
    "/",
    authenticate,
    authorizeAdmin,
    createForm
);

formRoutes.put(
    "/:id",
    authenticate,
    authorizeAdmin,
    updateForm
);

formRoutes.get(
    "/",
    authenticate,
    authorizeAdmin,
    getForms
);

formRoutes.delete(
    "/:id",
    authenticate,
    authorizeAdmin,
    Deleteform
);

export default formRoutes;