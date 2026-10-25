import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forest: {
          50: "#f0f7f4",
          100: "#d8ede3",
          200: "#b3ddc9",
          300: "#84c6aa",
          400: "#52b788",
          500: "#40916c",
          600: "#2d6a4f",
          700: "#1b4332",
          800: "#143326",
          900: "#0b2017",
        },
        earth: {
          50: "#fbf8f5",
          100: "#f5eee4",
          200: "#ebdec9",
          300: "#dcc6a6",
          400: "#c7a57a",
          500: "#b08968",
          600: "#936639",
          700: "#7f4f24",
          800: "#582f0e",
          900: "#3d1e08",
        },
        cream: {
          50: "#fefdfa",
          100: "#fbfaf5",
          200: "#f5f2e9",
          300: "#ede7d8",
          400: "#ded4be",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(27, 67, 50, 0.06), 0 1px 4px -1px rgba(27, 67, 50, 0.04)',
        'soft-md': '0 6px 16px -4px rgba(27, 67, 50, 0.08), 0 2px 6px -2px rgba(27, 67, 50, 0.04)',
        'soft-lg': '0 12px 28px -6px rgba(27, 67, 50, 0.12), 0 4px 12px -2px rgba(27, 67, 50, 0.06)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-hind-siliguri)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(82, 183, 136, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(82, 183, 136, 0.8)' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
