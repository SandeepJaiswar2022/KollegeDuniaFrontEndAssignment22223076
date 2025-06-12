import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Payouts from './pages/Payouts';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
                        <Navbar />
                        <div className="container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route
                                    path="/admin/payouts"
                                    element={
                                        <ProtectedRoute>
                                            <Payouts />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                        <Toaster position="top-center" />
                    </div>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;
