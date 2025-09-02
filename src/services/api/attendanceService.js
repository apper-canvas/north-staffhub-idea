import { toast } from 'react-toastify';

const TABLE_NAME = 'attendance_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching attendance: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return (response.data || []).map(att => ({
        Id: att.Id,
        employeeId: att.employee_id_c?.Id ? att.employee_id_c.Id.toString() : (att.employee_id_c || '').toString(),
        employeeName: att.employee_name_c,
        department: att.department_c,
        date: att.date_c,
        checkIn: att.check_in_c,
        checkOut: att.check_out_c,
        status: att.status_c,
        notes: att.notes_c
      }));
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
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
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      // Transform data to match UI expectations
      const att = response.data;
      return {
        Id: att.Id,
        employeeId: att.employee_id_c?.Id ? att.employee_id_c.Id.toString() : (att.employee_id_c || '').toString(),
        employeeName: att.employee_name_c,
        department: att.department_c,
        date: att.date_c,
        checkIn: att.check_in_c,
        checkOut: att.check_out_c,
        status: att.status_c,
        notes: att.notes_c
      };
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `${attendanceData.employeeName} - ${attendanceData.date}`,
          employee_id_c: parseInt(attendanceData.employeeId),
          employee_name_c: attendanceData.employeeName,
          department_c: attendanceData.department,
          date_c: attendanceData.date,
          check_in_c: attendanceData.checkIn,
          check_out_c: attendanceData.checkOut,
          status_c: attendanceData.status || 'present',
          notes_c: attendanceData.notes
        }]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error creating attendance record: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create attendance record: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const newAtt = successful[0].data;
          return {
            Id: newAtt.Id,
            employeeId: newAtt.employee_id_c?.Id ? newAtt.employee_id_c.Id.toString() : (newAtt.employee_id_c || '').toString(),
            employeeName: newAtt.employee_name_c,
            department: newAtt.department_c,
            date: newAtt.date_c,
            checkIn: newAtt.check_in_c,
            checkOut: newAtt.check_out_c,
            status: newAtt.status_c,
            notes: newAtt.notes_c
          };
        }
      }
      
      throw new Error("Failed to create attendance record");
    } catch (error) {
      console.error("Error creating attendance record:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (attendanceData.employeeName !== undefined || attendanceData.date !== undefined) {
        updateData.Name = `${attendanceData.employeeName || ''} - ${attendanceData.date || ''}`;
      }
      if (attendanceData.employeeId !== undefined) updateData.employee_id_c = parseInt(attendanceData.employeeId);
      if (attendanceData.employeeName !== undefined) updateData.employee_name_c = attendanceData.employeeName;
      if (attendanceData.department !== undefined) updateData.department_c = attendanceData.department;
      if (attendanceData.date !== undefined) updateData.date_c = attendanceData.date;
      if (attendanceData.checkIn !== undefined) updateData.check_in_c = attendanceData.checkIn;
      if (attendanceData.checkOut !== undefined) updateData.check_out_c = attendanceData.checkOut;
      if (attendanceData.status !== undefined) updateData.status_c = attendanceData.status;
      if (attendanceData.notes !== undefined) updateData.notes_c = attendanceData.notes;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error updating attendance record: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update attendance record: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedAtt = successful[0].data;
          return {
            Id: updatedAtt.Id,
            employeeId: updatedAtt.employee_id_c?.Id ? updatedAtt.employee_id_c.Id.toString() : (updatedAtt.employee_id_c || '').toString(),
            employeeName: updatedAtt.employee_name_c,
            department: updatedAtt.department_c,
            date: updatedAtt.date_c,
            checkIn: updatedAtt.check_in_c,
            checkOut: updatedAtt.check_out_c,
            status: updatedAtt.status_c,
            notes: updatedAtt.notes_c
          };
        }
      }
      
      throw new Error("Failed to update attendance record");
    } catch (error) {
      console.error("Error updating attendance record:", error?.response?.data?.message || error);
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
        console.error(`Error deleting attendance record: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete attendance record: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting attendance record:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "employee_id_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching attendance by date: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(att => ({
        Id: att.Id,
        employeeId: att.employee_id_c?.Id ? att.employee_id_c.Id.toString() : (att.employee_id_c || '').toString(),
        employeeName: att.employee_name_c,
        department: att.department_c,
        date: att.date_c,
        checkIn: att.check_in_c,
        checkOut: att.check_out_c,
        status: att.status_c,
        notes: att.notes_c
      }));
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByEmployee(employeeId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "employee_id_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching attendance by employee: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(att => ({
        Id: att.Id,
        employeeId: att.employee_id_c?.Id ? att.employee_id_c.Id.toString() : (att.employee_id_c || '').toString(),
        employeeName: att.employee_name_c,
        department: att.department_c,
        date: att.date_c,
        checkIn: att.check_in_c,
        checkOut: att.check_out_c,
        status: att.status_c,
        notes: att.notes_c
      }));
    } catch (error) {
      console.error("Error fetching attendance by employee:", error?.response?.data?.message || error);
      return [];
    }
  },

  async updateStatus(id, status) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error updating attendance status: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update attendance status: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedAtt = successful[0].data;
          return {
            Id: updatedAtt.Id,
            employeeId: updatedAtt.employee_id_c?.Id ? updatedAtt.employee_id_c.Id.toString() : (updatedAtt.employee_id_c || '').toString(),
            employeeName: updatedAtt.employee_name_c,
            department: updatedAtt.department_c,
            date: updatedAtt.date_c,
            checkIn: updatedAtt.check_in_c,
            checkOut: updatedAtt.check_out_c,
            status: updatedAtt.status_c,
            notes: updatedAtt.notes_c
          };
        }
      }
      
      throw new Error("Failed to update attendance status");
    } catch (error) {
      console.error("Error updating attendance status:", error?.response?.data?.message || error);
      throw error;
    }
  }
};