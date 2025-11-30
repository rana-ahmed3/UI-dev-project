import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={`fixed top-4 right-4 ${bgColor[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right`}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                    {type === 'success' ? 'check_circle' :
                        type === 'error' ? 'error' :
                            type === 'warning' ? 'warning' : 'info'}
                </span>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;