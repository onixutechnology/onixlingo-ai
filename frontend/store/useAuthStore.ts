// store/useAuthStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserProfile {
    id: string;
    username: string;
    email?: string;
    company_id?: string;
    role?: string;
    chess_elo: number;
    avatar_url?: string;
}

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    token: string | null;
    
    // Actions
    login: (user: UserProfile, token: string) => void;
    logout: () => void;
    updateUser: (data: Partial<UserProfile>) => void;
}

// 🚀 Usuario logueado (Simulado por ahora, hasta conectar endpoint real de login)
const MOCK_USER: UserProfile = {
    id: "user-1234",
    username: "Alex_Titanium",
    email: "alex@titanium.company.com",
    company_id: "demo", // Enlazado con el dashboard B2B
    role: "employee",
    chess_elo: 1450, // ELO Dinámico
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: MOCK_USER,
                isAuthenticated: true,
                token: "mock-jwt-token",

                login: (user, token) => set({ user, token, isAuthenticated: true }),
                
                logout: () => set({ user: null, token: null, isAuthenticated: false }),
                
                updateUser: (data) => 
                    set((state) => ({ 
                        user: state.user ? { ...state.user, ...data } : null 
                    })),
            }),
            {
                name: "titanium-auth",
            }
        )
    )
);

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
