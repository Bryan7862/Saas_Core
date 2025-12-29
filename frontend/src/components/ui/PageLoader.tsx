import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)] z-50">
            <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
            <p className="text-[var(--muted)] text-sm font-medium animate-pulse">Cargando...</p>
        </div>
    );
};
