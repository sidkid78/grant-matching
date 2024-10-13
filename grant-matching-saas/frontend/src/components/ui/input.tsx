import { InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input className="w-full px-3 py-2 border rounded-md" ref={ref} {...props} />
})

Input.displayName = 'Input'

export { Input }
