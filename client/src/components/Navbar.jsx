
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

import {
    FileText,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    Files,
    PlusCircle
} from "lucide-react";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        navigate("/");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
            ? "bg-blue-100 text-blue-700"
            : "text-slate-700 hover:bg-slate-100"
        }`;

    const handleNavigation = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-slate-200 shadow-sm">

            <div className="max-w-full px-4 sm:px-6 py-3">

                {/* Navbar Header */}
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <FileText
                            size={28}
                            className="text-blue-600"
                        />

                        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                            FormBuilder
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">

                        <NavLink
                            to="/admin/dashboard"
                            className={navLinkClass}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/admin/myforms"
                            className={navLinkClass}
                        >
                            <Files size={18} />
                            My Forms
                        </NavLink>

                        <NavLink
                            to="/admin/createform"
                            className={navLinkClass}
                        >
                            <PlusCircle size={18} />
                            Create Form
                        </NavLink>

                    </div>

                    {/* Desktop Logout */}
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center gap-2 text-slate-700 hover:text-red-600 font-medium text-sm transition"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X size={25} />
                        ) : (
                            <Menu size={25} />
                        )}
                    </button>

                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-3 border-t border-slate-200">

                        <div className="flex flex-col gap-2">

                            <NavLink
                                to="/admin/dashboard"
                                onClick={handleNavigation}
                                className={navLinkClass}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/admin/myforms"
                                onClick={handleNavigation}
                                className={navLinkClass}
                            >
                                <Files size={18} />
                                My Forms
                            </NavLink>

                            <NavLink
                                to="/admin/createform"
                                onClick={handleNavigation}
                                className={navLinkClass}
                            >
                                <PlusCircle size={18} />
                                Create Form
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;
