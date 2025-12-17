import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Building2 } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/organizations', label: 'Organizations', icon: Building2 },
        { path: '/users', label: 'Users', icon: Users },
        // { path: '/roles', label: 'Roles', icon: Shield },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-soft)] p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                        SaaS Core
                    </h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-slate-800 text-[var(--primary)]'
                                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-slate-900'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
