// API base URL - using Node.js server for all backend operations
export const API_URL = 'http://localhost:3001/api';

// Helper function to get authorization headers
export const getAuthHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper to handle fetch errors
const handleFetchError = (error: any, operation: string) => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    throw new Error(`${operation}: Backend server is not responding. Make sure the server is running on port 3001.`);
  }
  throw error;
};

// API helper functions
export const api = {
  // Auth
  async signup(email: string, password: string, firstName: string, lastName: string) {
    try {
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
    } catch (error) {
      throw handleFetchError(error, 'Sign up');
    }
  },

  async signin(email: string, password: string) {
    try {
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
    } catch (error) {
      throw handleFetchError(error, 'Sign in');
    }
  },

  async getSession(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Session check failed:', error);
      return { session: null, user: null };
    }
  },

  async signout(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign out');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Sign out');
    }
  },

  async changePassword(token: string, currentPassword: string, newPassword: string) {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Change password');
    }
  },

  async getProfile(token: string) {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load profile');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Fetch profile');
    }
  },

  async updateProfile(token: string, updates: { firstName?: string; lastName?: string; phone?: string; company?: string; bio?: string; }) {
    try {
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
    } catch (error) {
      throw handleFetchError(error, 'Update profile');
    }
  },

  async uploadProfileAvatar(token: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload profile image');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Upload profile avatar');
    }
  },

  async resetPassword(email: string) {
    try {
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
    } catch (error) {
      throw handleFetchError(error, 'Password reset');
    }
  },

  async verifyEmail(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Email verification');
    }
  },

  async resendVerificationEmail(email: string) {
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Resend verification');
    }
  },

  // Admin
  async adminLogin(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login as admin');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Admin login');
    }
  },

  async createAdmin(email: string, password: string, firstName: string, lastName: string, secretKey: string) {
    try {
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
    } catch (error) {
      throw handleFetchError(error, 'Create admin');
    }
  },

  async getAdminStats(token: string) {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch admin stats');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Admin stats');
    }
  },

  async getAllUsers(token: string) {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Get users');
    }
  },

  async deleteUser(token: string, userId: string) {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Delete user');
    }
  },

  async getAllBookings(token: string) {
    try {
      const response = await fetch(`${API_URL}/admin/bookings`, {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Get bookings');
    }
  },

  async updateBookingStatus(token: string, bookingId: string, status: string) {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update booking status');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Update booking status');
    }
  },

  async createWorkspace(token: string, workspace: any) {
    try {
      const response = await fetch(`${API_URL}/admin/workspaces`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(workspace),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Create workspace');
    }
  },

  async updateWorkspace(token: string, workspaceId: string, workspace: any) {
    try {
      const response = await fetch(`${API_URL}/admin/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(workspace),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update workspace');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Update workspace');
    }
  },

  async deleteWorkspace(token: string, workspaceId: string) {
    try {
      const response = await fetch(`${API_URL}/admin/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete workspace');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Delete workspace');
    }
  },

  async requestPasswordReset(email: string) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request password reset');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Password reset request');
    }
  },

  async resetPasswordWithToken(token: string, newPassword: string) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password-confirm`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Password reset');
    }
  },

  // Workspaces
  async getWorkspaces(params?: {
    type?: string;
    availability?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    try {
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
      return { workspaces: data };
    } catch (error) {
      throw handleFetchError(error, 'Fetch workspaces');
    }
  },

  async getWorkspace(id: string) {
    try {
      const response = await fetch(`${API_URL}/workspaces/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workspace');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Fetch workspace');
    }
  },

  // Bookings
  async getBookings(token: string) {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      return { bookings: data };
    } catch (error) {
      throw handleFetchError(error, 'Fetch bookings');
    }
  },

  async createBooking(token: string, workspaceId: string, startDate: string, endDate: string) {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ workspaceId, startDate, endDate }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Create booking');
    }
  },

  async cancelBooking(token: string, bookingId: string) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }
      return data;
    } catch (error) {
      throw handleFetchError(error, 'Cancel booking');
    }
  },
};
