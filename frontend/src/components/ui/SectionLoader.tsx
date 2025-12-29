import { Loader2 } from 'lucide-react';

interface SectionLoaderProps {
    message?: string;
    className?: string;
}

export const SectionLoader = ({ message = 'Cargando información...', className = '' }: SectionLoaderProps) => {
    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-2" />
            <p className="text-[var(--muted)] text-xs font-medium">{message}</p>
        </div>
    );
};
