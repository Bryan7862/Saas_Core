import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    ChevronDown,
    Building2,
    Trash2
} from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userName, setUserName] = useState('Admin');
    const [userEmail, setUserEmail] = useState('admin@gym.com');

    // Cargar datos del perfil desde localStorage
    useEffect(() => {
        const loadProfileData = () => {
            const savedImage = localStorage.getItem('profileImage');
            const savedProfile = localStorage.getItem('userProfile');

            if (savedImage) {
                setProfileImage(savedImage);
            }

            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                if (profile.nombre && profile.apellido) {
                    setUserName(`${profile.nombre} ${profile.apellido}`);
                }
                if (profile.email) {
                    setUserEmail(profile.email);
                }
            }
        };

        loadProfileData();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            loadProfileData();
        };

        window.addEventListener('storage', handleStorageChange);

        // También escuchar un evento personalizado para cambios locales
        window.addEventListener('profileUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('profileUpdated', handleStorageChange);
        };
    }, [location]); // Re-cargar cuando cambie la ubicación

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = () => {
        // Here you would clear tokens, etc.
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Panel de Control', icon: LayoutDashboard },
        { path: '/organizations', label: 'Organizaciones', icon: Building2 },
        { path: '/users', label: 'Miembros', icon: Users },
        { path: '/trash', label: 'Papelera', icon: Trash2 },
    ];

    const configItems = [
        { label: 'General', path: '/settings/general' },
        { label: 'Facturación', path: '/settings/billing' },
        { label: 'Organizaciones', path: '/settings/orgs' },
        { label: 'Suscripción', path: '/pricing' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex font-sans text-[var(--text)]">
            {/* Mobile Overlay */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{ backgroundColor: 'var(--bg-soft)' }}
                className={`
                    fixed lg:static top-0 left-0 z-30 min-h-screen w-72
                    transform transition-transform duration-300 ease-in-out flex flex-col
                    ${!sidebarOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
                `}
            >
                {/* 1. Header / Profile Section (Top) */}
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden border border-border">
                            {profileImage ? (
                                <img src={profileImage} alt="Avatar" className="w-12 h-12 object-cover" />
                            ) : (
                                <Users className="w-6 h-6 text-muted" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-text leading-tight">{userName}</h3>
                            <p className="text-xs text-muted">{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Main Navigation (Center) */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-background text-text shadow-sm'
                                        : 'text-muted hover:bg-background hover:text-text'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Configuración Dropdown */}
                    <div className="pt-2">
                        <button
                            onClick={() => setConfigOpen(!configOpen)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-background hover:text-text transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Settings size={18} />
                                <span>Configuración</span>
                            </div>
                            <ChevronDown
                                size={14}
                                className={`transform transition-transform ${configOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {configOpen && (
                            <div className="pl-10 pr-2 py-1 space-y-1">
                                {configItems.map((subItem) => (
                                    <Link
                                        key={subItem.label}
                                        to={subItem.path}
                                        className="block px-3 py-2 text-sm text-muted hover:text-text rounded-md hover:bg-background transition-colors"
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* 3. Footer Section (Bottom) */}
                <div className="p-4 space-y-1">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-background hover:text-text transition-all"
                    >
                        {/* Using Users icon for profile as requested in menu structure "Mi Perfil" was separate */}
                        <Users size={18} />
                        <span>Mi Perfil</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-red-900/10 hover:text-red-600 transition-all"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-background flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 rounded-lg hover:bg-background lg:hidden text-muted"
                        >
                            <Menu size={20} />
                        </button>

                        <h1 className="text-xl font-bold text-text hidden sm:block">
                            Panel de Control
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 transition-all"
                            />
                        </div>

                        <button className="p-2 rounded-lg hover:bg-background text-muted relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
                        </button>

                        <button className="p-2 rounded-lg hover:bg-background text-muted lg:hidden">
                            <Search size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
