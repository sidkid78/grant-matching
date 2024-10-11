import { FC, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  asChild?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
};

const Button: FC<ButtonProps> = ({ variant = 'primary', asChild = false, className, children, ...props }) => {
  const Component = asChild ? 'span' : 'button';
  const buttonClass = classNames(
    'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
    buttonVariants[variant],
    className
  );

  return (
    <Component className={buttonClass} {...props}>
      {children}
    </Component>
  );
};

export { Button };
