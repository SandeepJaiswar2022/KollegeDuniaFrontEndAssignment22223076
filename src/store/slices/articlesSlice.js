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



export const dummyNews = [
    {
        id: 'https://technews.com/ai-revolution',
        title: 'AI is changing the world',
        content: 'Artificial Intelligence is disrupting industries from healthcare to finance...',
        author: 'Jane Doe',
        type: 'news',
        date: '2025-06-11T12:00:00Z',
        url: 'https://technews.com/ai-revolution',
    },
    {
        id: 'https://techdaily.com/quantum-computing-breakthrough',
        title: 'Quantum Computing Breakthrough Achieved',
        content: 'Scientists achieve new milestone in quantum processing speed...',
        author: 'John Smith',
        type: 'news',
        date: '2025-06-10T09:30:00Z',
        url: 'https://techdaily.com/quantum-computing-breakthrough',
    },
    {
        id: 'https://innovationtoday.io/5g-rollout',
        title: '5G Network Rollout Expands to Rural Areas',
        content: 'Telecom companies announce major infrastructure push...',
        author: 'Ananya Rao',
        type: 'news',
        date: '2025-06-09T18:00:00Z',
        url: 'https://innovationtoday.io/5g-rollout',
    },
    {
        id: 'https://futurebyte.org/meta-vr-headset',
        title: 'Meta Launches Next-Gen VR Headset',
        content: 'The new headset features ultra-low latency and retina resolution...',
        author: 'Leo Zhang',
        type: 'news',
        date: '2025-06-08T14:20:00Z',
        url: 'https://futurebyte.org/meta-vr-headset',
    },
    {
        id: 'https://green-tech.com/solar-efficiency',
        title: 'New Solar Tech Improves Efficiency by 30%',
        content: 'Researchers develop high-efficiency perovskite solar cells...',
        author: 'Mira Kapoor',
        type: 'news',
        date: '2025-06-07T11:45:00Z',
        url: 'https://green-tech.com/solar-efficiency',
    },
    {
        id: 'https://cybersecure.net/ransomware-attack',
        title: 'Major Ransomware Attack Hits Global Firm',
        content: 'Sensitive data compromised in cyberattack traced to overseas actors...',
        author: 'Siddharth Verma',
        type: 'news',
        date: '2025-06-06T16:10:00Z',
        url: 'https://cybersecure.net/ransomware-attack',
    },
    {
        id: 'https://mobilitynext.com/ev-battery-tech',
        title: 'EV Battery Tech Promises 1000km Range',
        content: 'New solid-state battery could revolutionize electric vehicle market...',
        author: 'Carlos Moreno',
        type: 'news',
        date: '2025-06-05T13:30:00Z',
        url: 'https://mobilitynext.com/ev-battery-tech',
    },
    {
        id: 'https://spaceupdate.org/moon-mining',
        title: 'NASA Begins Planning for Moon Mining Missions',
        content: 'New programs aim to extract water and metals from lunar surface...',
        author: 'Kavita Joshi',
        type: 'news',
        date: '2025-06-04T08:00:00Z',
        url: 'https://spaceupdate.org/moon-mining',
    },
    {
        id: 'https://biotechpulse.com/crispr-cure-trials',
        title: 'CRISPR Gene Therapy Shows Success in Early Trials',
        content: 'Patients see promising results for genetic disorders...',
        author: 'Dr. Ravi Iyer',
        type: 'news',
        date: '2025-06-03T19:10:00Z',
        url: 'https://biotechpulse.com/crispr-cure-trials',
    },
    {
        id: 'https://edtechhub.in/ai-tutoring',
        title: 'AI Tutoring Systems Improving Student Outcomes',
        content: 'EdTech platforms adopt GPT-powered tutoring to help learners...',
        author: 'Nisha Patel',
        type: 'news',
        date: '2025-06-02T10:50:00Z',
        url: 'https://edtechhub.in/ai-tutoring',
    },
    {
        id: 'https://smartcitynews.org/urban-ai-planning',
        title: 'Urban AI Transforms City Planning',
        content: 'Smart cities use AI to optimize traffic and waste management...',
        author: 'Ahmed Latif',
        type: 'news',
        date: '2025-06-01T17:30:00Z',
        url: 'https://smartcitynews.org/urban-ai-planning',
    },
    {
        id: 'https://fintechweekly.com/blockchain-banking',
        title: 'Blockchain Reshaping Digital Banking',
        content: 'Major banks explore secure cross-border payments via blockchain...',
        author: 'Rohit Sinha',
        type: 'news',
        date: '2025-05-31T12:00:00Z',
        url: 'https://fintechweekly.com/blockchain-banking',
    },
    {
        id: 'https://roboticsdaily.tech/ai-robots-manufacturing',
        title: 'AI-Powered Robots Redefine Manufacturing Lines',
        content: 'Factories introduce collaborative AI robots (cobots) for production...',
        author: 'Laura Bennett',
        type: 'news',
        date: '2025-05-30T09:00:00Z',
        url: 'https://roboticsdaily.tech/ai-robots-manufacturing',
    },
    {
        id: 'https://cloudtimes.net/serverless-future',
        title: 'Serverless Computing Growing in Popularity',
        content: 'More startups adopt serverless models for agile development...',
        author: 'Emeka Umeh',
        type: 'news',
        date: '2025-05-29T15:40:00Z',
        url: 'https://cloudtimes.net/serverless-future',
    },
    {
        id: 'https://gadgetreviewer.com/ar-glasses',
        title: 'AR Glasses Market Set to Boom in 2025',
        content: 'Tech giants gear up to release lightweight, high-resolution AR glasses...',
        author: 'Zara Khan',
        type: 'news',
        date: '2025-05-28T07:20:00Z',
        url: 'https://gadgetreviewer.com/ar-glasses',
    },
];

// Using NewsAPI as an example
const NEWS_API_KEY = `476030c2e0024e74b32b9d046fda2a5e`;
// // Optional CORS proxy (only if needed, e.g., for Vercel)
// const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
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

        let articles = [];

        try {
            const response = await fetch(`${NEWS_API_URL}?${queryParams}`);
            if (!response.ok) throw new Error('News API fetch failed');

            const data = await response.json();
            articles = data.articles.length ? data.articles : dummyNews;
        } catch (error) {
            // toast.error('Using dummy news data. API request failed or limited.');
            articles = dummyNews;
        }

        return articles.map((article) => ({
            id: article.url,
            title: article.title,
            content: article.description || article.content,
            author: article.author || 'Unknown',
            type: 'news',
            date: article.publishedAt || article.date,
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