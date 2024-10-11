import { FC, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
