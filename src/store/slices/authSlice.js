import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistor } from '..';

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    role: localStorage.getItem("role") || null,
    loading: false,
    error: null,
};

// Hardcoded credentials
const VALID_CREDENTIALS = {
    'admin@gmail.com': {
        password: 'admin@321',
        role: 'admin'
    },
    'user@gmail.com': {
        password: 'user@321',
        role: 'user'
    }
};



export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }) => {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userCredential = VALID_CREDENTIALS[email];

        if (!userCredential || userCredential.password !== password) {
            throw new Error('Invalid email or password');
        }

        return {
            user: {
                email: email,
                displayName: email.split('@')[0],
            },
            role: userCredential.role,
        };
    }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
    await persistor.purge();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        setRole: (state, action) => {
            state.role = action.payload;
            if (action.payload) {
                localStorage.setItem("role", action.payload);
            } else {
                localStorage.removeItem("role");
            }
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.role = action.payload.role;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("role", action.payload.role);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setLoading, setError, setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer; 