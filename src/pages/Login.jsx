import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { Input } from '../components/ui/input';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Is form getting submitted");

        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success("LoggedIn successfully!")
            navigate('/dashboard');
        } catch (err) {
            console.log("Login error : ", err);

            toast.error('Invalid email or password!');
        }
    };

    const userCredentials = {
        admin: {
            email: `admin@gmail.com`,
            password: `admin@321`,
            role: `admin`,
        },
        user: {
            email: `user@gmail.com`,
            password: `user@321`,
            role: `user`,
        }
    }

    return (
        <div className="min-h-screen flex flex-col space-y-3 items-center justify-center bg-gradient-to-br from-background to-muted">
            <div className="w-[400px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-800 transition-colors duration-500 w-fit flex px-4 py-2 rounded-md text-white  justify-self-center "
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
            <pre>{JSON.stringify(userCredentials, null, 2)}</pre>

        </div>

    );
};

export default Login; 