import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Create a singleton Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL
export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b17352a1`;

// Helper function to get authorization headers
export const getAuthHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
};

// API helper functions
export const api = {
  // Auth
  async signup(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }
    return data;
  },

  async signin(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }
    return data;
  },

  async getSession(token: string) {
    const response = await fetch(`${API_URL}/auth/session`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    return data;
  },

  async signout(token: string) {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign out');
    }
    return data;
  },

  async resetPassword(email: string) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send password reset email');
    }
    return data;
  },

  // Workspaces
  async getWorkspaces(params?: {
    type?: string;
    availability?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.availability) queryParams.append('availability', params.availability);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const response = await fetch(
      `${API_URL}/workspaces${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch workspaces');
    }
    return data;
  },

  async getWorkspace(id: string) {
    const response = await fetch(`${API_URL}/workspaces/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch workspace');
    }
    return data;
  },

  // Bookings
  async createBooking(token: string, bookingData: any) {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create booking');
    }
    return data;
  },

  async getBookings(token: string) {
    const response = await fetch(`${API_URL}/bookings`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }
    return data;
  },

  async getBooking(token: string, id: string) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch booking');
    }
    return data;
  },

  async cancelBooking(token: string, id: string) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel booking');
    }
    return data;
  },

  // Profile
  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/profile`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    return data;
  },

  async updateProfile(token: string, updates: any) {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return data;
  },

  // Seed data
  async seedData() {
    const response = await fetch(`${API_URL}/seed-data`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data;
  },

  // Admin APIs
  async adminLogin(email: string, password: string) {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in as admin');
    }
    return data;
  },

  async createAdmin(email: string, password: string, firstName: string, lastName: string, secretKey: string) {
    const response = await fetch(`${API_URL}/admin/create-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, firstName, lastName, secretKey }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create admin');
    }
    return data;
  },

  async getAdminStats(token: string) {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch admin stats');
    }
    return data;
  },

  async getAllUsers(token: string) {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch users');
    }
    return data;
  },

  async getAllBookings(token: string) {
    const response = await fetch(`${API_URL}/admin/bookings`, {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }
    return data;
  },

  async createWorkspace(token: string, workspaceData: any) {
    const response = await fetch(`${API_URL}/admin/workspaces`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(workspaceData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create workspace');
    }
    return data;
  },

  async updateWorkspace(token: string, id: string, updates: any) {
    const response = await fetch(`${API_URL}/admin/workspaces/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update workspace');
    }
    return data;
  },

  async deleteWorkspace(token: string, id: string) {
    const response = await fetch(`${API_URL}/admin/workspaces/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete workspace');
    }
    return data;
  },

  async updateBookingStatus(token: string, id: string, status: string) {
    const response = await fetch(`${API_URL}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update booking');
    }
    return data;
  },

  async deleteUser(token: string, id: string) {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }
    return data;
  },
};