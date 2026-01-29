import React from 'react';

export default function Modal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(3px)'
        }}>
            <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #eee',
                animation: 'slideUp 0.2s ease-out'
            }}>
                <h3 style={{ marginBottom: '12px', fontSize: '1.25rem', color: '#1a1a1a' }}>{title}</h3>
                <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.5' }}>{message}</p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel}
                        className="btn"
                        style={{
                            background: '#f5f5f5',
                            color: '#333',
                            border: '1px solid #ddd'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn"
                        style={{
                            background: '#1a1a1a',
                            color: '#fff'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
