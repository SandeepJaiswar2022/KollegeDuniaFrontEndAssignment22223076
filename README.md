# News Dashboard with Payout Management

A modern, responsive dashboard application for managing news articles and author payouts.

## Features

- 🔐 Firebase Authentication with role-based access
- 📰 News article dashboard with filtering and search
- 📊 Analytics and charts
- 💰 Payout management for admins
- 📱 Responsive design with dark mode
- 📤 Export functionality (CSV)

## Tech Stack

- React.js (Vite)
- Redux Toolkit
- React persist (for auth state persistence)
- React Router DOM
- Tailwind CSS
- ShadCN UI
- Recharts
- jsPDF
- PapaParse

## Prerequisites

- Node.js 16+
- npm or yarn
- Firebase project
- NewsAPI key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/SandeepJaiswar2022/KollegeDuniaFrontEndAssignment22223076
cd KollegeDuniyaFrontEndAssignment
```

2. Install dependencies:
```bash
npm install
```


3. Start the development server:
```bash
npm run dev
```

## Usage

1. Login with your credentials:

   - Admin: admin@gmail.com, password: 'admin@321', role : admin
   - User: user@gmail.com, password: 'user@321', role : user

2. Dashboard:
   - View all articles
   - Filter by type, date, and author
   - Search functionality
   - View analytics

3. Admin Features:
   - Access payout management
   - Set payout rates
   - View author statistics
   - Export reports

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and slices
├── config/        # Configuration files
└── types/         # TypeScript type definitions
```

