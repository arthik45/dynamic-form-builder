
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"
import { FileText, LogOut } from "lucide-react";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive
            ? "bg-blue-100 text-blue-700"
            : "text-slate-700 hover:bg-slate-100"
        }`;

    return (
        <nav className="bg-white border-b border-slate-200 px-4 py-4 pt-0">

            <div className="max-w-full flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <FileText
                        size={28}
                        className="text-blue-600"
                    />

                    <h1 className="text-2xl font-bold text-blue-600">
                        FormBuilder
                    </h1>
                </div>

                <div className="flex items-center gap-2">

                    <NavLink
                        to="/admin/dashboard"
                        className={navLinkClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/myforms"
                        className={navLinkClass}
                    >
                        My Forms
                    </NavLink>

                    <NavLink
                        to="/admin/createform"
                        className={navLinkClass}
                    >
                        Create Form
                    </NavLink>

                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-700
                    hover:text-red-600 font-medium text-sm
                    transition"
                >
                    <LogOut size={19} />
                    Logout
                </button>

            </div>
        </nav>
    );
}

export default Navbar;
