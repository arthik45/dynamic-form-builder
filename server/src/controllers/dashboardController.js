import Form from "../models/Form.js";
import Submission from "../models/Submission.js";

export const getDashboardStats = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Get all forms created by this admin
        const forms = await Form.find({
            createdBy: adminId
        })
            .sort({ createdAt: -1 })
            .lean();

        const formIds = forms.map(form => form._id);

        // Count submissions for each form
        const submissionCounts = await Submission.aggregate([
            {
                $match: {
                    formId: { $in: formIds }
                }
            },
            {
                $group: {
                    _id: "$formId",
                    total: { $sum: 1 }
                }
            }
        ]);

        // Convert submission counts into a lookup object
        const countMap = {};

        submissionCounts.forEach(item => {
            countMap[item._id.toString()] = item.total;
        });

        // Attach submission count to each form
        const recentForms = forms.slice(0, 5).map(form => ({
            ...form,
            totalSubmissions: countMap[form._id.toString()] || 0
        }));

        const totalForms = forms.length;

        const publishedForms = forms.filter(
            form => form.status === "published"
        ).length;

        const draftForms = forms.filter(
            form => form.status === "draft"
        ).length;

        const totalSubmissions = submissionCounts.reduce(
            (total, item) => total + item.total,
            0
        );

        return res.status(200).json({
            success: true,
            stats: {
                totalForms,
                publishedForms,
                draftForms,
                totalSubmissions
            },
            recentForms
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};