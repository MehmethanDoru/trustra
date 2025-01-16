import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3399FF',    // Dark mode mavi
          orange: '#FF9466',  // Dark mode turuncu
        },
        background: {
          DEFAULT: '#121212', // Dark mode arka plan
        },
        text: {
          primary: '#FFFFFF',   // Dark mode ana metin
          secondary: '#BBBBBB', // Dark mode ikincil metin
        },
        action: {
          yellow: '#FFD54F',  // Dark mode sarı
          red: '#F28B82',     // Dark mode kırmızı
        },
        light: {
          primary: {
            blue: '#007ACC',    // Light mode mavi
            orange: '#FF7A59',  // Light mode turuncu
          },
          background: '#F5F5F5', // Light mode arka plan
          text: {
            primary: '#333333',   // Light mode ana metin
            secondary: '#666666', // Light mode ikincil metin
          },
          action: {
            yellow: '#FFC107',  // Light mode sarı
            red: '#DC3545',     // Light mode kırmızı
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
