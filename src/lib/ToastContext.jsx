
import { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {createPortal(
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 9999
                }}>
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

function Toast({ toast, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            padding: '12px 24px',
            backgroundColor: toast.type === 'success' ? '#1a1a1a' : '#ff4444',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease-out forwards',
            minWidth: '250px'
        }}>
            <span style={{ fontSize: '1.1rem' }}>{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{toast.message}</span>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
