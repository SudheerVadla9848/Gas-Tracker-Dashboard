import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, SignUpCredentials } from '../types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock validation
          if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
            const user: User = {
              id: '1',
              email: credentials.email,
              name: 'Demo User',
              provider: 'email',
              createdAt: new Date().toISOString(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate passwords match
          if (credentials.password !== credentials.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          if (credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const user: User = {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.name,
            provider: 'email',
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign up failed',
            isLoading: false 
          });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate Google OAuth flow
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: 'google_' + Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            provider: 'google',
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Google login failed',
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);