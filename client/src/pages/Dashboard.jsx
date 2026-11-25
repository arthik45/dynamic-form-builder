
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Send,
  CheckCircle,
  FileEdit,
  Plus,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

import Navbar from "../components/Navbar";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    stats,
    recentForms,
    loading,
    error
  } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Forms",
      value: stats.totalForms,
      change: "All created forms",
      icon: FileText,
      color: "bg-blue-500",
      iconColor: "bg-white/20 text-white"
    },
    {
      title: "Published Forms",
      value: stats.publishedForms,
      change: "Live forms",
      icon: CheckCircle,
      color: "bg-green-500",
      iconColor: "bg-white/20 text-white"
    },
    {
      title: "Draft Forms",
      value: stats.draftForms,
      change: "Unpublished forms",
      icon: FileEdit,
      color: "bg-orange-500",
      iconColor: "bg-white/20 text-white"
    },
    {
      title: "Total Submissions",
      value: stats.totalSubmissions,
      change: "All form responses",
      icon: Send,
      color: "bg-purple-500",
      iconColor: "bg-white/20 text-white"
    }
  ];
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="p-8">

      <Navbar />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening with your forms.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => dispatch(fetchDashboard())}
            disabled={loading}
            className="flex items-center gap-2 border border-slate-300
                        text-slate-700 px-4 py-3 rounded-lg text-sm font-semibold
                        hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/admin/createform")}
            className="flex items-center gap-2 bg-blue-600
                        hover:bg-blue-700 text-white px-5 py-3
                        rounded-lg text-sm font-semibold"
          >
            <Plus size={19} />
            Create New Form
          </button>

        </div>
      </div>

    
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200
                p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics */}
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`${item.color} p-6 rounded-xl shadow-sm text-white`}
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm font-medium text-white/90">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {loading ? "..." : item.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${item.iconColor}`}>
                  <Icon size={25} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-5">
                <ArrowUpRight size={16} className="text-white" />

                <span className="text-sm text-white/90 font-medium">
                  {item.change}
                </span>
              </div>

            </div>
          );
        })}

      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-slate-100">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Forms
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your recently created forms
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/myforms")}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700"
          >
            View All
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Form Name</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">
                    Loading forms...
                  </td>
                </tr>
              ) : recentForms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">
                    No forms created yet.
                  </td>
                </tr>
              ) : (
                recentForms.map((form) => (
                  <tr
                    key={form._id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {form.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {form.totalSubmissions}
                    </td>

                    <td className="px-6 py-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${form.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                        }`}>
                        {form.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(form.createdAt)}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
