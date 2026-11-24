
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    FileText,
} from "lucide-react";

import { loginAdmin, clearError } from "../../features/auth/authSlice";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { loading, error } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (error) {
            dispatch(clearError());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(loginAdmin(formData)).unwrap();

            toast.success("Login successful!");

            navigate("/admin/dashboard");
        } catch (error) {
            toast.error(error.message || "Invalid email or password");
            console.log("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">

            <div className="hidden lg:flex w-1/2 bg-[#111827]
        text-white flex-col justify-between p-12">

                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <FileText size={25} />
                    </div>
                    <h1 className="text-2xl font-bold">FormBuilder</h1>
                </div>

                <div>
                    <h2 className="text-4xl font-bold leading-tight mb-5">
                        Create forms.
                        <br />
                        Collect responses.
                        <br />
                        Manage everything.
                    </h2>

                    <p className="text-slate-400 text-lg">
                        A simple and powerful platform to
                        build dynamic forms and manage
                        your submissions.
                    </p>
                </div>

                <p className="text-slate-500 text-sm">
                    © 2026 FormFlow. All rights reserved.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">

                <div className="w-full max-w-md">

                    <div className="lg:hidden flex items-center
            justify-center gap-2 mb-10">
                        <FileText className="text-blue-600" size={30} />
                        <h1 className="text-2xl font-bold text-slate-900">
                            FormFlow
                        </h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Welcome back!
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Sign in to your admin account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-5">
                            <label className="block text-sm font-medium
                text-slate-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5
                  text-slate-400" size={19} />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300
                    rounded-lg py-3 pl-11 pr-4 outline-none
                    focus:border-blue-500 focus:ring-2
                    focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium
                text-slate-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5
                  text-slate-400" size={19} />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300
                    rounded-lg py-3 pl-11 pr-12 outline-none
                    focus:border-blue-500 focus:ring-2
                    focus:ring-blue-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5
                    text-slate-400"
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

            
                        {error && (
                            <p className="text-red-500 text-sm mb-4">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400 disabled:cursor-not-allowed
                text-white font-semibold py-3 rounded-lg
                transition"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    <p className="text-center text-xs text-slate-400 mt-8">
                        Admin access only. Contact your system administrator
                        if you need assistance.
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;
