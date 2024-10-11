import { FC, ChangeEvent } from 'react';

interface InputProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    id?: string;
}

const Input: FC<InputProps> = ({ value, onChange, placeholder = '', type = 'text', name, id }) => {
    return (
        <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            name={name}
            id={id}
        />
    );
};

export default Input;
