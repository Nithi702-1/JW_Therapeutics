import { useEffect, useMemo, useState } from "react";
import { navItems } from "../data/nav.js";

const CONTACT_HREF = "https://www.jwtherapeutics.com/en/about-us/contact-us/";

const headerPad = "w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-[200px]";

/** Single decorative image for all mega menus (layout only; links still use nav data). */
const MEGA_MENU_IMAGE = "/images/Menu_image.png";

function ChevronDown({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaNavDropdown({ item, lightHeader }) {
  const children = item.children ?? [];
  const mid = Math.ceil(children.length / 2);
  const col1 = children.slice(0, mid);
  const col2 = children.slice(mid);

  const panel =
    lightHeader
      ? "border border-brand-line bg-white text-brand-ink shadow-[0_24px_48px_rgba(15,23,42,0.1)]"
      : "border border-white/25 bg-gradient-to-b from-white/[0.14] via-zinc-950/50 to-zinc-950/72 text-white shadow-[0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-[1.35]";

  const linkMuted = lightHeader ? "text-brand-subtle" : "text-white/65";
  const linkMain = lightHeader
    ? "text-[15px] font-medium text-brand-ink transition-colors hover:text-brand-accent"
    : "text-[15px] font-medium text-white/90 transition-colors hover:text-white";
  const kicker = lightHeader ? "text-brand-subtle" : "text-white/60";
  const rightBox = lightHeader ? "bg-brand-muted/80" : "bg-white/[0.08] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
  const featureFrame = lightHeader
    ? "border border-brand-line/40 bg-brand-muted/30 lg:border-brand-line/25"
    : "border border-white/15 bg-white/[0.06] backdrop-blur-sm lg:border-white/20";
  const learnMore = lightHeader
    ? "text-sm font-semibold text-brand-accent hover:text-brand-accentDark"
    : "text-sm font-semibold text-brand-accent hover:text-white";

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 top-full z-[60] -mt-2 pt-3"
      role="region"
      aria-label={`${item.label} menu`}
    >
      <div className={`overflow-hidden rounded-2xl ${panel}`}>
        <div className="grid min-h-0 grid-cols-1 gap-6 p-5 sm:p-6 lg:h-[200px] lg:grid-cols-12 lg:items-stretch lg:gap-x-12 lg:gap-y-0 lg:p-0">
          <div
            className={`min-h-0 overflow-hidden rounded-xl lg:col-span-4 lg:h-full lg:rounded-none lg:border-0 lg:border-r ${featureFrame}`}
          >
            <img
              src={MEGA_MENU_IMAGE}
              alt=""
              className="h-full min-h-[11rem] w-full object-cover object-center lg:min-h-0"
              loading="lazy"
            />
          </div>

          <div
            className={`flex min-h-0 items-center overflow-y-auto overscroll-contain px-1 py-2 sm:px-2 lg:col-span-5 lg:h-full lg:px-8 lg:py-0 xl:px-10 ${linkMuted}`}
          >
            <div className="grid w-full max-w-lg grid-cols-2 gap-x-12 gap-y-3 sm:gap-x-14 xl:gap-x-16">
              <ul className="space-y-2.5 lg:space-y-3">
                {col1.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} className={`${linkMain} block py-0.5 leading-snug`}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5 lg:space-y-3">
                {col2.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} className={`${linkMain} block py-0.5 leading-snug`}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`flex min-h-0 flex-col justify-center gap-2 rounded-xl p-5 sm:p-6 lg:col-span-3 lg:h-full lg:rounded-none lg:p-6 ${rightBox}`}
          >
            <p className={`text-[11px] font-bold uppercase leading-tight tracking-[0.14em] ${kicker}`}>
              {item.label}
            </p>
            <p
              className={`text-xs leading-snug lg:text-[13px] lg:leading-relaxed ${lightHeader ? "text-brand-ink/85" : "text-white/80"}`}
            >
              Explore this section on JW Therapeutics for overviews, updates, and resources.
            </p>
            <a href={item.href} className={`mt-auto inline-flex items-center gap-1 pt-1 ${learnMore}`}>
              Learn more
              <span aria-hidden className="text-base leading-none">
                ›
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  /** True = solid light pill (white). False = glass / hero-style pill over imagery. */
  const [lightHeader, setLightHeader] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);

  const megaItem = useMemo(
    () => navItems.find((i) => i.label === openSub && i.children?.length),
    [openSub],
  );

  useEffect(() => {
    const updateHeaderMode = () => {
      const vh = window.innerHeight || 1;
      const heroEl = document.getElementById("hero-scroll-region");
      let pastHero = window.scrollY > Math.max(120, vh - 80);
      if (heroEl) {
        const heroScrollEnd = heroEl.offsetTop + heroEl.offsetHeight - vh;
        pastHero = window.scrollY > heroScrollEnd;
      }

      const anchor = document.getElementById("research-lead-in");
      let inResearchSection = false;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const headerBand = 72;
        inResearchSection =
          rect.bottom > headerBand && rect.top < window.innerHeight - 32;
      }

      setLightHeader(pastHero && !inResearchSection);
    };

    updateHeaderMode();
    window.addEventListener("scroll", updateHeaderMode, { passive: true });
    window.addEventListener("resize", updateHeaderMode);
    return () => {
      window.removeEventListener("scroll", updateHeaderMode);
      window.removeEventListener("resize", updateHeaderMode);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pill = `pointer-events-auto flex w-full min-w-0 items-center justify-between gap-2 lg:gap-3 rounded-full px-2.5 py-2 lg:px-3 lg:py-2.5 transition-all duration-300 ${
    lightHeader
      ? "bg-white/95 border border-brand-line shadow-card backdrop-blur-md"
      : "bg-black/35 border border-white/25 shadow-[0_8px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-xl backdrop-saturate-150"
  }`;

  const logoSrc = lightHeader ? "/images/White_Logo.png" : "/images/logo.png";
  const logoClass = lightHeader
    ? "h-8 lg:h-9 w-auto"
    : "h-8 lg:h-9 w-auto brightness-0 invert opacity-95 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]";

  const linkBase =
    "inline-flex items-center gap-1 px-2.5 xl:px-3.5 py-2 rounded-full text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors";

  const inactiveLink = lightHeader
    ? "text-brand-ink hover:text-brand-primary hover:bg-brand-muted"
    : "text-white/90 hover:text-white hover:bg-white/15";

  const activeLink = lightHeader
    ? "text-brand-accent bg-brand-accent/10"
    : "text-brand-accent bg-brand-accent/20 shadow-inner";

  const navOpenRing = lightHeader
    ? "ring-1 ring-brand-ink/90 ring-offset-2 ring-offset-white"
    : "ring-1 ring-white/80 ring-offset-2 ring-offset-black/20";

  const langPrimary = lightHeader ? "text-brand-primary" : "text-white";
  const langDivider = lightHeader ? "text-brand-line" : "text-white/35";
  const langSecondary = lightHeader
    ? "text-brand-subtle hover:text-brand-primary"
    : "text-white/75 hover:text-white";

  const burgerBar = lightHeader ? "bg-brand-ink" : "bg-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className={`${headerPad} pt-4 lg:pt-6`}>
        <div
          className="pointer-events-auto relative"
          onMouseLeave={(e) => {
            const next = e.relatedTarget;
            if (next instanceof Node && e.currentTarget.contains(next)) return;
            setOpenSub(null);
          }}
        >
          <div className={pill}>
            <a
              href="https://www.jwtherapeutics.com/en/"
              className="flex items-center shrink-0 pl-2 pr-1"
            >
              <img src={logoSrc} alt="JW Therapeutics" className={logoClass} />
            </a>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpen = openSub === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasChildren) setOpenSub(item.label);
                      else setOpenSub(null);
                    }}
                  >
                    <a
                      href={item.href}
                      className={`${linkBase} ${item.isHome ? activeLink : inactiveLink} ${
                        hasChildren && isOpen ? navOpenRing : ""
                      }`}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
                      {item.label}
                      {hasChildren && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 opacity-70 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </a>
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3 pr-1">
              <div className="flex items-center gap-1.5 text-xs">
                <a
                  href="https://www.jwtherapeutics.com/en/"
                  className={`font-semibold ${langPrimary}`}
                >
                  EN
                </a>
                <span className={langDivider}>|</span>
                <a href="https://www.jwtherapeutics.com/cn/" className={langSecondary}>
                  简
                </a>
              </div>
              <a
                href={CONTACT_HREF}
                className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-accentDark"
              >
                Contact Us
              </a>
            </div>

            <div className="lg:hidden flex items-center gap-2 pr-1">
              <a
                href="https://www.jwtherapeutics.com/en/"
                className={`text-[11px] font-semibold ${langPrimary}`}
              >
                EN
              </a>
              <span className={`text-[11px] ${langDivider}`}>|</span>
              <a
                href="https://www.jwtherapeutics.com/cn/"
                className={`text-[11px] ${langSecondary}`}
              >
                简
              </a>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className={`ml-1 inline-flex flex-col justify-center items-center h-9 w-9 rounded-full ${
                  lightHeader ? "hover:bg-brand-muted" : "hover:bg-white/10"
                }`}
              >
                <span
                  className={`block h-0.5 w-4 ${burgerBar} transition-transform ${
                    mobileOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 ${burgerBar} my-1 transition-opacity ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 ${burgerBar} transition-transform ${
                    mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {megaItem && <MegaNavDropdown item={megaItem} lightHeader={lightHeader} />}
        </div>
      </div>

      {mobileOpen && (
        <div className={`pointer-events-auto lg:hidden ${headerPad} mt-2`}>
          <div
            className={`max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl shadow-2xl ${
              lightHeader
                ? "border border-brand-line bg-white"
                : "border border-white/15 bg-zinc-950/95 backdrop-blur-xl backdrop-saturate-150"
            }`}
          >
            <nav className="p-4">
              <ul className={lightHeader ? "divide-y divide-brand-line" : "divide-y divide-white/10"}>
                {navItems.map((item) => (
                  <li key={item.label} className="py-2">
                    <a
                      href={item.href}
                      className={`block py-2 text-base font-medium ${
                        item.isHome
                          ? "text-brand-accent"
                          : lightHeader
                          ? "text-brand-ink"
                          : "text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <ul className="space-y-1 pb-2 pl-4">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a
                              href={c.href}
                              className={`block py-1.5 text-sm ${
                                lightHeader
                                  ? "text-brand-subtle hover:text-brand-accent"
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <a
                href={CONTACT_HREF}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-accentDark"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
