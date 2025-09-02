import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const TABLE_NAME = 'employee_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const employeesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching employees: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return (response.data || []).map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c,
        lastName: emp.last_name_c,
        email: emp.email_c,
        phone: emp.phone_c,
        role: emp.role_c,
        department: emp.department_c,
        joinDate: emp.join_date_c,
        status: emp.status_c,
        photoUrl: emp.photo_url_c
      }));
    } catch (error) {
      console.error("Error fetching employees:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      // Transform data to match UI expectations
      const emp = response.data;
      return {
        Id: emp.Id,
        firstName: emp.first_name_c,
        lastName: emp.last_name_c,
        email: emp.email_c,
        phone: emp.phone_c,
        role: emp.role_c,
        department: emp.department_c,
        joinDate: emp.join_date_c,
        status: emp.status_c,
        photoUrl: emp.photo_url_c
      };
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(employeeData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone,
          role_c: employeeData.role,
          department_c: employeeData.department,
          join_date_c: employeeData.joinDate,
          status_c: employeeData.status || 'active',
          photo_url_c: employeeData.photoUrl
        }]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error creating employee: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create employee: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const newEmp = successful[0].data;
          return {
            Id: newEmp.Id,
            firstName: newEmp.first_name_c,
            lastName: newEmp.last_name_c,
            email: newEmp.email_c,
            phone: newEmp.phone_c,
            role: newEmp.role_c,
            department: newEmp.department_c,
            joinDate: newEmp.join_date_c,
            status: newEmp.status_c,
            photoUrl: newEmp.photo_url_c
          };
        }
      }
      
      throw new Error("Failed to create employee");
    } catch (error) {
      console.error("Error creating employee:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, employeeData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (employeeData.firstName !== undefined || employeeData.lastName !== undefined) {
        updateData.Name = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim();
      }
      if (employeeData.firstName !== undefined) updateData.first_name_c = employeeData.firstName;
      if (employeeData.lastName !== undefined) updateData.last_name_c = employeeData.lastName;
      if (employeeData.email !== undefined) updateData.email_c = employeeData.email;
      if (employeeData.phone !== undefined) updateData.phone_c = employeeData.phone;
      if (employeeData.role !== undefined) updateData.role_c = employeeData.role;
      if (employeeData.department !== undefined) updateData.department_c = employeeData.department;
      if (employeeData.joinDate !== undefined) updateData.join_date_c = employeeData.joinDate;
      if (employeeData.status !== undefined) updateData.status_c = employeeData.status;
      if (employeeData.photoUrl !== undefined) updateData.photo_url_c = employeeData.photoUrl;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error updating employee: ${response.message}`);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update employee: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedEmp = successful[0].data;
          return {
            Id: updatedEmp.Id,
            firstName: updatedEmp.first_name_c,
            lastName: updatedEmp.last_name_c,
            email: updatedEmp.email_c,
            phone: updatedEmp.phone_c,
            role: updatedEmp.role_c,
            department: updatedEmp.department_c,
            joinDate: updatedEmp.join_date_c,
            status: updatedEmp.status_c,
            photoUrl: updatedEmp.photo_url_c
          };
        }
      }
      
      throw new Error("Failed to update employee");
    } catch (error) {
      console.error("Error updating employee:", error?.response?.data?.message || error);
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
        console.error(`Error deleting employee: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete employee: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error fetching employees by department: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c,
        lastName: emp.last_name_c,
        email: emp.email_c,
        phone: emp.phone_c,
        role: emp.role_c,
        department: emp.department_c,
        joinDate: emp.join_date_c,
        status: emp.status_c,
        photoUrl: emp.photo_url_c
      }));
    } catch (error) {
      console.error("Error fetching employees by department:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              {"fieldName": "first_name_c", "operator": "Contains", "values": [query]},
              {"fieldName": "last_name_c", "operator": "Contains", "values": [query]},
              {"fieldName": "email_c", "operator": "Contains", "values": [query]},
              {"fieldName": "department_c", "operator": "Contains", "values": [query]},
              {"fieldName": "role_c", "operator": "Contains", "values": [query]}
            ],
            operator: "OR"
          }]
        }]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Error searching employees: ${response.message}`);
        return [];
      }
      
      return (response.data || []).map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c,
        lastName: emp.last_name_c,
        email: emp.email_c,
        phone: emp.phone_c,
        role: emp.role_c,
        department: emp.department_c,
        joinDate: emp.join_date_c,
        status: emp.status_c,
        photoUrl: emp.photo_url_c
      }));
    } catch (error) {
      console.error("Error searching employees:", error?.response?.data?.message || error);
      return [];
    }
}
};