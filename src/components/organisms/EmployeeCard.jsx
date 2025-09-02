import { useState } from "react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const EmployeeCard = ({ employee, onEdit, onDelete, onViewProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAction = (action) => {
    setIsMenuOpen(false);
    if (action === "edit" && onEdit) onEdit(employee);
    if (action === "delete" && onDelete) onDelete(employee);
    if (action === "profile" && onViewProfile) onViewProfile(employee);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={employee.photoUrl}
            fallback={`${employee.firstName} ${employee.lastName}`}
            size="lg"
          />
          <div>
            <h3 className="font-semibold text-gray-900 font-display">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="MoreVertical" className="w-4 h-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => handleAction("profile")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ApperIcon name="User" className="w-4 h-4 inline mr-2" />
                  View Profile
                </button>
                <button
                  onClick={() => handleAction("edit")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ApperIcon name="Edit" className="w-4 h-4 inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleAction("delete")}
                  className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Department:</span>
          <Badge variant="primary">{employee.department}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <StatusBadge status={employee.status} type="employee" />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Employee ID:</span>
<span className="text-sm font-mono text-gray-900">{employee.Id}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
          Joined {new Date(employee.joinDate).toLocaleDateString()}
        </div>
      </div>

      {/* Close menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeCard;