import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Search,
    Menu,
    ChevronDown,
    Trash2,
    ShoppingCart,
    Package,
    Truck,
    BarChart3,
    FileText,
    UserCog
} from 'lucide-react';

import { Toaster } from 'react-hot-toast';
import { NotificationBell } from './ui/NotificationBell';

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userName, setUserName] = useState('Usuario');
    const [userEmail, setUserEmail] = useState('');
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (label: string) => {
        setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    // Cargar datos del perfil
    useEffect(() => {
        const loadProfileData = async () => {
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) setProfileImage(savedImage);

            // Cargar datos locales inmediatamente
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.nombre || parsed.apellido) {
                        setUserName(`${parsed.nombre || ''} ${parsed.apellido || ''}`.trim());
                    }
                    if (parsed.email) setUserEmail(parsed.email);
                } catch (e) { console.error(e); }
            }

            try {
                // Use the token directly with fetch to avoid circular dependency issues if api.ts imports layout? 
                // actually api.ts is fine. But let's stick to fetch for zero-dep here or use api.
                // Let's use the raw fetch but improve the logic.
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/admin/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Profile Data Loaded:", data); // Debug

                    if (data.email) {
                        setUserEmail(data.email);
                    }

                    // Logic: If name exists, use it. If not, use email part or "Usuario"
                    if (data.firstName || data.lastName) {
                        setUserName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
                    } else if (data.email) {
                        // Fallback to email username if no name set
                        setUserName(data.email.split('@')[0]);
                    }
                } else {
                    console.error("Profile fetch failed:", response.status);
                }
            } catch (error) {
                console.error("Failed to load profile for sidebar", error);
            }
        };

        loadProfileData();

        // Escuchar cambios
        const handleStorageChange = () => {
            loadProfileData();
        };

        window.addEventListener('profileUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('profileUpdated', handleStorageChange);
        };
    }, [location]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = () => {
        // Here you would clear tokens, etc.
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const navGroups = [
        {
            label: 'Panel de Control',
            path: '/',
            icon: LayoutDashboard
        },
        {
            label: 'Ventas',
            icon: ShoppingCart,
            subItems: [
                { label: 'Nueva Venta (POS)', path: '/sales/pos' },
                { label: 'Historial de Ventas', path: '/sales/history' },
                { label: 'Devoluciones', path: '/sales/returns' },
            ]
        },
        {
            label: 'Inventario',
            icon: Package,
            subItems: [
                { label: 'Productos/Servicios', path: '/inventory/products' },
                { label: 'Categorías', path: '/inventory/categories' },
                { label: 'Ajustes de Stock', path: '/inventory/adjustments' },
                { label: 'Alertas de Stock', path: '/inventory/alerts' },
            ]
        },
        {
            label: 'Clientes',
            icon: Users,
            subItems: [
                { label: 'Lista de Clientes', path: '/clients' },
                { label: 'Nuevo Cliente', path: '/clients/new' },
                { label: 'Historial de Compras', path: '/clients/history' },
            ]
        },
        {
            label: 'Proveedores',
            icon: Truck, // Optional year 1
            path: '/suppliers'
        },
        {
            label: 'Reportes',
            icon: BarChart3,
            subItems: [
                { label: 'Ventas', path: '/reports/sales' },
                { label: 'Inventario', path: '/reports/inventory' },
                { label: 'Finanzas', path: '/reports/finance' },
                { label: 'Clientes Frecuentes', path: '/reports/clients' },
            ]
        },
        {
            label: 'Facturación',
            icon: FileText,
            subItems: [
                { label: 'Boletas/Facturas', path: '/billing/invoices' },
                { label: 'Configurar SUNAT', path: '/billing/config' },
                { label: 'Historial', path: '/billing/history' },
            ]
        },
    ];

    const adminItems = [
        { label: 'Miembros', path: '/users', icon: UserCog },
    ];

    const configItems = [
        { label: 'General', path: '/settings/general' },
        { label: 'Mi Organización', path: '/organizations' },
        { label: 'Facturación', path: '/settings/billing' },
        { label: 'Métodos de Pago', path: '/settings/payments' },
        { label: 'Mi Suscripción', path: '/pricing' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex font-sans text-[var(--text)]">
            <Toaster />
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
                    fixed lg:sticky top-0 left-0 z-30 h-screen w-72
                    transform transition-transform duration-300 ease-in-out flex flex-col
                    ${!sidebarOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
                    border-r border-[var(--border)]
                `}
            >
                {/* 1. Header / Profile Section (Top) */}
                <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden border border-border">
                            {profileImage ? (
                                <img src={profileImage} alt="Avatar" className="w-12 h-12 object-cover" />
                            ) : (
                                <Users className="w-6 h-6 text-muted" />
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-text leading-tight truncate">{userName}</h3>
                            <p className="text-xs text-muted truncate">{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Main Navigation (Center) */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {/* Main Sections */}
                    {navGroups.map((group) => {
                        const Icon = group.icon;
                        const hasSubItems = group.subItems && group.subItems.length > 0;
                        const isOpen = openGroups[group.label];
                        const isActive = group.path === location.pathname;

                        return (
                            <div key={group.label}>
                                {hasSubItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleGroup(group.label)}
                                            className={`
                                                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                                ${isOpen ? 'text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text)]'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} />
                                                <span>{group.label}</span>
                                            </div>
                                            <ChevronDown
                                                size={14}
                                                className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-10 pr-2 py-1 space-y-1">
                                                {group.subItems?.map(sub => (
                                                    <Link
                                                        key={sub.path}
                                                        to={sub.path}
                                                        className={`
                                                            block px-3 py-2 text-sm rounded-md transition-colors
                                                            ${location.pathname === sub.path
                                                                ? 'bg-[var(--primary)] text-white font-medium'
                                                                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-primary)]'
                                                            }
                                                        `}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={group.path!}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                            ${isActive
                                                ? 'bg-[var(--primary)] text-white shadow-sm'
                                                : 'text-[var(--muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text)]'
                                            }
                                        `}
                                    >
                                        <Icon size={18} />
                                        <span>{group.label}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}

                    <div className="my-4 border-t border-[var(--border)]" />

                    {/* Admin Section */}
                    {adminItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-[var(--primary)] text-white shadow-sm'
                                        : 'text-[var(--muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text)]'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Configuración */}
                    <div>
                        <button
                            onClick={() => setConfigOpen(!configOpen)}
                            className={`
                                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${configOpen ? 'text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text)]'}
                            `}
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

                        <div className={`overflow-hidden transition-all duration-200 ${configOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-10 pr-2 py-1 space-y-1">
                                {configItems.map((subItem) => (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={`
                                            block px-3 py-2 text-sm rounded-md transition-colors
                                            ${location.pathname === subItem.path
                                                ? 'bg-[var(--primary)] text-white font-medium'
                                                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-primary)]'
                                            }
                                        `}
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/trash"
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${location.pathname === '/trash'
                                ? 'bg-[var(--primary)] text-white shadow-sm'
                                : 'text-[var(--muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text)]'
                            }
                        `}
                    >
                        <Trash2 size={18} />
                        <span>Papelera</span>
                    </Link>

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

                        <NotificationBell />

                        <button className="p-2 rounded-lg hover:bg-background text-muted lg:hidden">
                            <Search size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-hidden p-4 sm:p-6 bg-[var(--bg-primary)] flex flex-col relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
