import { FC, LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

export const Label: FC<LabelProps> = ({ htmlFor, children, ...props }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
};
