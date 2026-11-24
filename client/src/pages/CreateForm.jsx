
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "../features/forms/formSlice";
import {
    ArrowLeft,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Save,
    Eye,
    FileText,
    Settings2,
    GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";

import "./CreateForm.css";


const FIELD_TYPES = [
    "TEXT",
    "EMAIL",
    "NUMBER",
    "PHONE",
    "TEXTAREA",
    "DATE",
    "SELECT",
    "RADIO",
    "CHECKBOX",
];

const createNewField = () => ({
    id: crypto.randomUUID(),
    label: "",
    key: "",
    type: "TEXT",
    placeholder: "",
    defaultValue: "",
    required: false,
    options: [],
    minLength: "",
    maxLength: "",
});

function CreateForm() {
    // const navigate = useNavigate();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state) => state.form
    );

    const [formName, setFormName] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [shareUrl, setShareUrl] = useState("");

    // Add a new field
    const handleAddField = () => {
        const newField = createNewField();

        setFields((prev) => [...prev, newField]);
        setSelectedField(newField.id);
    };

    // Update a field
    const handleFieldChange = (id, property, value) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === id
                    ? { ...field, [property]: value }
                    : field
            )
        );
    };

    // Delete a field
    const handleDeleteField = (id) => {
        setFields((prev) => prev.filter((field) => field.id !== id));

        if (selectedField === id) {
            setSelectedField(null);
        }
    };

    // Move field up or down
    const handleMoveField = (index, direction) => {
        const updatedFields = [...fields];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= fields.length) return;

        [updatedFields[index], updatedFields[newIndex]] = [
            updatedFields[newIndex],
            updatedFields[index],
        ];

        setFields(updatedFields);
    };

    // Convert label into field key
    const handleLabelChange = (id, value) => {
        const key = value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");

        setFields((prev) =>
            prev.map((field) =>
                field.id === id
                    ? { ...field, label: value, key }
                    : field
            )
        );
    };

    // Save form

    const handleSave = async (status) => {
        if (!formName.trim()) {
            toast.error("Please enter form name");
            return;
        }

        if (fields.length === 0) {
            toast.error("Please add at least one field");
            return;
        }

        const hasInvalidField = fields.some(
            (field) => !field.label.trim() || !field.key.trim()
        );

        if (hasInvalidField) {
            toast.error("Please enter a label for every field");
            return;
        }

        const keys = fields.map((field) => field.key);

        if (new Set(keys).size !== keys.length) {
            toast.error("Field keys must be unique");
            return;
        }

        const invalidOptions = fields.some(
            (field) =>
                ["SELECT", "RADIO", "CHECKBOX"].includes(field.type) &&
                field.options.length === 0
        );

        if (invalidOptions) {
            toast.error(
                "Please add options to Select, Radio and Checkbox fields"
            );
            return;
        }

        const formData = {
            name: formName.trim(),
            description,

            fields: fields.map(({ id, ...field }, index) => ({
                ...field,
                minLength: field.minLength === ""
                    ? undefined
                    : Number(field.minLength),
                maxLength: field.maxLength === ""
                    ? undefined
                    : Number(field.maxLength),
                order: index,
            })),

            status,
        };

        try {
            const result = await dispatch(createForm(formData)).unwrap();

            toast.success(result.message || "Form created successfully!");

            // Get created form ID from backend response
            const formId =
                result.form?._id ||
                result._id;

            if (status === "PUBLISHED" && formId) {
                const url = `${window.location.origin}/forms/${formId}`;
                setShareUrl(url);
            } else {
                navigate("/admin/myforms");
            }

        } catch (error) {
            console.error("Create Form Error:", error);

            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };


    const activeField = fields.find(
        (field) => field.id === selectedField
    );

    return (
        <div className="create-form-page">

            {/* Header */}
            <header className="create-header">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2>Create Form</h2>
                        <p>Build and customize your dynamic form</p>
                    </div>
                </div>

                <div className="header-actions">
                    <button
                        className="draft-btn"
                        onClick={() => handleSave("DRAFT")}
                        disabled={loading}
                    >
                        <Save size={16} />
                        {loading ? "Saving..." : "Save Draft"}
                    </button>

                    <button
                        className="publish-btn"
                        onClick={() => handleSave("PUBLISHED")}
                        disabled={loading}
                    >
                        <Eye size={16} />
                        {loading ? "Publishing..." : "Publish Form"}
                    </button>
                </div>
            </header>

            <div className="create-form-layout">

                {/* Left: Form Builder */}
                <main className="builder-section">

                    {/* Form Details */}
                    <section className="builder-card">
                        <div className="section-heading">
                            <FileText size={20} />
                            <h3>Form Details</h3>
                        </div>

                        <div className="input-group">
                            <label>Form Name *</label>
                            <input
                                type="text"
                                placeholder="Enter form name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Enter form description"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Fields */}
                    <section className="builder-card">
                        <div className="fields-heading">
                            <div className="section-heading">
                                <Settings2 size={20} />
                                <h3>Form Fields</h3>
                                <span className="field-count">
                                    {fields.length} Fields
                                </span>
                            </div>

                            <button
                                className="add-field-btn"
                                onClick={handleAddField}
                            >
                                <Plus size={17} />
                                Add Field
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="empty-fields">
                                <FileText size={38} />
                                <h3>No fields added yet</h3>
                                <p>
                                    Start building your form by adding your first field.
                                </p>

                                <button
                                    className="add-field-btn"
                                    onClick={handleAddField}
                                >
                                    <Plus size={17} />
                                    Add Your First Field
                                </button>
                            </div>
                        ) : (
                            <div className="fields-list">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className={`field-item ${selectedField === field.id ? "active" : ""
                                            }`}
                                        onClick={() => setSelectedField(field.id)}
                                    >
                                        <div className="field-top">
                                            <div className="field-title">
                                                <GripVertical size={18} color="#999" />

                                                <div>
                                                    <h4>
                                                        {field.label || `Untitled Field ${index + 1}`}
                                                    </h4>
                                                    <span>{field.type}</span>
                                                </div>

                                                {field.required && (
                                                    <span className="required-tag">Required</span>
                                                )}
                                            </div>

                                            <div className="field-actions">
                                                <button
                                                    title="Move up"
                                                    disabled={index === 0}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveField(index, -1);
                                                    }}
                                                >
                                                    <ChevronUp size={18} />
                                                </button>

                                                <button
                                                    title="Move down"
                                                    disabled={index === fields.length - 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveField(index, 1);
                                                    }}
                                                >
                                                    <ChevronDown size={18} />
                                                </button>

                                                <button
                                                    title="Delete field"
                                                    className="delete-field"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteField(field.id);
                                                    }}
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </div>

                                        {selectedField === field.id && (
                                            <div className="field-editor">

                                                <div className="editor-grid">
                                                    <div className="input-group">
                                                        <label>Field Label *</label>
                                                        <input
                                                            value={field.label}
                                                            placeholder="Enter label"
                                                            onChange={(e) =>
                                                                handleLabelChange(
                                                                    field.id,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="input-group">
                                                        <label>Field Key *</label>
                                                        <input
                                                            value={field.key}
                                                            placeholder="field_key"
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.id,
                                                                    "key",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="input-group">
                                                        <label>Field Type</label>
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.id,
                                                                    "type",
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            {FIELD_TYPES.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="input-group">
                                                        <label>Placeholder</label>
                                                        <input
                                                            value={field.placeholder}
                                                            placeholder="Enter placeholder"
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.id,
                                                                    "placeholder",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="input-group">
                                                        <label>Default Value</label>
                                                        <input
                                                            value={field.defaultValue}
                                                            placeholder="Enter default value"
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.id,
                                                                    "defaultValue",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {["TEXT", "EMAIL", "PHONE", "TEXTAREA"].includes(
                                                        field.type
                                                    ) && (
                                                            <>
                                                                <div className="input-group">
                                                                    <label>Minimum Length</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={field.minLength}
                                                                        placeholder="Minimum length"
                                                                        onChange={(e) =>
                                                                            handleFieldChange(
                                                                                field.id,
                                                                                "minLength",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="input-group">
                                                                    <label>Maximum Length</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={field.maxLength}
                                                                        placeholder="Maximum length"
                                                                        onChange={(e) =>
                                                                            handleFieldChange(
                                                                                field.id,
                                                                                "maxLength",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                </div>

                                                {/* Options for select, radio and checkbox */}
                                                {["SELECT", "RADIO", "CHECKBOX"].includes(
                                                    field.type
                                                ) && (
                                                        <div className="input-group options-group">
                                                            <label>Field Options *</label>
                                                            <textarea
                                                                rows="3"
                                                                placeholder="Enter options separated by commas. Example: Male, Female, Other"
                                                                value={field.options.join(", ")}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        field.id,
                                                                        "options",
                                                                        [
                                                                            ...new Set(
                                                                                e.target.value
                                                                                    .split(",")
                                                                                    .map((item) => item.trim())
                                                                                    .filter(Boolean)
                                                                            ),
                                                                        ]
                                                                    )
                                                                }
                                                            />
                                                            <small>
                                                                Separate each option with a comma.
                                                            </small>
                                                        </div>
                                                    )}

                                                <label className="required-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) =>
                                                            handleFieldChange(
                                                                field.id,
                                                                "required",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    This field is required
                                                </label>

                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                {/* Right: Settings / Summary */}
                <aside className="form-sidebar">
                    <section className="builder-card">
                        <h3>Form Summary</h3>

                        <div className="summary-item">
                            <span>Form Name</span>
                            <strong>{formName || "Untitled Form"}</strong>
                        </div>

                        <div className="summary-item">
                            <span>Total Fields</span>
                            <strong>{fields.length}</strong>
                        </div>

                        <div className="summary-item">
                            <span>Required Fields</span>
                            <strong>
                                {fields.filter((field) => field.required).length}
                            </strong>
                        </div>

                        <div className="summary-item">
                            <span>Optional Fields</span>
                            <strong>
                                {fields.filter((field) => !field.required).length}
                            </strong>
                        </div>
                    </section>

                    <section className="builder-card">
                        <h3>Supported Field Types</h3>
                        <div className="supported-types">
                            {FIELD_TYPES.map((type) => (
                                <span key={type}>{type}</span>
                            ))}
                        </div>
                    </section>

                    <div className="sidebar-note">
                        <strong>Tip</strong>
                        <p>
                            Click any field to edit its properties. Use the arrow
                            buttons to change the field order.
                        </p>
                    </div>
                </aside>
            </div>


            {shareUrl && (
                <div className="share-overlay">
                    <div className="share-modal">

                        <div className="share-success-icon">
                            <Eye size={28} />
                        </div>

                        <h2>Form Published Successfully!</h2>

                        <p>
                            Your form is ready. Share this link with anyone
                            who needs to submit a response.
                        </p>

                        <div className="share-url-box">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                            />

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast.success("Link copied!");
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        <div className="share-buttons">

                            <button
                                className="whatsapp-share"
                                onClick={() => {
                                    const message = encodeURIComponent(
                                        `Please fill out this form:\n${shareUrl}`
                                    );

                                    window.open(
                                        `https://wa.me/?text=${message}`,
                                        "_blank"
                                    );
                                }}
                            >
                                <icon name="message-circle" />
                                WhatsApp
                            </button>

                            <button
                                className="gmail-share"
                                onClick={() => {
                                    const subject = encodeURIComponent(
                                        "Please fill out this form"
                                    );

                                    const body = encodeURIComponent(
                                        `Hello,\n\nPlease fill out this form using the link below:\n\n${shareUrl}\n\nThank you.`
                                    );

                                    window.open(
                                        `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,
                                        "_blank"
                                    );
                                }}
                            >
                                <icon name="mail" />
                                Gmail
                            </button>

                        </div>

                        <button
                            className="close-share-btn"
                            onClick={() => navigate("/admin/myforms")}
                        >
                            Go to My Forms
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateForm;
