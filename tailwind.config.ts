import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: { boxShadow:{glow:'0 0 45px rgba(34,211,238,.22)'} } }, plugins: [] };
export default config;
