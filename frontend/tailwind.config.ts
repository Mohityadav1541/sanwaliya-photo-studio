import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        editorial: ["'Cormorant Garamond'", "'Playfair Display'", "serif"],
        atelier: ["'Cormorant Garamond'", "serif"],
      },
      colors: {
        // Daylight Atelier Palette
        alabaster: {
          DEFAULT: "#FAF8F5",
          light: "#FFFFFF",
          warm: "#F5F3EF",
        },
        limestone: {
          DEFAULT: "#EFECE6",
          dark: "#E5E1D8",
          muted: "#D8D3C8",
        },
        obsidian: {
          DEFAULT: "#181817",
          light: "#242423",
          deep: "#0F0F0E",
        },
        warmSlate: {
          DEFAULT: "#6E6A63",
          light: "#8F8B83",
          dark: "#4F4B45",
        },
        vermilion: {
          DEFAULT: "#D9381E",
          hover: "#C22E17",
          glow: "rgba(217, 56, 30, 0.25)",
        },
        champagneGold: "#C5A880",
        rawOak: "#D4BE9D",
        matteEspresso: "#1E1D1B",

        charcoal: {
          DEFAULT: "#181817",
          50: "#2A2A2A",
          100: "#242423",
          200: "#1E1E1D",
          300: "#181817",
          400: "#141413",
          500: "#181817",
        },
        ivory: {
          DEFAULT: "#FAF8F5",
          50: "#FFFFFF",
          100: "#FAF8F5",
          200: "#F5F3EF",
          300: "#EFECE6",
          400: "#E5E1D8",
          500: "#C9C2B5",
          muted: "#6E6A63",
        },
        editorial: {
          charcoal: "#181817",
          ivory: "#FAF8F5",
          accent: "#D9381E",
          gold: "#C5A880",
          oak: "#D4BE9D",
          espresso: "#1E1D1B",
          muted: "#6E6A63",
          border: "rgba(24, 24, 23, 0.08)",
          lightBorder: "rgba(24, 24, 23, 0.08)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
        },
        champagne: "hsl(var(--champagne))",
        ivory: "hsl(var(--ivory))",
        blush: "hsl(var(--blush))",
        rose: "hsl(var(--rose))",
        burgundy: "hsl(var(--burgundy))",
        espresso: "hsl(var(--espresso))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-light)))",
        "gradient-romantic": "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--blush)) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
