import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080710", // Deeper cosmic black
        slateNight: "#0f0e1a", // Deep Synthwave Violet
        neonCyan: "#00f0ff", // Liquid Laser Cyan
        neonBlue: "#7000ff", // Quantum Indigo
        neonMint: "#39ff14", // Acid Green Grid
        neonRose: "#ff007f", // Neon Synth Pink
        neonGold: "#ffde03", // Hyper Aurora Gold
        surface: "rgba(112, 0, 255, 0.04)",
        surfaceHover: "rgba(255, 0, 127, 0.08)",
      },
      boxShadow: {
        glow: "0 0 15px 1px rgba(112, 0, 255, 0.4), 0 18px 55px rgba(8, 7, 16, 0.75)",
        pulse: "0 0 32px rgba(255, 0, 127, 0.35)",
        card: "0 4px 24px -1px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)",
        "grid-dark": "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.18) 1px, transparent 0)",
        spotlight:
          "radial-gradient(circle at top, rgba(96,165,250,0.28), transparent 32%), radial-gradient(circle at 80% 20%, rgba(139,255,216,0.18), transparent 26%), linear-gradient(180deg, #020617 0%, #081121 48%, #020617 100%)",
        glass: "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["\"SFMono-Regular\"", "\"Roboto Mono\"", "ui-monospace", "monospace"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        scan: "scan 2s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
