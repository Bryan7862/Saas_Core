import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import * as api from '../supabaseApi';

// Re-export types from API
export type Product = api.Product;
export type Category = api.Category;
export type Adjustment = api.Adjustment;

interface InventoryContextType {
    products: Product[];
    categories: Category[];
    adjustments: Adjustment[];
    loading: boolean;
    addProduct: (product: api.CreateProductDto) => Promise<void>;
    updateProduct: (id: string, data: Partial<api.CreateProductDto>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: api.CreateCategoryDto) => Promise<void>;
    updateCategory: (id: string, data: Partial<api.CreateCategoryDto>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addAdjustment: (adjustment: { product: string; quantity: number; reason: string; user_name: string; type: 'increase' | 'decrease' }) => Promise<void>;
    restockProduct: (id: string, quantity: number) => Promise<void>;
    refreshData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data from Supabase on mount
    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData, adjustmentsData] = await Promise.all([
                api.getProducts().catch(() => []),
                api.getCategories().catch(() => []),
                api.getAdjustments().catch(() => [])
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setAdjustments(adjustmentsData);
        } catch (error) {
            console.error('Error loading inventory data:', error);
            toast.error('Error al cargar datos de inventario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = async () => {
        await loadData();
    };

    // Products CRUD
    const addProduct = async (data: api.CreateProductDto) => {
        try {
            const newProduct = await api.createProduct(data);
            setProducts(prev => [...prev, newProduct]);
            toast.success('Producto creado');
        } catch (error) {
            toast.error('Error al crear producto');
            throw error;
        }
    };

    const updateProduct = async (id: string, data: Partial<api.CreateProductDto>) => {
        try {
            const updated = await api.updateProduct(id, data);
            setProducts(prev => prev.map(p => p.id === id ? updated : p));
            toast.success('Producto actualizado');
        } catch (error) {
            toast.error('Error al actualizar producto');
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Producto eliminado');
        } catch (error) {
            toast.error('Error al eliminar producto');
            throw error;
        }
    };

    // Categories CRUD
    const addCategory = async (data: api.CreateCategoryDto) => {
        try {
            const newCategory = await api.createCategory(data);
            setCategories(prev => [...prev, newCategory]);
            toast.success('Categoría creada');
        } catch (error) {
            toast.error('Error al crear categoría');
            throw error;
        }
    };

    const updateCategory = async (id: string, data: Partial<api.CreateCategoryDto>) => {
        try {
            const updated = await api.updateCategory(id, data);
            setCategories(prev => prev.map(c => c.id === id ? updated : c));
            toast.success('Categoría actualizada');
        } catch (error) {
            toast.error('Error al actualizar categoría');
            throw error;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await api.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success('Categoría eliminada');
        } catch (error) {
            toast.error('Error al eliminar categoría');
            throw error;
        }
    };

    // Adjustments
    const addAdjustment = async (data: { product: string; quantity: number; reason: string; user_name: string; type: 'increase' | 'decrease' }) => {
        try {
            // Find product by name
            const product = products.find(p => p.name === data.product);
            if (!product) {
                toast.error('Producto no encontrado');
                return;
            }

            // Use adjustStock which updates product and creates adjustment
            await api.adjustStock(
                product.id,
                product.name,
                data.type,
                data.quantity,
                data.reason,
                data.user_name
            );

            // Refresh data to get updated state
            await loadData();
            toast.success('Ajuste registrado');
        } catch (error) {
            toast.error('Error al registrar ajuste');
            throw error;
        }
    };

    const restockProduct = async (id: string, quantity: number) => {
        try {
            const product = products.find(p => p.id === id);
            if (!product) {
                toast.error('Producto no encontrado');
                return;
            }

            await api.adjustStock(
                id,
                product.name,
                'increase',
                quantity,
                'Reabastecimiento',
                'System'
            );

            await loadData();
            toast.success('Producto reabastecido');
        } catch (error) {
            toast.error('Error al reabastecer producto');
            throw error;
        }
    };

    return (
        <InventoryContext.Provider value={{
            products, categories, adjustments, loading,
            addProduct, updateProduct, deleteProduct,
            addCategory, updateCategory, deleteCategory,
            addAdjustment, restockProduct, refreshData
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
