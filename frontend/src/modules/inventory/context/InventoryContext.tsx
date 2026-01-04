import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

// Interfaces
export interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    price: number;
    status: 'Active' | 'Low Stock' | 'Out of Stock';
}

export interface Category {
    id: number;
    name: string;
    description: string;
    items: number;
}

export interface Adjustment {
    id: number;
    date: string;
    product: string;
    type: 'increase' | 'decrease';
    quantity: number;
    reason: string;
    user: string;
}

interface InventoryContextType {
    products: Product[];
    categories: Category[];
    adjustments: Adjustment[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, data: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    addCategory: (category: Omit<Category, 'id' | 'items'>) => void;
    updateCategory: (id: number, data: Partial<Category>) => void;
    deleteCategory: (id: number) => void;
    addAdjustment: (adjustment: Omit<Adjustment, 'id' | 'date'>) => void;
    restockProduct: (id: number, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    // Initial Mock Data
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Laptop Gamer X', category: 'Electrónica', stock: 12, minStock: 5, price: 3500.00, status: 'Active' },
        { id: 2, name: 'Silla Ergonómica', category: 'Mobiliario', stock: 45, minStock: 10, price: 450.00, status: 'Active' },
        { id: 3, name: 'Teclado Mecánico', category: 'Electrónica', stock: 8, minStock: 10, price: 120.00, status: 'Low Stock' },
        { id: 4, name: 'Monitor 24"', category: 'Electrónica', stock: 0, minStock: 5, price: 600.00, status: 'Out of Stock' },
    ]);

    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: 'Electrónica', description: 'Dispositivos y gadgets electrónicos', items: 15 },
        { id: 2, name: 'Mobiliario', description: 'Muebles de oficina y hogar', items: 8 },
        { id: 3, name: 'Software', description: 'Licencias y suscripciones digitales', items: 5 },
        { id: 4, name: 'Servicios', description: 'Consultoría y soporte técnico', items: 12 },
    ]);

    const [adjustments, setAdjustments] = useState<Adjustment[]>([
        { id: 1, date: '2024-01-04', product: 'Laptop Gamer X', type: 'decrease', quantity: 1, reason: 'Dañado', user: 'Admin' },
        { id: 2, date: '2024-01-03', product: 'Silla Ergonómica', type: 'increase', quantity: 5, reason: 'Devolución Cliente', user: 'Admin' },
        { id: 3, date: '2024-01-02', product: 'Teclado Mecánico', type: 'decrease', quantity: 2, reason: 'Uso Interno', user: 'Juan Perez' },
        { id: 4, date: '2024-01-08', product: 'Monitor 24"', type: 'decrease', quantity: 10, reason: 'Robo', user: 'Admin' },
    ]);

    // Helpers to recalculate status
    const calculateStatus = (stock: number, minStock: number): Product['status'] => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= minStock) return 'Low Stock';
        return 'Active';
    };

    // Actions
    const addProduct = (data: Omit<Product, 'id'>) => {
        const newProduct = { ...data, id: Math.max(...products.map(p => p.id), 0) + 1 };
        setProducts([...products, newProduct]);
        toast.success('Producto creado');
    };

    const updateProduct = (id: number, data: Partial<Product>) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...data, status: calculateStatus(data.stock ?? p.stock, data.minStock ?? p.minStock) } : p));
        toast.success('Producto actualizado');
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Producto eliminado');
    };

    const addCategory = (data: Omit<Category, 'id' | 'items'>) => {
        const newCategory = { ...data, id: Math.max(...categories.map(c => c.id), 0) + 1, items: 0 };
        setCategories([...categories, newCategory]);
        toast.success('Categoría creada');
    };

    const updateCategory = (id: number, data: Partial<Category>) => {
        setCategories(categories.map(c => c.id === id ? { ...c, ...data } : c));
        toast.success('Categoría actualizada');
    };

    const deleteCategory = (id: number) => {
        setCategories(categories.filter(c => c.id !== id));
        toast.success('Categoría eliminada');
    };

    const addAdjustment = (data: Omit<Adjustment, 'id' | 'date'>) => {
        const newAdj = { ...data, id: Math.max(...adjustments.map(a => a.id), 0) + 1, date: new Date().toISOString().split('T')[0] };
        setAdjustments([newAdj, ...adjustments]);

        // Also update product stock
        const product = products.find(p => p.name === data.product);
        if (product) {
            const newStock = data.type === 'increase' ? product.stock + data.quantity : Math.max(0, product.stock - data.quantity);
            updateProduct(product.id, { stock: newStock });
            // Toast handled in updateProduct but we might want a specific message here
        }

        toast.success('Ajuste registrado');
    };

    const restockProduct = (id: number, quantity: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            const newStock = product.stock + quantity;
            updateProduct(id, { stock: newStock });

            // Auto-log adjustment
            const newAdj: Adjustment = {
                id: Math.max(...adjustments.map(a => a.id), 0) + 1,
                date: new Date().toISOString().split('T')[0],
                product: product.name,
                type: 'increase',
                quantity: quantity,
                reason: 'Reabastecimiento Automático',
                user: 'System'
            };
            setAdjustments([newAdj, ...adjustments]);
        }
    };

    return (
        <InventoryContext.Provider value={{
            products, categories, adjustments,
            addProduct, updateProduct, deleteProduct,
            addCategory, updateCategory, deleteCategory,
            addAdjustment, restockProduct
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) throw new Error('useInventory must be used within InventoryProvider');
    return context;
};
