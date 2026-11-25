
import mongoose from "mongoose";
import Form from "../models/Form.js";
import Submission from "../models/Submission.js";
import { validateSubmission } from "../utils/validateSubmission.js";


export const createSubmission = async (req, res) => {
    try {
        const { formId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid form ID"
            });
        }
        const form = await Form.findById(formId).lean();

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }


        if (form.status !== "published") {
            return res.status(403).json({
                success: false,
                message: "This form is not accepting submissions"
            });
        }

       
        const keys = form.fields.map((field) => field.key);

        if (new Set(keys).size !== keys.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid form configuration: duplicate field keys"
            });
        }

        
        const { errors, cleanedData } = validateSubmission(
            form.fields,
            req.body.data
        );

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }
        const submission = await Submission.create({
            formId: form._id,
            data: cleanedData,
            fieldSnapshot: form.fields.map((field) => ({
                key: field.key,
                label: field.label,
                type: field.type
            }))
        });

        return res.status(201).json({
            success: true,
            message: "Form submitted successfully",
            submissionId: submission._id
        });

    } catch (error) {
        console.error("Create submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const getAllSubmissions = async (req, res) => {
    try {
        let page = Number.parseInt(req.query.page, 10) || 1;
        let limit = Number.parseInt(req.query.limit, 10) || 10;

        page = Math.max(1, page);
        limit = Math.min(100, Math.max(1, limit));

        const filter = {};

        // Optional filter by form ID
        if (req.query.formId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.formId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid form ID"
                });
            }

            filter.formId = req.query.formId;
        }

        const skip = (page - 1) * limit;

        const [submissions, total] = await Promise.all([
            Submission.find(filter)
                .select("-__v")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate("formId", "name status")
                .lean(),

            Submission.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: submissions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get submissions error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const getSingleSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission ID"
            });
        }

        const submission = await Submission.findById(submissionId)
            .populate("formId", "name description fields")
            .lean();

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: submission
        });

    } catch (error) {
        console.error("Get single submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getPublicForm = async (req, res) => {
    try {
        const { formId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid form ID"
            });
        }

        const form = await Form.findById(formId).lean();

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        if (form.status !== "published") {
            return res.status(403).json({
                success: false,
                message: "This form is not available"
            });
        }

        return res.status(200).json({
            success: true,
            data: form
        });

    } catch (error) {
        console.error("Get public form error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const deleteSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission ID"
            });
        }

        const submission = await Submission.findByIdAndDelete(submissionId);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Submission deleted successfully"
        });

    } catch (error) {
        console.error("Delete submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
