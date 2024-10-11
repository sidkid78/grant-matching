import { FC, HTMLAttributes } from 'react';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
