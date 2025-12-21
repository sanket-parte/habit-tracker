import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signup, login } from '../../lib/api';

export function SignupPage({ onLoginSuccess, onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const loginMutation = useMutation({
        mutationFn: ({ email, password }) => login(email, password),
        onSuccess: () => onLoginSuccess(),
    });

    const signupMutation = useMutation({
        mutationFn: (data) => signup(data),
        onSuccess: () => {
            // Auto login after signup
            loginMutation.mutate({ email, password });
        },
        onError: () => {
            setError('Registration failed. Username or Email may be taken.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signupMutation.mutate({ email, username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                        Join the Garden
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">Plant your first seeds today</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={signupMutation.isPending || loginMutation.isPending}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                        >
                            {(signupMutation.isPending || loginMutation.isPending) ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button type="button" onClick={onSwitchToLogin} className="text-sm text-primary hover:underline">
                            Already have an account? Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
