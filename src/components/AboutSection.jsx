import { useEffect, useRef, useState } from "react";

const KEY_FIGURES = [
  {
    value: "1+",
    label: "APPROVED PRODUCT",
    icon: "plus",
  },
  {
    value: "3",
    label: "INDICATIONS",
    icon: "target",
  },
  {
    value: "1000+",
    label: "PATIENTS TREATED",
    icon: "people",
  },
  {
    value: "500+",
    label: "EMPLOYEES",
    icon: "person",
  },
  {
    value: "20+",
    label: "GLOBAL PARTNERSHIPS",
    icon: "clipboard",
  },
];

const COUNT_DURATION_MS = 2200;

const PARSED_KEY_FIGURES = KEY_FIGURES.map((item) => {
  const m = item.value.match(/^(\d+)(\+)?$/);
  return {
    ...item,
    target: m ? Number(m[1]) : 0,
    suffix: m && m[2] ? "+" : "",
  };
});

function KeyFigureIcon({ name, className = "h-10 w-10" }) {
  const stroke = "currentColor";
  const sw = 1.75;
  switch (name) {
    case "plus":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <path
            d="M20 10v20M10 20h20"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="14" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="20" cy="20" r="8" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="20" cy="20" r="2.5" fill={stroke} />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="13" cy="14" r="4" fill="none" stroke={stroke} strokeWidth={sw} />
          <path
            d="M7 28c0-4 3.5-7 6-7s6 3 6 7"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
          <circle cx="27" cy="14" r="4" fill="none" stroke={stroke} strokeWidth={sw} />
          <path
            d="M21 28c0-4 3.5-7 6-7s6 3 6 7"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "person":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="20" cy="13" r="5" fill="none" stroke={stroke} strokeWidth={sw} />
          <path
            d="M10 32c0-6 4.5-11 10-11s10 5 10 11"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "clipboard":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <path
            d="M14 6h12v4H14V6zm-2 4h16v24a2 2 0 01-2 2H14a2 2 0 01-2-2V10z"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M16 22l4 4 8-8"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <div
          className={`flex items-center justify-center rounded-lg border-2 border-dashed border-brand-accent/50 bg-brand-muted/40 ${className}`}
          aria-hidden="true"
        >
          <span className="text-xs font-bold text-brand-accent/70">?</span>
        </div>
      );
  }
}

export default function AboutSection() {
  const figuresStripRef = useRef(null);
  const rafRef = useRef(0);
  const [counts, setCounts] = useState(() => PARSED_KEY_FIGURES.map(() => 0));
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const el = figuresStripRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit || hasStartedRef.current) return;
        hasStartedRef.current = true;

        const targets = PARSED_KEY_FIGURES.map((f) => f.target);
        let start = null;

        const tick = (now) => {
          if (start === null) start = now;
          const t = Math.min((now - start) / COUNT_DURATION_MS, 1);
          const eased = 1 - (1 - t) ** 3;
          setCounts(targets.map((n) => Math.round(n * eased)));
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            rafRef.current = 0;
            setCounts([...targets]);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] [backface-visibility:hidden]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/images/About_Us.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.05) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-start">
        <div className="flex w-full flex-col gap-14 px-6 sm:gap-16 sm:px-10 md:px-16 lg:gap-20 lg:px-24 xl:px-[200px] py-20 lg:py-28">
          <div className="max-w-[750px]">
            <div className="inline-flex items-center rounded-full border border-brand-primary/20 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-primary/80 backdrop-blur-sm">
              About Us
            </div>

            <h2 className="mt-6 whitespace-nowrap text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] leading-[1.05] font-semibold tracking-tight text-brand-primary">
              JW Therapeutics
            </h2>

            <p className="mt-6 text-[15px] sm:text-base lg:text-[17px] leading-relaxed text-brand-ink/80">
              JW Therapeutics (HKEx:2126) is an independent and innovative biotechnology
              company focusing on developing, manufacturing and commercializing cell
              immunotherapy products. Since its founding in 2016, JW Therapeutics has
              built an integrated platform for product development in cell immunotherapy,
              as well as a product pipeline covering hematologic malignancies, solid
              tumors, and autoimmune diseases.
              <br />
              <br />
              JW Therapeutics is committed to bringing breakthrough and quality cell
              immunotherapy products and the hope of a cure to patients in China and
              beyond, and to leading the healthy and standardized development of
              China&rsquo;s cell immunotherapy industry. For more information, please
              visit{" "}
              <a
                href="https://www.jwtherapeutics.com"
                className="font-medium text-brand-accent underline underline-offset-2 transition-colors hover:text-brand-accentDark"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.jwtherapeutics.com
              </a>
              .
            </p>
          </div>

          <div className="w-full min-w-0">
            <h3 className="text-lg font-bold uppercase tracking-[0.12em] text-brand-accent sm:text-xl">
              KEY FIGURES
            </h3>
            <p className="mt-2 text-sm text-brand-subtle sm:text-[15px]">
              Driving innovation. Delivering impact.
            </p>

            <div
              ref={figuresStripRef}
              className="relative isolate mt-6 h-[210px] w-full max-w-none overflow-x-hidden overflow-y-hidden rounded-2xl border border-white/55 bg-gradient-to-br from-white/45 via-white/[0.18] to-white/10 ring-1 ring-inset ring-white/40 backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/35 before:via-transparent before:to-brand-accent/[0.07] before:opacity-90 sm:mt-8 sm:rounded-3xl sm:before:rounded-3xl"
            >
              <ul className="relative z-[1] flex min-h-0 min-w-0 flex-col divide-y divide-white/35 sm:h-full sm:flex-row sm:divide-x sm:divide-y-0">
                {PARSED_KEY_FIGURES.map((item, i) => (
                  <li
                    key={item.label}
                    className="flex min-w-0 flex-1 flex-col items-start justify-center py-5 pl-[24px] pr-3 text-left sm:h-full"
                  >
                    <span className="text-brand-accent">
                      <KeyFigureIcon name={item.icon} />
                    </span>
                    <span className="mt-4 text-3xl font-bold tabular-nums text-brand-accent sm:text-4xl md:text-[2.35rem] md:leading-none">
                      {counts[i]}
                      {item.suffix}
                    </span>
                    <span className="mt-3 max-w-[15rem] text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-brand-subtle sm:text-[11px]">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
