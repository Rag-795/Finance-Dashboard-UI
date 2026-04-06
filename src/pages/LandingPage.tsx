/**
 * LandingPage — Public-facing hero page
 * Features: gradient hero, feature cards, CTA buttons, GSAP animations.
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Zap, Wallet, Moon, Sun } from 'lucide-react';
import BorderGlow from '../components/ui/BorderGlow';
import { useFinanceStore } from '../store/useFinanceStore';
import Button from '../components/ui/Button';
import gsap from 'gsap';

const features = [
    {
        icon: BarChart3,
        title: 'Smart Analytics',
        description: 'Beautiful charts and insights to track your spending patterns and income trends.',
    },
    {
        icon: Shield,
        title: 'Role-Based Access',
        description: 'Admin and Viewer roles with appropriate permissions for team collaboration.',
    },
    {
        icon: Zap,
        title: 'Real-Time Updates',
        description: 'Instant transaction tracking with live balance updates and notifications.',
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode, isAuthenticated } = useFinanceStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    // GSAP Entry Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial state (safe fallback if JS fails)
            gsap.set('.gsap-hero', { y: 30, opacity: 0 });
            gsap.set('.gsap-feature', { y: 40, opacity: 0 });

            const tl = gsap.timeline();
            tl.to('.gsap-hero', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });
            tl.to('.gsap-feature', {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            }, "-=0.4");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-light dark:bg-dark-bg transition-colors duration-300">
            {/* Navbar */}
            <div className="sticky top-4 z-50 w-full px-4 max-w-6xl mx-auto">
                <nav className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white/40 dark:bg-navy/40 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center">
                            <Wallet size={20} className="text-navy" />
                        </div>
                        <span className="text-lg font-bold text-navy dark:text-light tracking-tight">
                            Zorvyn
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl text-navy/60 hover:bg-navy/5 dark:text-light/60 dark:hover:bg-light/5 transition-colors cursor-pointer"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className='rounded-full'>
                            Sign In
                        </Button>
                        <Button size="sm" onClick={() => navigate('/signup')}>
                            Get Started
                        </Button>
                    </div>
                </nav>
            </div>

            <main>
                {/* Hero Section */}
                <section
                    className="pt-12 sm:pt-16 pb-12 px-6"
                >
                    <div className="max-w-4xl mx-auto text-center overflow-hidden">
                        {/* Badge */}
                        <div className="gsap-hero inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 mb-8">
                            <Zap size={14} className="text-lime-dark" />
                            <span className="text-xs font-semibold text-navy/70 dark:text-light/70">
                                Finance Tracking, Reimagined
                            </span>
                        </div>

                        <h1 className="gsap-hero hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-navy dark:text-light leading-tight tracking-tight">
                            Master Your{' '}
                            <span className="relative inline-block mx-3">
                                <span className="relative z-10">Finances</span>
                                <span className="absolute bottom-2 left-0 right-0 h-3 bg-lime/40 -rotate-1 rounded-sm" />
                            </span>
                            <br />
                            With Clarity
                        </h1>

                        <p className="gsap-hero hero-subtitle mt-6 text-lg sm:text-xl text-navy/50 dark:text-light/50 max-w-2xl mx-auto leading-relaxed">
                            Track income, expenses, and savings with beautiful analytics.
                            Get actionable insights to make smarter financial decisions.
                        </p>

                        <div className="gsap-hero hero-actions mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/signup')} icon={<ArrowRight size={18} />}>
                                Start Free
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                                Sign In
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="pb-14 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="gsap-feature hover:-translate-y-1 transition-transform duration-300">
                                    <BorderGlow
                                        edgeSensitivity={30}
                                        glowColor="40 80 80"
                                        backgroundColor="#060010"
                                        borderRadius={28}
                                        glowRadius={40}
                                        glowIntensity={1}
                                        coneSpread={25}
                                        animated={false}
                                        colors={['#c084fc', '#f472b6', '#38bdf8']}
                                    >
                                        <div className="group p-8 flex flex-col items-start min-h-[220px]">
                                            <div className="w-12 h-12 rounded-xl bg-lime/15 flex items-center justify-center mb-5 group-hover:bg-lime/25 transition-colors">
                                                <feature.icon size={24} className="text-lime-dark" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-white/50 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </BorderGlow>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-soft dark:border-dark-border py-8 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-lime-dark" />
                        <span className="text-sm font-semibold text-navy/60 dark:text-light/60">Zorvyn Finance</span>
                    </div>
                    <p className="text-xs text-navy/30 dark:text-light/30">
                        © 2026 Made By Raghav.
                    </p>
                </div>
            </footer>
        </div >
    );
}
