import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f0a',
        neon: '#2ecc71',
        neonDark: '#1d8f4d',
        surface: '#121a12',
        surfaceHover: '#1c291c',
        borderC: '#2a3b2a',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
