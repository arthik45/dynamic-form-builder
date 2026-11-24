
import {
  FileText,
  Send,
  CheckCircle,
  FileEdit,
  Plus,
  ArrowUpRight
} from "lucide-react";
import Navbar from "../components/Navbar";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const stats = [
  {
    title: "Total Forms",
    value: "24",
    change: "+12%",
    icon: FileText,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Published Forms",
    value: "18",
    change: "+8%",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Draft Forms",
    value: "06",
    change: "Active drafts",
    icon: FileEdit,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Total Submissions",
    value: "1,284",
    change: "+18%",
    icon: Send,
    color: "bg-purple-100 text-purple-600"
  }
];

const chartData = [
  { month: "Jan", submissions: 120 },
  { month: "Feb", submissions: 180 },
  { month: "Mar", submissions: 150 },
  { month: "Apr", submissions: 280 },
  { month: "May", submissions: 230 },
  { month: "Jun", submissions: 350 },
  { month: "Jul", submissions: 420 }
];

const recentForms = [
  {
    name: "Customer Registration",
    responses: 320,
    status: "Published",
    date: "Nov 24, 2026"
  },
  {
    name: "Employee Feedback",
    responses: 180,
    status: "Published",
    date: "Nov 23, 2026"
  },
  {
    name: "Job Application",
    responses: 250,
    status: "Published",
    date: "Nov 22, 2026"
  },
  {
    name: "Event Registration",
    responses: 0,
    status: "Draft",
    date: "Nov 21, 2026"
  }
];

function Dashboard() {
  return (
      <div className="p-8">
          

          <Navbar />
      <div className="flex flex-wrap justify-between
        items-center gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening
            with your forms.
          </p>
        </div>

        <button
          onClick={() => window.location.href = "/admin/createform"}
          className="flex items-center gap-2 bg-blue-600
            hover:bg-blue-700 text-white px-5 py-3
            rounded-lg text-sm font-semibold"
        >
          <Plus size={19} />
          Create New Form
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2
        xl:grid-cols-4 gap-5 mb-8">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white p-5 rounded-xl
                border border-slate-200"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold
                    text-slate-900 mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon size={23} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4">
                <ArrowUpRight size={15}
                  className="text-green-600" />

                <span className="text-sm text-green-600 font-medium">
                  {item.change}
                </span>

                <span className="text-xs text-slate-400">
                  from last month
                </span>
              </div>

            </div>
          );
        })}

      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200
        rounded-xl p-6 mb-8">

        <div className="flex flex-wrap justify-between
          items-center gap-3 mb-6">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Submission Analytics
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track your form submissions over time
            </p>
          </div>

          <select className="border border-slate-200
            rounded-lg px-3 py-2 text-sm outline-none">
            <option>Last 7 months</option>
            <option>Last 30 days</option>
            <option>Last 12 months</option>
          </select>

        </div>

        <div className="h-72 w-full">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={chartData}>

              <defs>
                <linearGradient
                  id="submissionColor"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.25}
                  />

                  <stop offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="submissions"
                stroke="#2563eb"
                fill="url(#submissionColor)"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Recent Forms */}
      <div className="bg-white border border-slate-200
        rounded-xl overflow-hidden">

        <div className="flex justify-between items-center
          p-6 border-b border-slate-100">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Forms
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your recently created forms
            </p>
          </div>

          <button className="text-blue-600 text-sm font-semibold">
            View All
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500
              text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Form Name</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {recentForms.map((form) => (
                <tr key={form.name}
                  className="hover:bg-slate-50">

                  <td className="px-6 py-4 font-medium
                    text-slate-800">
                    {form.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {form.responses}
                  </td>

                  <td className="px-6 py-4">

                    <span className={`px-3 py-1 rounded-full
                      text-xs font-medium ${
                        form.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                      {form.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {form.date}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
