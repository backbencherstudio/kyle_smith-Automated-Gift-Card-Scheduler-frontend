import React from 'react';

type ButtonProps = {
  title: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export default function ButtonReuseable({ title, className, onClick, type = 'button', disabled }: ButtonProps) {
    return (
        <button 
            type={type}
            className={`py-2 px-4 rounded-md ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
}
