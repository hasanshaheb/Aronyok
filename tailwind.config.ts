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
        // Brand Master Colors:
        // Forest Green: #051F20 (Official Green Main Color)
        forest: {
          DEFAULT: "#051F20",
          50: "#f0f7f6",
          100: "#d6ecea",
          200: "#b3ddd8",
          300: "#87c7c0",
          400: "#55ada5",
          500: "#359088",
          600: "#23706a",
          700: "#17534f",
          800: "#051F20", // Official Aronyok Forest Green Main Color
          850: "#04191a",
          900: "#031314",
          950: "#020b0c", // Deep Midnight Botanical
        },
        // Terracotta: #C47D5A (Vibrant Opposite / Complementary Fire)
        terracotta: {
          50: "#fdf8f5",
          100: "#fbeee6",
          200: "#f7dacb",
          300: "#f0bfa7",
          400: "#e59c7b",
          500: "#C47D5A", // Official Aronyok Terracotta
          600: "#b56944",
          700: "#995133",
          800: "#7e432d",
          900: "#683929",
          950: "#391b12",
        },
        // Sage Green: #9EAF91
        sage: {
          50: "#f6f8f5",
          100: "#ebf0e8",
          200: "#d9e2d4",
          300: "#bed0b6",
          400: "#9EAF91", // Official Aronyok Sage
          500: "#839775",
          600: "#67795c",
          700: "#526049",
          800: "#434e3c",
          900: "#394233",
        },
        // Warm Cream: #F5F1E7
        cream: {
          50: "#fdfbf7",
          100: "#F5F1E7", // Official Aronyok Warm Cream
          200: "#eae3d2",
          300: "#ded2b9",
          400: "#cdb994",
          500: "#bfa374",
        },
        // Earth Brown: #8B684B
        earth: {
          50: "#faf7f4",
          100: "#f4ece5",
          200: "#e8d9cc",
          300: "#d6beaa",
          400: "#bf9e84",
          500: "#8B684B", // Official Aronyok Earth Brown
          600: "#7c593f",
          700: "#674734",
          800: "#553b2d",
          900: "#473227",
        },
        // Sunlit Ochre / Honey Amber (for vibrant highlights, stars, honey badges)
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Charcoal: #292C27
        charcoal: {
          DEFAULT: "#292C27", // Official Aronyok Charcoal
          50: "#f6f6f5",
          100: "#e7e7e6",
          200: "#cfcfcd",
          300: "#b0b1ad",
          400: "#8c8e88",
          500: "#6f716b",
          600: "#555751",
          700: "#444641",
          800: "#373833",
          900: "#292C27",
          950: "#1a1c18",
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
        'soft-sm': '0 2px 8px -2px rgba(5, 31, 32, 0.06), 0 1px 4px -1px rgba(5, 31, 32, 0.04)',
        'soft-md': '0 6px 18px -4px rgba(5, 31, 32, 0.1), 0 2px 8px -2px rgba(5, 31, 32, 0.05)',
        'soft-lg': '0 12px 32px -6px rgba(5, 31, 32, 0.14), 0 4px 14px -2px rgba(5, 31, 32, 0.08)',
        'soft-xl': '0 20px 45px -8px rgba(5, 31, 32, 0.18), 0 6px 18px -3px rgba(5, 31, 32, 0.1)',
        'terracotta-sm': '0 2px 8px -1px rgba(196, 125, 90, 0.25)',
        'terracotta-md': '0 8px 20px -3px rgba(196, 125, 90, 0.35)',
        'terracotta-lg': '0 14px 30px -4px rgba(196, 125, 90, 0.45)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        bengali: ['"Hind Siliguri"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(196, 125, 90, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(196, 125, 90, 0.6)' },
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
