import Form from "../models/Form.js";

const validateForm = (name,fields) => {
    if (!name || !name.trim()) {
        return "Form name is required"
    }
    if (!Array.isArray(fields)) {
        return "Fields must be an array"
    }

    const allowedTypes = [
        "TEXT",
        "EMAIL",
        "NUMBER",
        "PHONE",
        "TEXTAREA",
        "DATE",
        "SELECT",
        "RADIO",
        "CHECKBOX"
    ];
    const keys = new Set();
    for (let field of fields) {
        if (!field.key || !field.label || !field.type) {
            return "Every field need key, label and type"
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.key)) {
            return `Invalid field key: ${field.key}`;
        }
        if (keys.has(field.key)) {
            return `Dublicate field key: ${field.key}`
        }
        keys.add(field.key)
        if (!allowedTypes.includes(field.type)) {
            return `Invalid field type: ${field.type}`
        }
        if (
            ["SELECT", "RADIO", "CHECKBOX"].includes(field.type) &&
            (!Array.isArray(field.options) || field.options.length === 0)
        ) {
            return `${field.label} needs at least one option`;
        }
        if (
            field.options &&
            (!Array.isArray(field.options) ||
                field.options.some(
                    option => typeof option !== "string" || !option.trim()
                ))
        ) {
            return `Invalid options for ${field.label}`;
        }
    }
    return null;

}
export const createForm = async (req, res) => {
    try {
        const { name, description, fields = [] } = req.body;
        const validateError = validateForm(name, fields);
        if (validateError) {
            return res.status(400).json({
                status: false,
                message: validateError
            })
        }
        const form = await Form.create({
            name,
            description,
            fields,
            status: "draft",
            createdBy: req.user.id
        })
        return res.status(201).json({
            success: true,
            message: "Form created successfully",
            form
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create form",
            error: error.message
        })
    
    }
}

// GET ALL FORMS
export const getForms = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;

        const filter = {
            createdBy: req.user.id
        };

        if (req.query.status) {
            if (!["draft", "published"].includes(req.query.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status filter"
                });
            }

            filter.status = req.query.status;
        }

        const [forms, total] = await Promise.all([
            Form.find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit),

            Form.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            forms,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch forms",
            error: error.message
        });
    }
};

export const getformById = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        })
        if (!form) {
            return res.status(404).json({
                status: false,
                message: "Form is not found"
            })
        }
        return res.status(200).json({
            status: true,
            form
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Invalid form ID",
            error: error.message
        });
    }
}


// UPDATE FORM
export const updateForm = async (req, res) => {
    try {
        const { name, description, fields, status } = req.body;

        if (!["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid form status"
            });
        }

        const validationError = validateForm(name, fields);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const form = await Form.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.user.id
            },
            {
                name,
                description,
                fields,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Form updated successfully",
            form
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update form",
            error: error.message
        });
    }
};
export const Deleteform = async (req, res) => {
    try {
       
        const form = await Form.findOneAndDelete(
            {
                _id: req.params.id,
                createdBy: req.user.id
            }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Form Deleted successfully",
            form
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to delete form",
            error: error.message
        });
    }
};


export const getPublishedForm = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            status: "published"
        }).select("name description fields");

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Published form not found"
            });
        }

        return res.status(200).json({
            success: true,
            form
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid form ID"
        });
    }
};
