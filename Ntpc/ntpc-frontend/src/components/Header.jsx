import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ntpc from '../../public/ntpc-logo.png'

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border flex items-center justify-center">
            <img
              src={ntpc}
              alt="NTPC Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-gray-900">
              Vehicle Management
            </h1>
            <p className="text-xs text-gray-400">
              Internal System
            </p>
          </div>
        </div>

        {/* Right: User + Actions */}
        <div className="flex items-center gap-4">

          {/* Notification (future use) */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>

          {/* User Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-800">
              {user?.name || "Employee"}
            </span>
            <span className="text-xs text-gray-400">
              {user?.role || "User"}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
}