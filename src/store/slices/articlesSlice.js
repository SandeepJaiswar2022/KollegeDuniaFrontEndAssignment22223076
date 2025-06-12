import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
    items: [],
    loading: false,
    error: null,
    filters: {
        author: '',
        type: '',
        dateRange: {
            start: '',
            end: '',
        },
        searchQuery: '',
    },
};

// Using NewsAPI as an example
const NEWS_API_KEY = `476030c2e0024e74b32b9d046fda2a5e`;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async (_, { getState }) => {
        const state = getState();
        const { filters } = state.articles;

        const queryParams = new URLSearchParams({
            q: filters.searchQuery || 'technology',
            apiKey: NEWS_API_KEY,
            language: 'en',
            sortBy: 'publishedAt',
        });

        if (filters.dateRange.start) {
            queryParams.append('from', filters.dateRange.start);
        }
        if (filters.dateRange.end) {
            queryParams.append('to', filters.dateRange.end);
        }

        const response = await fetch(`${NEWS_API_URL}?${queryParams}`);
        if (!response.ok) {
            toast.error("Error Fetching News, Too many request!")
            throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        return data.articles.map((article) => ({
            id: article.url,
            title: article.title,
            content: article.description,
            author: article.author || 'Unknown',
            type: 'news',
            date: article.publishedAt,
            url: article.url,
        }));
    }
);

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch articles';
            });
    },
});

export const { setFilters, clearFilters } = articlesSlice.actions;
export default articlesSlice.reducer; 