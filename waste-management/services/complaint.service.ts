import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ComplaintService {
  private static async getAuthHeaders() {
    // This will be called from within a component that has access to useAuth
    return {};
  }

  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      throw error;
    }
  }

  static async getComplaints(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const endpoint = `/complaints${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint);
  }

  static async getComplaintById(id: number) {
    return await this.makeRequest(`/complaints/${id}`);
  }

  static async createComplaint(data: FormData) {
    return await this.makeRequest('/complaints/create', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: data,
    });
  }

  static async updateComplaintStatus(id: number, status: string, assignedWorkerId?: string) {
    return await this.makeRequest(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        assignedWorkerId,
      }),
    });
  }

  static async deleteComplaint(id: number) {
    return await this.makeRequest(`/complaints/${id}`, {
      method: 'DELETE',
    });
  }
}

// Hook to use the service with authentication
export function useComplaintService() {
  const { getToken } = useAuth();

  const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      throw error;
    }
  };

  return {
    getComplaints: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }) => {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);

      const endpoint = `/complaints${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      return await makeAuthenticatedRequest(endpoint);
    },

    getComplaintById: async (id: number) => {
      return await makeAuthenticatedRequest(`/complaints/${id}`);
    },

    createComplaint: async (data: FormData) => {
      const token = await getToken();
      return await fetch(`${API_BASE_URL}/complaints/create`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData
        },
        method: 'POST',
        body: data,
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || errorData.error || `HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      });
    },

    updateComplaintStatus: async (id: number, status: string, assignedWorkerId?: string) => {
      return await makeAuthenticatedRequest(`/complaints/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          assignedWorkerId,
        }),
      });
    },

    deleteComplaint: async (id: number) => {
      return await makeAuthenticatedRequest(`/complaints/${id}`, {
        method: 'DELETE',
      });
    }
  };
}