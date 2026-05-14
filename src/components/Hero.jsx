import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    image: "/images/hero-2.jpg",
    video: "/images/hero-2.mp4",
    title: "JW therapeutics",
    subtitle: "Innovating cures, shaping what's next",
    eyebrow: "HKEx:2126 \u2022 Pioneering since 2016",
    description:
      "Licensure-quality CAR-T, from research to manufacturing, built on an integrated cell-therapy platform.",
    primary: {
      label: "See products",
      href: "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/products/",
    },
    secondary: {
      label: "Process tour",
      href: "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/process-development/",
    },
  },
  {
    image: "/images/hero-3.jpg",
    video: "/images/hero-3.mp4",
    title: "Next-Generation",
    subtitle: "Research highlights and clinical milestones",
    eyebrow: "Latest from the lab",
    description:
      "Driving next-generation cell therapy from China to the world. Read our newest research and clinical updates.",
    primary: {
      label: "Read latest news",
      href: "https://www.jwtherapeutics.com/en/media/press-release/",
    },
    secondary: {
      label: "Media library",
      href: "https://www.jwtherapeutics.com/en/media/media-library/",
    },
  },
  {
    image: "/images/hero-1.jpg",
    video: "/images/hero-1.mp4",
    title: "Carteyva®",
    subtitle:
      "China's first approved Class 1 new drug CAR-T product  | The only CAR-T product with three",
    eyebrow: "Trusted by patients worldwide",
    description:
      "Building breakthrough CAR-T therapies that bring hope to patients with hematologic malignancies, solid tumors and autoimmune diseases.",
    primary: {
      label: "Explore pipeline",
      href: "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/pipeline/",
    },
    secondary: {
      label: "Watch story",
      href: "https://www.jwtherapeutics.com/en/media/media-library/",
    },
  },
];

/** Custom scroll duration (faster than browser `behavior: "smooth"`) */
const HERO_SCROLL_MS = 380;

/** Time each hero slide stays on screen before auto-advancing */
const HERO_AUTO_SLIDE_MS = 5000;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

let heroScrollRaf = 0;

function scrollToY(targetY, durationMs = HERO_SCROLL_MS) {
  cancelAnimationFrame(heroScrollRaf);
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 1) return;
  const t0 = performance.now();
  const step = (now) => {
    const u = Math.min(1, (now - t0) / durationMs);
    const y = Math.round(startY + delta * easeOutCubic(u));
    window.scrollTo(0, y);
    if (u < 1) heroScrollRaf = requestAnimationFrame(step);
  };
  heroScrollRaf = requestAnimationFrame(step);
}

/*
 * Sticky travel = sectionHeight - viewportHeight.
 * We need (SLIDES.length) viewports of travel so we can dedicate 1 full
 * viewport to each slide.  So sectionHeight = (SLIDES.length + 1) * 100vh.
 */

function PlayIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function Hero() {
  const [active, setActive]     = useState(0);
  const [progress, setProgress] = useState(0);
  const [heroAutoPlay, setHeroAutoPlay] = useState(true);
  const sectionRef = useRef(null);
  const videoRefs  = useRef([]);
  const heroAutoExitDoneRef = useRef(false);

  const setVideoRef = useCallback((i) => (el) => {
    videoRefs.current[i] = el;
  }, []);

  /* ── scroll → slide index ── */
  const syncScroll = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const vh     = window.innerHeight || 1;
    const travel = sec.getBoundingClientRect().top * -1; // px scrolled into section
    // clamp to [0, N * vh]
    const clamped = Math.max(0, Math.min(travel, SLIDES.length * vh));

    const raw = clamped / vh;                      // 0 → SLIDES.length
    const idx = Math.min(SLIDES.length - 1, Math.floor(raw));
    const frac = raw - idx;

    setActive(idx);
    setProgress(Math.min(1, frac));
  }, []);

  useEffect(() => {
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
    };
  }, [syncScroll]);

  /* ── play / pause videos ── */
  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      i === active ? el.play().catch(() => {}) : el.pause();
    });
  }, [active]);

  /* ── dot / bar click → scroll to that slide ── */
  const goTo = useCallback((i) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const vh  = window.innerHeight || 1;
    const top = sec.offsetTop + i * vh;
    scrollToY(top);
  }, []);

  /* ── user wheel = take manual control of hero scroll (stops auto-advance) ── */
  useEffect(() => {
    const onWheel = () => setHeroAutoPlay(false);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /* ── auto-advance slides every 5s; after slide 3, scroll past hero ── */
  useEffect(() => {
    if (!heroAutoPlay || heroAutoExitDoneRef.current) return;

    const id = window.setTimeout(() => {
      const sec = sectionRef.current;
      if (!sec || heroAutoExitDoneRef.current) return;
      if (active < SLIDES.length - 1) {
        goTo(active + 1);
      } else {
        const vh = window.innerHeight || 1;
        heroAutoExitDoneRef.current = true;
        scrollToY(sec.offsetTop + SLIDES.length * vh);
      }
    }, HERO_AUTO_SLIDE_MS);

    return () => window.clearTimeout(id);
  }, [active, heroAutoPlay, goTo]);

  return (
    /*
     * Outer section creates the scroll "room".
     * height = (N + 1) × 100vh ensures N viewports of sticky travel.
     */
    <section
      id="hero-scroll-region"
      ref={sectionRef}
      className="relative w-full bg-[#04122c]"
      style={{ height: `${(SLIDES.length + 1) * 100}vh` }}
      aria-label="Hero"
    >
      {/* ── sticky frame ── */}
      <div className="sticky top-0 h-screen min-h-[560px] w-full overflow-hidden">

        {/* ── slide layers (stacked, crossfade) ── */}
        {SLIDES.map((slide, i) => {
          const on = i === active;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                on ? "z-[1] opacity-100" : "z-0 opacity-0 pointer-events-none"
              }`}
              aria-hidden={!on}
            >
              {slide.video ? (
                <video
                  ref={setVideoRef(i)}
                  className="absolute inset-0 h-full w-full object-cover brightness-[1.08] contrast-[1.04] saturate-[1.06] [transform:translateZ(0)]"
                  muted loop playsInline
                  preload={i <= 1 ? "auto" : "metadata"}
                  poster={slide.image}
                  aria-hidden="true"
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.image} alt=""
                  className="absolute inset-0 h-full w-full object-cover brightness-[1.06] contrast-[1.03]"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}

              {/* Lighter overlays so video stays vivid; left side still toned for copy contrast */}
              <div
                className="pointer-events-none absolute inset-0 bg-[#030a18]/35"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#04122c]/55 via-[#0b3b5c]/18 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020a18]/40 via-transparent to-[#04122c]/15"
                aria-hidden
              />
            </div>
          );
        })}

        {/* ── copy ── */}
        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-[200px]">
            <div className="max-w-2xl text-white">

              <div
                key={`eye-${active}`}
                className="inline-flex items-center rounded-full border border-white/30 bg-white/[0.06] backdrop-blur-md px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/90 animate-fadeUp"
              >
                {SLIDES[active].eyebrow}
              </div>

              <h1
                key={`h1-${active}`}
                className="mt-6 sm:mt-7 animate-fadeUp text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
                style={{ animationDelay: "80ms" }}
              >
                <span className="block font-display font-medium tracking-tight leading-[1.08] text-[40px] sm:text-[48px] lg:text-[80px] xl:text-[84px]">
                  {SLIDES[active].title}
                </span>
                <span className="mt-3 block max-w-xl font-sans font-light leading-relaxed tracking-normal text-white/90 text-[24px]">
                  {SLIDES[active].subtitle}
                </span>
              </h1>

              <p
                key={`p-${active}`}
                className="mt-5 sm:mt-6 max-w-lg text-sm sm:text-base lg:text-[17px] text-white/80 leading-relaxed animate-fadeUp"
                style={{ animationDelay: "160ms" }}
              >
                {SLIDES[active].description}
              </p>

              <div
                key={`cta-${active}`}
                className="mt-8 sm:mt-10 flex items-center gap-5 sm:gap-6 animate-fadeUp"
                style={{ animationDelay: "240ms" }}
              >
                <a
                  href={SLIDES[active].primary.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(235,99,56,0.45)] transition-colors hover:bg-brand-accentDark sm:px-7 sm:py-3.5 sm:text-[15px]"
                >
                  {SLIDES[active].primary.label}
                </a>
                <a
                  href={SLIDES[active].secondary.href}
                  className="group inline-flex items-center gap-3 text-sm sm:text-[15px] font-medium text-white"
                >
                  <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/[0.12] border border-white/30 backdrop-blur-md transition-transform group-hover:scale-105">
                    <PlayIcon className="h-3.5 w-3.5 translate-x-[1px]" />
                  </span>
                  <span className="group-hover:text-white/90">{SLIDES[active].secondary.label}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── progress bars ── */}
        <div className="absolute inset-x-0 bottom-8 z-[2] sm:bottom-10">
          <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-[200px]">
            <div className="flex w-full min-w-0 items-stretch gap-2 sm:gap-3">
              {SLIDES.map((_, i) => {
                const isActive = i === active;
                const isPast   = i < active;
                const fill     = isActive ? progress * 100 : isPast ? 100 : 0;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={isActive || undefined}
                    className="group flex min-w-0 flex-1 basis-0 flex-col focus:outline-none"
                  >
                    <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/25">
                      <span
                        className="block h-full rounded-full bg-white"
                        style={{
                          width: `${fill}%`,
                          transition: isActive ? "none" : "width 160ms ease-out",
                        }}
                      />
                    </span>
                    <span className="mt-2 hidden sm:flex items-center justify-between text-[11px] tracking-widest uppercase text-white/70">
                      <span className={isActive ? "font-semibold text-white" : ""}>0{i + 1}</span>
                      <span className="text-white/40">/ 0{SLIDES.length}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>{/* end sticky */}
    </section>
  );
}
