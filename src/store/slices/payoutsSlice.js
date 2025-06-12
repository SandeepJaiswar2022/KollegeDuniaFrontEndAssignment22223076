import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rates: {
        pricePerNews: Number(localStorage.getItem('pricePerNews')) || 100,
        pricePerBlog: Number(localStorage.getItem('pricePerBlog')) || 200,
    },
    authorPayouts: [],
    loading: false,
    error: null,
};

const payoutsSlice = createSlice({
    name: 'payouts',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateRates: (state, action) => {
            const { pricePerNews, pricePerBlog } = action.payload;
            state.rates = { pricePerNews, pricePerBlog };
            localStorage.setItem('pricePerNews', pricePerNews.toString());
            localStorage.setItem('pricePerBlog', pricePerBlog.toString());
        },
        setAuthorPayouts: (state, action) => {
            state.authorPayouts = action.payload;
        },
        calculatePayouts: (state, action) => {
            const { articles } = action.payload;
            const authorStats = {};

            // Calculate news and blog counts for each author
            articles.forEach((article) => {
                const author = article.author;
                if (!authorStats[author]) {
                    authorStats[author] = { news: 0, blogs: 0 };
                }
                if (article.type === 'news') {
                    authorStats[author].news++;
                } else if (article.type === 'blog') {
                    authorStats[author].blogs++;
                }
            });

            // Calculate total payout for each author
            state.authorPayouts = Object.entries(authorStats).map(([author, stats]) => ({
                author,
                newsCount: stats.news,
                blogCount: stats.blogs,
                totalPayout: (stats.news * state.rates.pricePerNews) + (stats.blogs * state.rates.pricePerBlog),
            }));
        },
    },
});

export const { setLoading, setError, updateRates, setAuthorPayouts, calculatePayouts } = payoutsSlice.actions;
export default payoutsSlice.reducer; 