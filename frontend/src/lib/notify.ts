import toast, { ToastOptions } from 'react-hot-toast';

// Base styles using CSS variables for Theme compatibility
const defaultOptions: ToastOptions = {
    className: '',
    style: {
        background: 'var(--card-bg)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
    },
    duration: 4000,
    position: 'top-right',
};

export const notify = {
    // Standard Success
    success: (message: string) => {
        toast.success(message, {
            ...defaultOptions,
            iconTheme: {
                primary: '#10B981', // Emerald-500
                secondary: 'white',
            },
        });
    },

    // Standard Error
    error: (message: string) => {
        toast.error(message, {
            ...defaultOptions,
            iconTheme: {
                primary: '#EF4444', // Red-500
                secondary: 'white',
            },
        });
    },

    // Loading State
    loading: (message: string) => {
        return toast.loading(message, {
            ...defaultOptions,
        });
    },

    // Promise Wrapper
    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                ...defaultOptions,
                style: {
                    ...defaultOptions.style,
                    minWidth: '250px',
                },
            }
        );
    },

    // Manual Dismiss
    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },

    // Custom (Info/General)
    custom: (message: string) => {
        toast(message, defaultOptions);
    }
};
