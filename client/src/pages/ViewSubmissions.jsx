
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Eye,
    FileText,
    Search,
    Calendar,
    Users,
    X,
} from "lucide-react";

import "./ViewSubmissions.css";

function ViewSubmissions() {
    const { formId } = useParams();
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Temporary sample data for frontend testing
    useEffect(() => {
        const sampleData = [
            {
                _id: "1",
                answers: {
                    fullName: "Arun Kumar",
                    email: "arun@gmail.com",
                    phone: "9876543210",
                    department: "Development",
                    experience: "2 Years",
                },
                createdAt: "2026-11-24T10:30:00",
            },
            {
                _id: "2",
                answers: {
                    fullName: "Priya",
                    email: "priya@gmail.com",
                    phone: "9876543211",
                    department: "Testing",
                    experience: "1 Year",
                },
                createdAt: "2026-11-24T11:30:00",
            },
            {
                _id: "3",
                answers: {
                    fullName: "Rahul",
                    email: "rahul@gmail.com",
                    phone: "9876543212",
                    department: "HR",
                    experience: "3 Years",
                },
                createdAt: "2026-11-23T09:30:00",
            },
        ];

        setSubmissions(sampleData);
    }, [formId]);

    const filteredSubmissions = submissions.filter((submission) => {
        const name = String(
            submission.answers?.fullName || ""
        ).toLowerCase();

        const email = String(
            submission.answers?.email || ""
        ).toLowerCase();

        return (
            name.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase())
        );
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="submissions-page">

            {/* Header */}
            <div className="submissions-header">
                <div>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/admin/myforms")}
                    >
                        <ArrowLeft size={18} />
                        Back to My Forms
                    </button>

                    <h1>Form Submissions</h1>
                    <p>View and manage all responses received for this form.</p>
                </div>
            </div>

            {/* Summary */}
            <div className="submission-stats">
                <div className="submission-stat-card">
                    <div className="stat-icon">
                        <Users size={22} />
                    </div>
                    <div>
                        <h2>{submissions.length}</h2>
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

            {/* Table Section */}
            <div className="submissions-table-card">

                <div className="table-top">
                    <div>
                        <h2>All Responses</h2>
                        <p>List of users who submitted this form</p>
                    </div>

                    <div className="submission-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((submission, index) => (
                                    <tr key={submission._id}>
                                        <td>{index + 1}</td>

                                        <td className="respondent-name">
                                            {submission.answers?.fullName || "N/A"}
                                        </td>

                                        <td>{submission.answers?.email || "N/A"}</td>

                                        <td>
                                            {submission.answers?.department || "N/A"}
                                        </td>

                                        <td>
                                            <span className="date-cell">
                                                <Calendar size={14} />
                                                {formatDate(submission.createdAt)}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-details-btn"
                                                onClick={() =>
                                                    setSelectedSubmission(submission)
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
            </div>

            {/* Individual Submission Modal */}
            {selectedSubmission && (
                <div className="submission-modal-overlay">
                    <div className="submission-modal">

                        <div className="modal-header">
                            <div>
                                <h2>Submission Details</h2>
                                <p>Complete answers submitted by the user</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {Object.entries(
                                selectedSubmission.answers || {}
                            ).map(([key, value]) => (
                                <div className="answer-item" key={key}>
                                    <label>
                                        {key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) => str.toUpperCase())}
                                    </label>

                                    <p>
                                        {Array.isArray(value)
                                            ? value.join(", ")
                                            : typeof value === "object" && value !== null
                                                ? JSON.stringify(value)
                                                : String(value ?? "N/A")}
                                    </p>
                                </div>
                            ))}

                            <div className="answer-item">
                                <label>Submitted Date</label>
                                <p>
                                    {formatDate(selectedSubmission.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setSelectedSubmission(null)}
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
