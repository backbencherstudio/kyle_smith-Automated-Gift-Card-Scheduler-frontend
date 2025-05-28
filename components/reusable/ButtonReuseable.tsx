import React from 'react';

type ButtonProps = {
  title: string;
  className?: string;
  onClick?: () => void;
};

export default function ButtonReuseable({ title, className, onClick }: ButtonProps) {
    return (
        <button 
            className={`py-2 px-4 rounded-md ${className}`}
            onClick={onClick}
        >
            {title}
        </button>
    );
}
