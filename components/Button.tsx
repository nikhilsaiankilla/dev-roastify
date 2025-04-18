"use client";

import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react'

const Button = ({ text, destination, icon, className }: { text: string, destination?: string, icon?: ReactNode, className?: string }) => {
    const router = useRouter();

    const handleClick = () => {
        if (destination) {
            // If it's an external link
            if (destination.startsWith("http")) {
                window.open(destination, '_blank');
            } else {
                router.push(destination);
            }
        }
    };

    return (
        <button
            className={`flex items-center gap-1 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-200 ease-in-out px-3 md:px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${className}`}
            onClick={handleClick}
        >
            {icon}
            {text}
        </button>
    );
};

export default Button;
