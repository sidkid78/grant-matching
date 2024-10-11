import { ChangeEvent } from 'react';

interface InputProps {
    id: string; // Add this line
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function Input({ id, type, value, onChange, placeholder }: InputProps) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input-class" // Example Tailwind class
        />
    );
}
