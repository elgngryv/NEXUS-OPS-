import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm shadow-sm transition-all duration-150 ${
        hoverable ? 'hover:border-slate-700 hover:bg-slate-900/80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
