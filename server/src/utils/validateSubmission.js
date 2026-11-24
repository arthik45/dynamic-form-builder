
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^\+?[\d\s()-]{7,20}$/;

const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        value === ""
    );
};

export const validateSubmission = (fields, submittedData) => {
    const errors = {};
    const cleanedData = {};

    if (
        !submittedData ||
        typeof submittedData !== "object" ||
        Array.isArray(submittedData)
    ) {
        return {
            errors: { general: "Invalid submission data" },
            cleanedData
        };
    }

    // Reject unknown fields
    const allowedKeys = fields.map((field) => field.key);

    for (const key of Object.keys(submittedData)) {
        if (
            !allowedKeys.includes(key) ||
            ["__proto__", "constructor", "prototype"].includes(key)
        ) {
            errors[key] = "Unknown field";
        }
    }

    // Validate each field using the database definition
    for (const field of fields) {
        const {
            key,
            label,
            type,
            required,
            options = [],
            minLength,
            maxLength,
            min,
            max,
            defaultValue
        } = field;

        let value = Object.hasOwn(submittedData, key)
            ? submittedData[key]
            : defaultValue;

        if (isEmpty(value)) {
            if (required) {
                errors[key] = `${label} is required`;
            } else if (defaultValue !== undefined && defaultValue !== "") {
                cleanedData[key] = defaultValue;
            }
            continue;
        }

        // TEXT
        if (type === "TEXT") {
            if (typeof value !== "string") {
                errors[key] = `${label} must be text`;
                continue;
            }

            value = value.trim();

            if (required && !value) {
                errors[key] = `${label} is required`;
            } else if (minLength && value.length < minLength) {
                errors[key] = `${label} must contain at least ${minLength} characters`;
            } else if (maxLength && value.length > maxLength) {
                errors[key] = `${label} cannot exceed ${maxLength} characters`;
            }
        }

        // EMAIL
        else if (type === "EMAIL") {
            if (typeof value !== "string") {
                errors[key] = `${label} must be a valid email`;
                continue;
            }

            value = value.trim();

            if (!emailRegex.test(value)) {
                errors[key] = `${label} must be a valid email`;
            }
        }

        // NUMBER
        else if (type === "NUMBER") {
            if (
                typeof value !== "number" &&
                !(typeof value === "string" && value.trim() !== "")
            ) {
                errors[key] = `${label} must be a number`;
                continue;
            }

            value = Number(value);

            if (!Number.isFinite(value)) {
                errors[key] = `${label} must be a valid number`;
            } else if (min !== undefined && value < min) {
                errors[key] = `${label} must be at least ${min}`;
            } else if (max !== undefined && value > max) {
                errors[key] = `${label} cannot exceed ${max}`;
            }
        }

        // PHONE
        else if (type === "PHONE") {
            if (typeof value !== "string") {
                errors[key] = `${label} must be a valid phone number`;
                continue;
            }

            value = value.trim();

            const digitCount = value.replace(/\D/g, "").length;

            if (!phoneRegex.test(value) || digitCount < 7 || digitCount > 15) {
                errors[key] = `${label} must be a valid phone number`;
            }
        }

        // TEXTAREA
        else if (type === "TEXTAREA") {
            if (typeof value !== "string") {
                errors[key] = `${label} must be text`;
                continue;
            }

            value = value.trim();

            if (minLength && value.length < minLength) {
                errors[key] = `${label} must contain at least ${minLength} characters`;
            } else if (maxLength && value.length > maxLength) {
                errors[key] = `${label} cannot exceed ${maxLength} characters`;
            }
        }

        // DATE
        else if (type === "DATE") {
            if (
                typeof value !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
                Number.isNaN(Date.parse(value)) ||
                new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) !== value
            ) {
                errors[key] = `${label} must be a valid date`;
            }
        }

        // SELECT AND RADIO
        else if (type === "SELECT" || type === "RADIO") {
            if (typeof value !== "string" || !options.includes(value)) {
                errors[key] = `${label} contains an invalid option`;
            }
        }

        // CHECKBOX
        else if (type === "CHECKBOX") {
            if (!Array.isArray(value)) {
                errors[key] = `${label} must be an array`;
                continue;
            }

            if (value.some(
                (item) => typeof item !== "string" || !options.includes(item)
            )) {
                errors[key] = `${label} contains an invalid option`;
            } else if (new Set(value).size !== value.length) {
                errors[key] = `${label} contains duplicate options`;
            }
        }

        if (!errors[key]) {
            cleanedData[key] = value;
        }
    }

    return {
        errors,
        cleanedData
    };
};
