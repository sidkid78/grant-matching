import { FC, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  asChild?: boolean;
}

const Button: FC<ButtonProps> = ({ variant = 'primary', asChild = false, className, children, ...props }) => {
  const Component = asChild ? 'span' : 'button';
  const buttonClass = classNames(
    'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
      'bg-gray-600 text-white hover:bg-gray-700': variant === 'secondary',
      'bg-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',
    },
    className
  );

  return (
    <Component className={buttonClass} {...props}>
      {children}
    </Component>
  );
};

export { Button };
