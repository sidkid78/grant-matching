'use client'

import { FC, ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

const baseStyles = 'inline-flex items-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
const variantStyles = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500'
};
const sizeStyles = {
  small: 'px-2.5 py-1.5 text-xs',
  medium: 'px-3 py-2 text-sm',
  large: 'px-4 py-2 text-base'
};

export const Button: FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', className = '', ...props }) => {
  const buttonClass = classNames(baseStyles, variantStyles[variant], sizeStyles[size], className);

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
