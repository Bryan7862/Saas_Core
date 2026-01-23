import { useNavigate } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const LandingNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg mr-2">
                            <Bot className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Nexus ERP</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#soluciones" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">Soluciones</a>
                        <a href="#beneficios" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">Beneficios</a>
                        <a href="#precios" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">Precios</a>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-900 dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 absolute w-full">
                    <div className="flex flex-col space-y-4 px-6 py-8">
                        <a href="#soluciones" className="text-lg font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>Soluciones</a>
                        <a href="#beneficios" className="text-lg font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>Beneficios</a>
                        <a href="#precios" className="text-lg font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>Precios</a>
                        <hr className="border-gray-100 dark:border-gray-800" />
                        <button
                            onClick={() => navigate('/login')}
                            className="text-lg font-medium text-gray-900 dark:text-white text-left"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium text-center"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
