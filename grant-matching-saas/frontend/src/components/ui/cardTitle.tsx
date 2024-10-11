import { FC, HTMLAttributes } from 'react';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export const CardTitle: FC<CardTitleProps> = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};
