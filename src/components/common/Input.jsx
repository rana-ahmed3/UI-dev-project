import React from 'react';

const Input = ({
    label,
    type = 'text',
    placeholder = '',
    className = '',
    ...props
}) => {
    return (
        <label className="flex flex-col">
            {label && <p className="text-slate-700 text-base font-medium pb-2">{label}</p>}
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-green-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 h-14 placeholder:text-slate-400 px-4 text-base font-normal ${className}`}
                {...props}
            />
        </label>
    );
};

export default Input;