import { FC, ReactNode } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const Select: FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="relative inline-block w-full">
      {children}
    </div>
  );
};

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger: FC<SelectTriggerProps> = ({ children, className }) => {
  return (
    <button
      type="button"
      className={`border border-gray-300 rounded-md p-2 w-full ${className}`}
    >   
      {children}
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: FC<SelectValueProps> = ({ placeholder }) => {
  return (
    <span className="text-gray-700">
      {placeholder}
    </span>
  );
};

interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent: FC<SelectContentProps> = ({ children }) => {
  return (
    <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const SelectItem: FC<SelectItemProps> = ({ value, children }) => {
  return (
    <div
      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
      data-value={value}
    >
      {children}
    </div>
  );
};
