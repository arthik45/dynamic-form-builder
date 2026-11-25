
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        // User's submitted answers
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        // Preserve the field definition at submission time
        fieldSnapshot: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        }
    },
    {
        timestamps: true
    }
);

submissionSchema.index({ formId: 1, createdAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
