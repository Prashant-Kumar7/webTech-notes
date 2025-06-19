import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ApiNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
}

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMessage =  error.message || 
                          `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const notesApi = {
  // Get all notes
  getAllNotes: async (): Promise<ApiNote[]> => {
    const response = await apiClient.get<ApiNote[]>('/notes');
    return response.data;
  },

  // Create a new note
  createNote: async (noteData: CreateNoteData): Promise<ApiNote> => {
    const response = await apiClient.post<ApiNote>('/notes', noteData);
    return response.data;
  },

  // Update a note
  updateNote: async (id: string, noteData: UpdateNoteData): Promise<ApiNote> => {
    const response = await apiClient.put<ApiNote>(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },

  // Get all tags
  getAllTags: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/tags');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ message: string }> => {
    const response = await apiClient.get<{ message: string }>('/');
    return response.data;
  },
};

// Export the axios instance for direct use if needed
export { apiClient };