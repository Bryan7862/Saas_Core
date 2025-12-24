import { Construction } from 'lucide-react';

export const ConstructionPage = ({ title }: { title: string }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] p-8 text-center">
            <div className="bg-[var(--card-bg)] p-8 rounded-full mb-6 shadow-sm border border-[var(--border)]">
                <Construction size={64} className="text-[var(--primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">{title}</h1>
            <p className="max-w-md mx-auto">
                Estamos construyendo esta funcionalidad. Pronto podrás gestionar {title.toLowerCase()} desde aquí.
            </p>
        </div>
    );
};
