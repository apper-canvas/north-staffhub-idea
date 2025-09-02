import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMobileMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const getPageTitle = () => {
    const pathMap = {
      "/": "Dashboard",
      "/employees": "Employees",
      "/attendance": "Attendance",
      "/leave": "Leave Management",
      "/reports": "Reports"
    };
    return pathMap[location.pathname] || "StaffHub";
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 font-display">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, departments..."
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </p>
              <p className="text-xs text-gray-600">
                {user?.accounts?.[0]?.companyName || 'HR Manager'}
              </p>
            </div>
            <Avatar 
              fallback={user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              size="md"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="ml-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;