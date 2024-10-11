import { FC, HTMLAttributes } from 'react';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardHeader: FC<CardHeaderProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-4 py-5 sm:px-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CardHeader;
