import api from '../lib/api';

// Auth Services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login-user', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup-user', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Issue Services
export const issueService = {
  reportIssue: async (issueData) => {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(issueData).forEach(key => {
        if (key === 'images') {
          // Handle multiple images
          issueData.images.forEach((image, index) => {
            formData.append('images', {
              uri: image.uri,
              type: 'image/jpeg', // or image.type
              name: `image_${index}.jpg`,
            });
          });
        } else if (key === 'location') {
          // Stringify location object
          formData.append('location', JSON.stringify(issueData.location));
        } else {
          formData.append(key, issueData[key]);
        }
      });

      const response = await api.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getIssues: async (params = {}) => {
    try {
      const response = await api.get('/issues', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Transport Services
export const transportService = {
  logTransport: async (entryData) => {
    try {
      const response = await api.post('/transport-entries', entryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTransportHistory: async (params = {}) => {
    try {
      const response = await api.get('/transport-entries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCarbonStats: async () => {
    try {
      const response = await api.get('/transport-entries/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Organization Services
export const organizationService = {
  getOrganizations: async () => {
    try {
      const response = await api.get('/organizations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrganizationById: async (id) => {
    try {
      const response = await api.get(`/organizations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  joinOrganization: async (organizationId) => {
    try {
      const response = await api.post(`/organizations/${organizationId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default {
  auth: authService,
  issues: issueService,
  transport: transportService,
  organizations: organizationService,
};
