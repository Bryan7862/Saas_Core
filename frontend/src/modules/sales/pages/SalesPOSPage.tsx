import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Save } from 'lucide-react';
import { createTransaction } from '../../dashboard/api';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
}

// Mock products for POS - In future fetch from Inventory API
const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Consultoría Básica', price: 150.00, category: 'Servicios' },
    { id: '2', name: 'Suscripción Mensual', price: 50.00, category: 'Suscripciones' },
    { id: '3', name: 'Implementación Web', price: 1200.00, category: 'Proyectos' },
    { id: '4', name: 'Soporte Técnico', price: 80.00, category: 'Servicios' },
    { id: '5', name: 'Licencia Software', price: 200.00, category: 'Software' },
];

interface CartItem extends Product {
    quantity: number;
}

export const SalesPOSPage = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [applyTax, setApplyTax] = useState(true);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    // Inclusive Tax Logic
    // The list price is the Total to pay.
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = applyTax ? total / 1.18 : total;
    const tax = applyTax ? total - subtotal : 0;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            // Create a transaction for each item or one big transaction?
            // Let's create one summary transaction for simplicity
            const summaryDesc = description || `Venta POS: ${cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}`;

            await createTransaction({
                date: new Date().toISOString().split('T')[0],
                type: 'ingreso',
                amount: total,
                description: summaryDesc.substring(0, 255), // Limit length
                category: 'Venta POS'
            });

            toast.success('Venta registrada correctamente');
            setCart([]);
            setDescription('');
        } catch (error) {
            console.error(error);
            toast.error('Error al procesar la venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-4">
            {/* Products Grid */}
            <div className="flex-1 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShoppingCart className="text-[var(--primary)]" />
                    Catálogo de Productos
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_PRODUCTS.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg-primary)] transition-all text-left group"
                        >
                            <div className="font-semibold text-[var(--text)]">{product.name}</div>
                            <div className="text-sm text-[var(--muted)]">{product.category}</div>
                            <div className="mt-2 text-lg font-bold text-[var(--primary)]">S/ {product.price.toFixed(2)}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart / Checkout */}
            <div className="w-full md:w-96 bg-[var(--surface)] rounded-xl border border-[var(--border)] flex flex-col shadow-lg">
                <div className="p-4 border-b border-[var(--border)]">
                    <h3 className="font-bold text-lg">Resumen de Venta</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-[var(--muted)] py-10">
                            El carrito está vacío
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-[var(--muted)]">S/ {item.price.toFixed(2)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-[var(--bg-primary)] rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-500"><Minus size={14} /></button>
                                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-green-500"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-[var(--muted)] hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-primary)] rounded-b-xl">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]">
                            <span className="text-sm font-medium text-[var(--text)]">Aplicar IGV (18%)</span>
                            <button
                                onClick={() => setApplyTax(!applyTax)}
                                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${applyTax ? 'bg-[var(--primary)]' : 'bg-gray-400'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${applyTax ? 'translate-x-4' : ''}`} />
                            </button>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted)]">Subtotal {applyTax ? '(Sin IGV)' : ''}</span>
                            <span>S/ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted)]">IGV (18%)</span>
                            <span>S/ {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--border)]">
                            <span>Total</span>
                            <span>S/ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Nota o Cliente (Opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mb-4 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm"
                    />

                    <button
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Procesando...' : 'Completar Venta'}
                    </button>
                </div>
            </div>
        </div>
    );
};
