
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

import {
    ArrowLeft,
    Eye,
    FileText,
    Search,
    Calendar,
    Users,
    X,
    LoaderCircle,
} from "lucide-react";

import "./ViewSubmissions.css";

const API_URL = "http://localhost:5000/api";

function ViewSubmissions() {
    const { formId } = useParams();
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        limit: 10,
    });

    // =================================
    // FETCH SUBMISSIONS FROM BACKEND
    // =================================

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                setError("");

                // Get admin token
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${API_URL}/admin/submissions`,
                    {
                        params: {
                            formId,
                            page,
                            limit: 10,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSubmissions(response.data.data || []);

                setPagination(response.data.pagination || {
                    total: 0,
                    totalPages: 0,
                    limit: 10,
                });

            } catch (err) {
                console.error("Fetch submissions error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load submissions"
                );

            } finally {
                setLoading(false);
            }
        };

        if (formId) {
            fetchSubmissions();
        }
    }, [formId, page]);

    // =================================
    // GET ANSWER BY FIELD KEY
    // =================================

    const getAnswer = (submission, possibleKeys) => {
        const data = submission.data || {};

        const matchingKey = Object.keys(data).find((key) =>
            possibleKeys.includes(key.toLowerCase())
        );

        return matchingKey ? data[matchingKey] : "N/A";
    };

    // =================================
    // FORMAT ANSWER
    // =================================

    const formatAnswer = (value) => {
        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
        }

        return String(value ?? "N/A");
    };

    // =================================
    // SEARCH SUBMISSIONS
    // =================================

    const filteredSubmissions = submissions.filter((submission) => {
        const searchValue = search.toLowerCase();

        const allAnswers = Object.values(
            submission.data || {}
        )
            .map((value) => formatAnswer(value))
            .join(" ")
            .toLowerCase();

        return allAnswers.includes(searchValue);
    });

    // =================================
    // FORMAT DATE
    // =================================

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =================================
    // VIEW SUBMISSION DETAILS
    // =================================

    const handleViewDetails = (submission) => {
        setSelectedSubmission(submission);
    };

    return (
        <div className="submissions-page">

            {/* HEADER */}
            <Navbar />


            <div className="submissions-header">
                <div>
                    <div className="header-left">
                        <button
                            className="back-btn"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <h2>My Forms</h2>
                            {/* <p>Manage all your created forms in one place.</p> */}
                        </div>
                    </div>

                    <h1>Form Submissions</h1>

                    <p>
                        View and manage all responses received for this form.
                    </p>
                </div>
            </div>

            {/* SUMMARY CARDS */}

            <div className="submission-stats">

                <div className="submission-stat-card">
                    <div className="stat-icon">
                        <Users size={22} />
                    </div>

                    <div>
                        <h2>{pagination.total}</h2>
                        <p>Total Submissions</p>
                    </div>
                </div>

                <div className="submission-stat-card">
                    <div className="stat-icon">
                        <FileText size={22} />
                    </div>

                    <div>
                        <h2>{filteredSubmissions.length}</h2>
                        <p>Showing Results</p>
                    </div>
                </div>

            </div>

            {/* TABLE SECTION */}

            <div className="submissions-table-card">

                <div className="table-top">

                    <div>
                        <h2>All Responses</h2>
                        <p>
                            List of users who submitted this form
                        </p>
                    </div>

                    <div className="submission-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search submissions..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                </div>

                <div className="table-responsive">

                    <table className="submissions-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Respondent Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Submitted Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        <LoaderCircle size={22} />
                                        Loading submissions...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredSubmissions.length > 0 ? (

                                filteredSubmissions.map((submission, index) => (

                                    <tr key={submission._id}>

                                        <td>
                                            {(page - 1) * pagination.limit + index + 1}
                                        </td>

                                        <td className="respondent-name">
                                            {formatAnswer(
                                                getAnswer(submission, [
                                                    "fullname",
                                                    "name",
                                                    "firstname",
                                                    "username",
                                                ])
                                            )}
                                        </td>

                                        <td>
                                            {formatAnswer(
                                                getAnswer(submission, [
                                                    "email",
                                                    "emailaddress",
                                                ])
                                            )}
                                        </td>

                                        <td>
                                            {formatAnswer(
                                                getAnswer(submission, [
                                                    "department",
                                                    "dept",
                                                ])
                                            )}
                                        </td>

                                        <td>
                                            <span className="date-cell">
                                                <Calendar size={14} />

                                                {formatDate(
                                                    submission.createdAt
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-details-btn"
                                                onClick={() =>
                                                    handleViewDetails(submission)
                                                }
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No submissions found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="submission-pagination">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {pagination.totalPages}
                        </span>

                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </button>

                    </div>
                )}

            </div>

            {/* SUBMISSION DETAILS MODAL */}

            {selectedSubmission && (

                <div className="submission-modal-overlay">

                    <div className="submission-modal">

                        <div className="modal-header">

                            <div>
                                <h2>Submission Details</h2>

                                <p>
                                    Complete answers submitted by the user
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="modal-body">

                            {(
                                selectedSubmission.fieldSnapshot?.length
                                    ? selectedSubmission.fieldSnapshot
                                    : Object.keys(
                                        selectedSubmission.data || {}
                                    ).map((key) => ({
                                        key,
                                        label: key,
                                    }))
                            ).map((field) => (

                                <div
                                    className="answer-item"
                                    key={field.key}
                                >
                                    <label>
                                        {field.label}
                                    </label>

                                    <p>
                                        {formatAnswer(
                                            selectedSubmission.data?.[field.key]
                                        )}
                                    </p>

                                </div>

                            ))}

                            <div className="answer-item">
                                <label>Submitted Date</label>

                                <p>
                                    {formatDate(
                                        selectedSubmission.createdAt
                                    )}
                                </p>
                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                onClick={() =>
                                    setSelectedSubmission(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ViewSubmissions;
