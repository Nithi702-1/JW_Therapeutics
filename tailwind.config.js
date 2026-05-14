/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0b3b5c",
          primaryDark: "#072a44",
          accent: "#eb6338",
          accentDark: "#cf5228",
          muted: "#f4f6f8",
          ink: "#1f2937",
          subtle: "#6b7280",
          line: "#e5e7eb",
        },
      },
      fontFamily: {
        sans: [
          "Outfit",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        display: [
          "EB Garamond",
          "Garamond",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
      },
      maxWidth: {
        site: "1200px",
      },
      boxShadow: {
        card: "0 6px 24px rgba(15, 23, 42, 0.08)",
        cardHover: "0 12px 32px rgba(15, 23, 42, 0.14)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lbclMaskIn: {
          "0%": {
            clipPath: "inset(42% 42% 42% 42% round 14px)",
            opacity: "0.5",
            filter: "blur(3px)",
          },
          "100%": {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            opacity: "1",
            filter: "blur(0px)",
          },
        },
        lbclMaskOut: {
          "0%": {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            opacity: "1",
            filter: "blur(0px)",
          },
          "100%": {
            clipPath: "inset(42% 42% 42% 42% round 14px)",
            opacity: "0.4",
            filter: "blur(3px)",
          },
        },
      },
      animation: {
        fadeUp: "fadeUp 700ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "lbcl-mask-in":
          "lbclMaskIn 0.72s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "lbcl-mask-out":
          "lbclMaskOut 0.56s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [],
};
