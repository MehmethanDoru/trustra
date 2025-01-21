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
      animation: {
        'slide-text': 'slide 4s steps(2) infinite',
        'typewriter': 'typing 4s steps(20) infinite',
      },
      keyframes: {
        slide: {
          '0%, 50%': {
            transform: 'translateY(0%)',
          },
          '50.01%, 100%': {
            transform: 'translateY(-50%)',
          }
        },
        typing: {
          '0%, 50%': {
            width: '0%',
            content: 'Hava Durumuna Göre',
          },
          '25%': {
            width: '100%',
            content: 'Hava Durumuna Göre',
          },
          '75%': {
            width: '100%',
            content: 'Sıcaklık Durumuna Göre',
          },
          '100%': {
            width: '0%',
            content: 'Sıcaklık Durumuna Göre',
          }
        }
      },
      
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
