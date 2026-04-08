import { createPortal } from 'react-dom';

interface ModalPortalProps {
    children: React.ReactNode;
    isOpen: boolean;
}

export const ModalPortal = ({ children, isOpen }: ModalPortalProps) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {children}
        </div>,
        document.body
    );
};
