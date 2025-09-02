import { toast } from 'react-toastify';

const TABLE_NAME = 'leave_request_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const leaveService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching leave requests: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return (response.data || []).map(req => ({
        Id: req.Id,
        employeeId: req.employee_id_c?.Id ? req.employee_id_c.Id.toString() : (req.employee_id_c || '').toString(),
        employeeName: req.employee_name_c,
        type: req.type_c,
        startDate: req.start_date_c,
        endDate: req.end_date_c,
        reason: req.reason_c,
        status: req.status_c,
        approvedBy: req.approved_by_c,
        createdAt: req.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching leave requests:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      // Transform data to match UI expectations
      const req = response.data;
      return {
        Id: req.Id,
        employeeId: req.employee_id_c?.Id ? req.employee_id_c.Id.toString() : (req.employee_id_c || '').toString(),
        employeeName: req.employee_name_c,
        type: req.type_c,
        startDate: req.start_date_c,
        endDate: req.end_date_c,
        reason: req.reason_c,
        status: req.status_c,
        approvedBy: req.approved_by_c,
        createdAt: req.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(leaveData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `${leaveData.employeeName} - ${leaveData.type} Leave`,
          employee_id_c: parseInt(leaveData.employeeId),
          employee_name_c: leaveData.employeeName,
          type_c: leaveData.type,
          start_date_c: leaveData.startDate,
          end_date_c: leaveData.endDate,
          reason_c: leaveData.reason,
          status_c: leaveData.status || 'pending',
          approved_by_c: leaveData.approvedBy,
          created_at_c: leaveData.createdAt || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error creating leave request: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create leave request: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const newReq = successful[0].data;
          return {
            Id: newReq.Id,
            employeeId: newReq.employee_id_c?.Id ? newReq.employee_id_c.Id.toString() : (newReq.employee_id_c || '').toString(),
            employeeName: newReq.employee_name_c,
            type: newReq.type_c,
            startDate: newReq.start_date_c,
            endDate: newReq.end_date_c,
            reason: newReq.reason_c,
            status: newReq.status_c,
            approvedBy: newReq.approved_by_c,
            createdAt: newReq.created_at_c
          };
        }
      }
      
      throw new Error("Failed to create leave request");
    } catch (error) {
      console.error("Error creating leave request:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, leaveData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (leaveData.employeeName !== undefined || leaveData.type !== undefined) {
        updateData.Name = `${leaveData.employeeName || ''} - ${leaveData.type || ''} Leave`;
      }
      if (leaveData.employeeId !== undefined) updateData.employee_id_c = parseInt(leaveData.employeeId);
      if (leaveData.employeeName !== undefined) updateData.employee_name_c = leaveData.employeeName;
      if (leaveData.type !== undefined) updateData.type_c = leaveData.type;
      if (leaveData.startDate !== undefined) updateData.start_date_c = leaveData.startDate;
      if (leaveData.endDate !== undefined) updateData.end_date_c = leaveData.endDate;
      if (leaveData.reason !== undefined) updateData.reason_c = leaveData.reason;
      if (leaveData.status !== undefined) updateData.status_c = leaveData.status;
      if (leaveData.approvedBy !== undefined) updateData.approved_by_c = leaveData.approvedBy;
      if (leaveData.createdAt !== undefined) updateData.created_at_c = leaveData.createdAt;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error updating leave request: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update leave request: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedReq = successful[0].data;
          return {
            Id: updatedReq.Id,
            employeeId: updatedReq.employee_id_c?.Id ? updatedReq.employee_id_c.Id.toString() : (updatedReq.employee_id_c || '').toString(),
            employeeName: updatedReq.employee_name_c,
            type: updatedReq.type_c,
            startDate: updatedReq.start_date_c,
            endDate: updatedReq.end_date_c,
            reason: updatedReq.reason_c,
            status: updatedReq.status_c,
            approvedBy: updatedReq.approved_by_c,
            createdAt: updatedReq.created_at_c
          };
        }
      }
      
      throw new Error("Failed to update leave request");
    } catch (error) {
      console.error("Error updating leave request:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error deleting leave request: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete leave request: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting leave request:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByEmployee(employeeId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "employee_id_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching leave requests by employee: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(req => ({
        Id: req.Id,
        employeeId: req.employee_id_c?.Id ? req.employee_id_c.Id.toString() : (req.employee_id_c || '').toString(),
        employeeName: req.employee_name_c,
        type: req.type_c,
        startDate: req.start_date_c,
        endDate: req.end_date_c,
        reason: req.reason_c,
        status: req.status_c,
        approvedBy: req.approved_by_c,
        createdAt: req.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching leave requests by employee:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "employee_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching leave requests by status: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(req => ({
        Id: req.Id,
        employeeId: req.employee_id_c?.Id ? req.employee_id_c.Id.toString() : (req.employee_id_c || '').toString(),
        employeeName: req.employee_name_c,
        type: req.type_c,
        startDate: req.start_date_c,
        endDate: req.end_date_c,
        reason: req.reason_c,
        status: req.status_c,
        approvedBy: req.approved_by_c,
        createdAt: req.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching leave requests by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async approve(id, approvedBy) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: "approved",
          approved_by_c: approvedBy
        }]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error approving leave request: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to approve leave request: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const approvedReq = successful[0].data;
          return {
            Id: approvedReq.Id,
            employeeId: approvedReq.employee_id_c?.Id ? approvedReq.employee_id_c.Id.toString() : (approvedReq.employee_id_c || '').toString(),
            employeeName: approvedReq.employee_name_c,
            type: approvedReq.type_c,
            startDate: approvedReq.start_date_c,
            endDate: approvedReq.end_date_c,
            reason: approvedReq.reason_c,
            status: approvedReq.status_c,
            approvedBy: approvedReq.approved_by_c,
            createdAt: approvedReq.created_at_c
          };
        }
      }
      
      throw new Error("Failed to approve leave request");
    } catch (error) {
      console.error("Error approving leave request:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async reject(id, approvedBy) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: "rejected",
          approved_by_c: approvedBy
        }]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error rejecting leave request: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to reject leave request: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const rejectedReq = successful[0].data;
          return {
            Id: rejectedReq.Id,
            employeeId: rejectedReq.employee_id_c?.Id ? rejectedReq.employee_id_c.Id.toString() : (rejectedReq.employee_id_c || '').toString(),
            employeeName: rejectedReq.employee_name_c,
            type: rejectedReq.type_c,
            startDate: rejectedReq.start_date_c,
            endDate: rejectedReq.end_date_c,
            reason: rejectedReq.reason_c,
            status: rejectedReq.status_c,
            approvedBy: rejectedReq.approved_by_c,
            createdAt: rejectedReq.created_at_c
          };
        }
      }
      
      throw new Error("Failed to reject leave request");
    } catch (error) {
      console.error("Error rejecting leave request:", error?.response?.data?.message || error);
      throw error;
    }
  }
};