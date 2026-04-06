/**
 * LoginPage — Clean authentication form
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Wallet, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useFinanceStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        login(name, email);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-navy via-navy-light to-navy-lighter" />
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <Link to="/" className="flex items-center gap-3 mb-8 w-fit hover:opacity-80 transition-opacity cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-lime flex items-center justify-center">
                            <Wallet size={28} className="text-navy" />
                        </div>
                        <span className="text-2xl font-bold text-white">Zorvyn</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Welcome back to<br />your finances
                    </h1>
                    <p className="text-white/70 text-lg max-w-md">
                        Sign in to continue tracking your income, expenses, and financial goals.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-lime/10" />
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-lime/5" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
                        <div className="w-11 h-11 rounded-xl bg-lime flex items-center justify-center">
                            <Wallet size={24} className="text-navy" />
                        </div>
                        <span className="text-2xl font-bold text-navy dark:text-light">Zorvyn</span>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-soft dark:border-dark-border p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-navy dark:text-light mb-2">
                            Sign in
                        </h2>
                        <p className="text-navy/60 dark:text-light/60 mb-8">
                            Enter your credentials to access your dashboard
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 dark:text-light/70 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 dark:text-light/40" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full h-12 pl-11 pr-4 bg-light dark:bg-dark-bg border border-gray-soft dark:border-dark-border rounded-xl text-navy dark:text-light placeholder:text-navy/40 dark:placeholder:text-light/40 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy/70 dark:text-light/70 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 dark:text-light/40" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-12 pl-11 pr-12 bg-light dark:bg-dark-bg border border-gray-soft dark:border-dark-border rounded-xl text-navy dark:text-light placeholder:text-navy/40 dark:placeholder:text-light/40 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 dark:text-light/40 hover:text-navy dark:hover:text-light transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 cursor-pointer inline-flex items-center justify-center gap-2 bg-lime text-navy font-semibold rounded-xl hover:bg-lime-dark transition-colors disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setEmail('admin@zorvyn.com'); setPassword('demo123'); }}
                                className="w-full text-sm font-semibold text-navy/60 dark:text-light/60 hover:text-navy dark:hover:text-light transition-colors mt-2"
                            >
                                Fill Demo Credentials
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-navy/60 dark:text-light/60 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-lime-dark dark:text-lime font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
