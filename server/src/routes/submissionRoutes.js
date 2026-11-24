
import express from "express";

import {
    createSubmission,
    getAllSubmissions,
    getSingleSubmission,
    deleteSubmission
} from "../controllers/submissionController.js";

import {
    authenticate,
    authorizeAdmin
} from "../middleware/authMiddleware.js";

const submissionrouter = express.Router();

submissionrouter.post("/forms/:formId/submissions", createSubmission);

// ADMIN APIs
submissionrouter.get(
    "/admin/submissions",
    authenticate,
    authorizeAdmin,
    getAllSubmissions
);

submissionrouter.get(
    "/admin/submissions/:submissionId",
    authenticate,
    authorizeAdmin,
    getSingleSubmission
);

submissionrouter.delete(
    "/admin/submissions/:submissionId",
    authenticate,
    authorizeAdmin,
    deleteSubmission
);

export default submissionrouter;
