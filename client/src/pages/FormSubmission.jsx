
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    CheckCircle,
    Send,
    FileText,
    LoaderCircle,
} from "lucide-react";

import "./FormSubmission.css";

const API_URL = "http://localhost:5000/api";

function FormSubmission() {
    const { formId } = useParams();

    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState("");


    useEffect(() => {
        const fetchForm = async () => {
            try {
                setLoading(true);
                setApiError("");

                const response = await axios.get(
                    `${API_URL}/forms/${formId}`
                );

                setForm(response.data.data);

            } catch (error) {
                console.error("Fetch form error:", error);

                setApiError(
                    error.response?.data?.message ||
                    "Unable to load this form."
                );
            } finally {
                setLoading(false);
            }
        };

        if (formId) {
            fetchForm();
        }
    }, [formId]);


    const handleChange = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: "",
        }));

        setApiError("");
    };


    const handleCheckboxChange = (key, option) => {
        const currentValues = answers[key] || [];

        const updatedValues = currentValues.includes(option)
            ? currentValues.filter((item) => item !== option)
            : [...currentValues, option];

        handleChange(key, updatedValues);
    };


    const validateForm = () => {
        const newErrors = {};

        form.fields.forEach((field) => {
            const value = answers[field.key];

            const isEmpty =
                value === undefined ||
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0);

            if (field.required && isEmpty) {
                newErrors[field.key] =
                    `${field.label} is required`;
                return;
            }

            if (isEmpty) return;

            if (
                field.type === "EMAIL" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                newErrors[field.key] = "Enter a valid email address";
            }

            if (
                field.type === "PHONE" &&
                !/^\+?[0-9]{10,15}$/.test(
                    String(value).replace(/[\s-]/g, "")
                )
            ) {
                newErrors[field.key] = "Enter a valid phone number";
            }

            if (
                field.type === "NUMBER" &&
                !Number.isFinite(Number(value))
            ) {
                newErrors[field.key] = "Enter a valid number";
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setApiError("");

            const submissionData = {
                data: answers,
            };

            const response = await axios.post(
                `${API_URL}/forms/${formId}/submissions`,
                submissionData
            );

            console.log("Submission successful:", response.data);

            setSubmitted(true);

        } catch (error) {
            console.error("Submission error:", error);

            const responseData = error.response?.data;

            if (responseData?.errors) {
                setErrors(responseData.errors);
            }

            setApiError(
                responseData?.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="submission-page">
                <div className="success-card">
                    <LoaderCircle className="loading-icon" size={40} />
                    <h2>Loading Form...</h2>
                </div>
            </div>
        );
    }


    if (!form) {
        return (
            <div className="submission-page">
                <div className="success-card">
                    <FileText size={50} color="#dc2626" />
                    <h2>Form Unavailable</h2>
                    <p>{apiError || "Form not found."}</p>
                </div>
            </div>
        );
    }



    if (submitted) {
        return (
            <div className="submission-page">
                <div className="success-card">
                    <CheckCircle size={65} color="#16a34a" />

                    <h2>Response Submitted!</h2>

                    <p>
                        Your response has been recorded successfully.
                        Thank you for submitting the form.
                    </p>
                </div>
            </div>
        );
    }

    // =================================
    // DYNAMIC FORM UI
    // =================================

    return (
        <div className="submission-page">
            <div className="submission-container">

                {/* FORM HEADER */}

                <div className="submission-header">
                    <div className="form-icon">
                        <FileText size={25} />
                    </div>

                    <h1>{form.name}</h1>

                    <p>{form.description}</p>

                    <div className="form-info">
                        <span>* Required fields</span>
                    </div>
                </div>

                {/* FORM FIELDS */}

                <form onSubmit={handleSubmit} noValidate>

                    {form.fields.map((field, index) => (
                        <div
                            className="submission-field"
                            key={field.key}
                        >
                            <label className="submission-label">
                                {index + 1}. {field.label}

                                {field.required && (
                                    <span className="required-star">
                                        {" "}*
                                    </span>
                                )}
                            </label>

                            {/* TEXT, EMAIL, NUMBER, PHONE, DATE */}

                            {[
                                "TEXT",
                                "EMAIL",
                                "NUMBER",
                                "PHONE",
                                "DATE",
                            ].includes(field.type) && (
                                    <input
                                        type={
                                            field.type === "TEXT"
                                                ? "text"
                                                : field.type === "PHONE"
                                                    ? "tel"
                                                    : field.type.toLowerCase()
                                        }
                                        placeholder={field.placeholder || ""}
                                        required={field.required}
                                        value={answers[field.key] ?? ""}
                                        onChange={(e) =>
                                            handleChange(
                                                field.key,
                                                e.target.value
                                            )
                                        }
                                    />
                                )}

                            {/* TEXTAREA */}

                            {field.type === "TEXTAREA" && (
                                <textarea
                                    rows="4"
                                    placeholder={field.placeholder || ""}
                                    required={field.required}
                                    value={answers[field.key] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field.key,
                                            e.target.value
                                        )
                                    }
                                />
                            )}

                            {/* SELECT */}

                            {field.type === "SELECT" && (
                                <select
                                    required={field.required}
                                    value={answers[field.key] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field.key,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select an option
                                    </option>

                                    {(field.options || []).map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* RADIO */}

                            {field.type === "RADIO" && (
                                <div className="choice-group">
                                    {(field.options || []).map((option) => (
                                        <label
                                            key={option}
                                            className="choice-item"
                                        >
                                            <input
                                                type="radio"
                                                name={field.key}
                                                value={option}
                                                required={
                                                    field.required &&
                                                    !answers[field.key]
                                                }
                                                checked={
                                                    answers[field.key] === option
                                                }
                                                onChange={() =>
                                                    handleChange(
                                                        field.key,
                                                        option
                                                    )
                                                }
                                            />

                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}


                            {field.type === "CHECKBOX" && (
                                <div className="choice-group">
                                    {(field.options || []).map((option) => (
                                        <label
                                            key={option}
                                            className="choice-item"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(
                                                    answers[field.key] || []
                                                ).includes(option)}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        field.key,
                                                        option
                                                    )
                                                }
                                            />

                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* FIELD ERROR */}

                            {errors[field.key] && (
                                <p className="field-error">
                                    {errors[field.key]}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* API ERROR */}

                    {apiError && (
                        <p className="field-error">
                            {apiError}
                        </p>
                    )}

                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        className="submit-form-btn"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle size={17} />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={17} />
                                Submit Response
                            </>
                        )}
                    </button>

                    <p className="form-footer">
                        Powered by FormBuilder
                    </p>

                </form>
            </div>
        </div>
    );
}

export default FormSubmission;
