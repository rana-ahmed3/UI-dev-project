import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500';

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700',
        secondary: 'bg-green-100 text-green-700 hover:bg-green-200',
        outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100',
        danger: 'bg-red-100 text-red-600 hover:bg-red-200'
    };

    const sizes = {
        small: 'h-10 px-4 text-sm',
        medium: 'h-12 px-6 text-base',
        large: 'h-14 px-8 text-lg'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;