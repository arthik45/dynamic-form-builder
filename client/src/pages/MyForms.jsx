
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";

import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    ClipboardList, ArrowLeft
} from "lucide-react";

import {
    fetchForms,
    deleteForm
} from "../features/forms/formSlice";

import "./MyForms.css";

function MyForms() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { forms, loading, error } = useSelector(
        (state) => state.form
    );
    console.log("Redux Forms:", forms);
    console.log("Loading:", loading);
    console.log("Error:", error);

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchForms());
    }, [dispatch]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this form?"
        );

        if (!confirmDelete) return;

        try {
            await dispatch(deleteForm(id)).unwrap();

            alert("Form deleted successfully!");
        } catch (error) {
            alert(error);
        }
    };

    const filteredForms = forms.filter((form) =>
        form.name?.toLowerCase().includes(search.toLowerCase())
    );

    const publishedForms = forms.filter(
        (form) => form.status?.toLowerCase() === "published"
    ).length;

    const totalSubmissions = forms.reduce(
        (total, form) =>
            total + (form.totalSubmissions || 0),
        0
    );

    return (
        <div className="myforms-page">
            <Navbar />

            <div className="myforms-header">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2>My Forms</h2>
                        <p>Manage all your created forms in one place.</p>
                    </div>
                </div>

                <button
                    className="create-new-btn"
                    onClick={() => navigate("/admin/createform")}
                >
                    <Plus size={18} />
                    Create New Form
                </button>
            </div>

            <div className="myforms-stats">

                <div className="myforms-stat-card">
                    <div className="stat-icon purple">
                        <FileText size={22} />
                    </div>
                    <div>
                        <span>Total Forms</span>
                        <h3>{forms.length}</h3>
                    </div>
                </div>

                <div className="myforms-stat-card">
                    <div className="stat-icon green">
                        <Eye size={22} />
                    </div>
                    <div>
                        <span>Published Forms</span>
                        <h3>{publishedForms}</h3>
                    </div>
                </div>

                <div className="myforms-stat-card">
                    <div className="stat-icon orange">
                        <ClipboardList size={22} />
                    </div>
                    <div>
                        <span>Total Submissions</span>
                        <h3>{totalSubmissions}</h3>
                    </div>
                </div>

            </div>

            {/* Forms Table */}
            <div className="myforms-table-card">

                <div className="table-top">
                    <div>
                        <h3>All Forms</h3>
                        <p>View and manage your forms</p>
                    </div>

                    <div className="form-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search forms..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="table-responsive">

                    <table className="myforms-table">

                        <thead>
                            <tr>
                                <th>Form Name</th>
                                <th>Total Submissions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="4">
                                        <p>Loading forms...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4">
                                        <p>{error}</p>
                                    </td>
                                </tr>
                            ) : filteredForms.length > 0 ? (

                                filteredForms.map((form) => (

                                    <tr key={form._id}>

                                        <td>
                                            <div className="form-name-cell">
                                                <div className="form-icon">
                                                    <FileText size={19} />
                                                </div>

                                                <span>{form.name}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="submission-count">
                                                {form.totalSubmissions || 0}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${form.status?.toLowerCase() === "published"
                                                    ? "published"
                                                    : "draft"
                                                    }`}
                                            >
                                                {form.status?.toUpperCase()}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="table-actions">


                                                {/* View Submissions */}
                                                <button
                                                    className="view-details-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/forms/${form._id}/submissions`
                                                        )
                                                    }
                                                >
                                                    <Eye size={16} />
                                                    View Submissions
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(form._id)
                                                    }
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="4">
                                        <div className="no-forms">
                                            <FileText size={35} />
                                            <h3>No forms found</h3>
                                            <p>
                                                Create your first form to get started.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            </div>
        </div>
    );
}

export default MyForms;
