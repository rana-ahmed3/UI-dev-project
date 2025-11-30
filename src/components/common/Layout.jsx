import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col text-slate-800 overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;