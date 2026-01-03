
import React from 'react';
import { AlertTriangle, Calendar, Info } from 'lucide-react';

interface SubscriptionConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    newPlanName: string;
    newPlanPrice: string;
    isUpgrade: boolean; // True if upgrading/changing, False if new subscription
}

export const SubscriptionConfirmModal: React.FC<SubscriptionConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    newPlanName,
    newPlanPrice
}) => {
    if (!isOpen) return null;

    // Calculate renewal date (Today + 30 days)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);
    const formattedDate = renewalDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--card-bg)] rounded-xl shadow-2xl max-w-md w-full border border-[var(--border)] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                                Confirmar Cambio de Plan
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                Estás a punto de cambiar tu suscripción a <span className="font-bold">{newPlanName}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-lg flex items-center justify-between border border-[var(--border)]">
                        <span className="text-[var(--text)] font-medium">Nuevo Precio</span>
                        <span className="text-xl font-bold text-[var(--text)]">{newPlanPrice}/mes</span>
                    </div>

                    <div className="space-y-3 text-sm text-[var(--muted)]">
                        <p className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                            <span>
                                Al confirmar, tu suscripción actual finalizará inmediatamente y perderás los días restantes.
                            </span>
                        </p>
                        <p className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>
                                Se iniciará un nuevo ciclo de facturación de 30 días a partir de hoy.
                                <br />
                                <span className="font-medium text-[var(--text)]">Próxima renovación: {formattedDate}</span>
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:opacity-90 shadow-sm"
                    >
                        Confirmar y Pagar
                    </button>
                </div>
            </div>
        </div>
    );
};
