
import express from "express";

import {
    createSubmission,
    getAllSubmissions,
    getSingleSubmission,
    deleteSubmission
} from "../controllers/submissionController.js";

// import {
//     authenticate,
//     authorizeAdmin
// } from "../middleware/authMiddleware.js";

const submissionrouter = express.Router();

// PUBLIC API
// Anyone can submit a published form
submissionrouter.post("/forms/:formId/submissions", createSubmission);

// ADMIN APIs
submissionrouter.get(
    "/admin/submissions",
    getAllSubmissions
);

submissionrouter.get(
    "/admin/submissions/:submissionId",
    getSingleSubmission
);

submissionrouter.delete(
    "/admin/submissions/:submissionId",
    deleteSubmission
);

export default submissionrouter;
