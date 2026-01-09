import { useState } from 'react';
import { CreditCard, Wallet, Banknote, User, Package, Plus, Trash2 } from 'lucide-react';

export function CreateInvoicePage() {
    const [invoiceType, setInvoiceType] = useState('membership'); // membership | product
    const [paymentMethod, setPaymentMethod] = useState('card'); // card | cash | yape

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-text">Nueva Factura de Venta</h1>
                <div className="text-right">
                    <p className="text-muted">Factura #</p>
                    <p className="text-xl font-bold text-text">INV-00124</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Invoice Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Client Selection */}
                    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                            <User size={20} /> Detalles del Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Buscar Cliente</label>
                                <input type="text" placeholder="Ej: Juan Perez" className="w-full px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">DNI / RUC</label>
                                <input type="text" placeholder="Documento de Identidad" className="w-full px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Items & Type */}
                    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text flex items-center gap-2">
                                <Package size={20} /> Concepto de Venta
                            </h3>
                            <div className="flex bg-background p-1 rounded-lg">
                                <button
                                    onClick={() => setInvoiceType('membership')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${invoiceType === 'membership' ? 'bg-surface text-text shadow-sm' : 'text-muted'}`}
                                >
                                    Membresía
                                </button>
                                <button
                                    onClick={() => setInvoiceType('product')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${invoiceType === 'product' ? 'bg-surface text-text shadow-sm' : 'text-muted'}`}
                                >
                                    Producto
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Form based on Type */}
                        <div className="space-y-4">
                            {invoiceType === 'membership' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-1">Plan</label>
                                        <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>Mensual (Básico)</option>
                                            <option>Trimestral (Pro)</option>
                                            <option>Anual (VIP)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-1">Precio</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-muted">S/</span>
                                            <input type="number" defaultValue="29.00" className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Nombre del producto" className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        <input type="number" placeholder="Cant." className="w-20 px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        <input type="number" placeholder="Precio" className="w-24 px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <button className="text-sm text-primary font-medium flex items-center gap-1">
                                        <Plus size={16} /> Agregar otro producto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment & Summary */}
                <div className="space-y-6">

                    {/* Payment Method */}
                    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-text mb-4">Método de Pago</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary text-white' : 'border-border text-muted hover:bg-background'}`}
                            >
                                <CreditCard size={20} />Tarjeta Crédito/Débito
                            </button>
                            <button
                                onClick={() => setPaymentMethod('yape')}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${paymentMethod === 'yape' ? 'border-primary bg-primary text-white' : 'border-border text-muted hover:bg-background'}`}
                            >
                                <Wallet size={20} />Yape / Plin / QR
                            </button>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary text-white' : 'border-border text-muted hover:bg-background'}`}
                            >
                                <Banknote size={20} />Efectivo
                            </button>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-muted">
                                <span>Subtotal</span>
                                <span>S/ 24.58</span>
                            </div>
                            <div className="flex justify-between text-muted">
                                <span>IGV (18%)</span>
                                <span>S/ 4.42</span>
                            </div>
                            <div className="h-px bg-border my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-text">
                                <span>Total</span>
                                <span>S/ 29.00</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            Confirmar Venta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
