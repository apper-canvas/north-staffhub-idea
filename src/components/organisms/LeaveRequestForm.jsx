import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const LeaveRequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { value: "vacation", label: "Vacation" },
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId || !formData.type || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setIsSubmitting(true);

    try {
const newRequest = {
        employeeId: formData.employeeId,
        employeeName: formData.employeeName || `Employee ${formData.employeeId}`,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: "pending",
        approvedBy: null,
        createdAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(newRequest);
      }

      toast.success("Leave request submitted successfully");
      
      // Reset form
      setFormData({
        employeeId: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: ""
      });
    } catch (error) {
      toast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          Submit Leave Request
        </h2>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Employee ID"
            type="text"
            value={formData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
            placeholder="Enter employee ID"
            required
          />

          <Select
            label="Leave Type"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="Please provide reason for leave request..."
          />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;