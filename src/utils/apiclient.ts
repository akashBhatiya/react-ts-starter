import axios, { 
    AxiosInstance, 
    AxiosError, 
    AxiosRequestConfig, 
    AxiosResponse,
    InternalAxiosRequestConfig 
  } from 'axios';
  
  // Types for API responses
  interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
  }
  
  interface ErrorResponse {
    message: string;
    code?: string;
    status?: number;
  }
  
  class ApiClient {
    private client: AxiosInstance;
    private static instance: ApiClient;
  
    private constructor() {
      this.client = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      this.setupInterceptors();
    }
  
    public static getInstance(): ApiClient {
      if (!ApiClient.instance) {
        ApiClient.instance = new ApiClient();
      }
      return ApiClient.instance;
    }
  
    private setupInterceptors(): void {
      // Request interceptor
      this.client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          // Get token from localStorage or your auth service
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error: AxiosError) => {
          return Promise.reject(this.handleError(error));
        }
      );
  
      // Response interceptor
      this.client.interceptors.response.use(
        (response: AxiosResponse) => {
          return response;
        },
        (error: AxiosError) => {
          return Promise.reject(this.handleError(error));
        }
      );
    }
  
    private handleError(error: AxiosError): ErrorResponse {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        
        switch (status) {
          case 401:
            // Handle unauthorized access
            this.handleUnauthorized();
            return {
              message: 'Unauthorized access. Please login again.',
              status,
              code: 'UNAUTHORIZED'
            };
          case 403:
            return {
              message: 'Access forbidden.',
              status,
              code: 'FORBIDDEN'
            };
          case 404:
            return {
              message: 'Resource not found.',
              status,
              code: 'NOT_FOUND'
            };
          case 422:
            return {
              message: 'Validation error.',
              status,
              code: 'VALIDATION_ERROR'
            };
          case 500:
            return {
              message: 'Internal server error.',
              status,
              code: 'SERVER_ERROR'
            };
          default:
            return {
              message: 'An unexpected error occurred.',
              status,
              code: 'UNKNOWN_ERROR'
            };
        }
      } else if (error.request) {
        // The request was made but no response was received
        return {
          message: 'No response received from server.',
          code: 'NO_RESPONSE'
        };
      } else {
        // Something happened in setting up the request
        return {
          message: error.message || 'An error occurred while setting up the request.',
          code: 'REQUEST_SETUP_ERROR'
        };
      }
    }
  
    private handleUnauthorized(): void {
      // Clear auth token
      localStorage.removeItem('authToken');
      // Redirect to login page or trigger auth refresh
      window.location.href = '/login';
    }
  
    // Generic request method
    private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
        const response = await this.client.request<T>(config);
        return {
          data: response.data,
          status: response.status,
          message: 'Success'
        };
      } catch (error) {
        throw error;
      }
    }
  
    // HTTP method wrappers
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return this.request<T>({ ...config, method: 'GET', url });
    }
  
    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return this.request<T>({ ...config, method: 'POST', url, data });
    }
  
    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return this.request<T>({ ...config, method: 'PUT', url, data });
    }
  
    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return this.request<T>({ ...config, method: 'PATCH', url, data });
    }
  
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return this.request<T>({ ...config, method: 'DELETE', url });
    }
  }
  
  // Export singleton instance
  export const apiClient = ApiClient.getInstance();
  