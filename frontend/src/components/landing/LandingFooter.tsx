import { Bot } from 'lucide-react';

const footerLinks = {
    producto: [
        { name: 'Características', href: '#beneficios' },
        { name: 'Precios', href: '#precios' },
        { name: 'Integraciones', href: '#' },
    ],
    compañia: [
        { name: 'Sobre Nosotros', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Carreras', href: '#' },
    ],
    legal: [
        { name: 'Privacidad', href: '#' },
        { name: 'Términos', href: '#' },
    ],
};

export const LandingFooter = () => {
    return (
        <footer className="bg-gray-950 border-t border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="bg-white text-black p-1.5 rounded-lg mr-2">
                                <Bot className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-white">Nexus ERP</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Plataforma de gestión integral para negocios modernos.
                        </p>
                    </div>

                    {/* Producto */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Producto</h4>
                        <ul className="space-y-3">
                            {footerLinks.producto.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compañía */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Compañía</h4>
                        <ul className="space-y-3">
                            {footerLinks.compañia.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Nexus ERP. Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {['Twitter', 'LinkedIn', 'Instagram'].map((social, i) => (
                            <a key={i} href="#" className="text-sm text-gray-600 hover:text-white transition-colors">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
