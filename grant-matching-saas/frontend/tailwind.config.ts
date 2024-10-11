import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#003366',
        'light-blue': '#1E90FF',
        'white': '#FFFFFF',
        'silver': '#C0C0C0',
        'green': '#32CD32',
        'red': '#FF4500',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};
export default config;
