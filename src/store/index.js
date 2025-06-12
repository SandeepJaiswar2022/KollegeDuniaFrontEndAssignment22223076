import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import articlesReducer from './slices/articlesSlice';
import payoutsReducer from './slices/payoutsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// Configure persist for the auth slice
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'role'], // only persist these fields from auth state
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        articles: articlesReducer,
        payouts: payoutsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required by redux-persist
        }),
});

export const persistor = persistStore(store);
