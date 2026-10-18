import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false 
}) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-emerald-700 shadow-md shadow-emerald-100",
    secondary: "bg-secondary text-white hover:bg-sky-700 shadow-md shadow-sky-100",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'red' | 'yellow' | 'blue';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'green' }) => {
  const colors = {
    green: "bg-green-100 text-green-800 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${props.className || ''}`}
  />
);