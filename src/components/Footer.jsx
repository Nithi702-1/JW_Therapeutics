import { navItems } from "../data/nav.js";

function SocialIcon({ children, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/90 text-white transition-colors hover:bg-white/15 hover:border-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 bg-brand-accent" aria-hidden />
      <div
        className="absolute inset-0 bg-cover bg-[center_right] bg-no-repeat sm:bg-right"
        style={{ backgroundImage: "url('/images/FooterSection.jpg')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 w-full px-6 py-14 sm:px-10 md:px-16 lg:px-24 lg:py-20 xl:px-[200px]">
        <div className="grid grid-cols-1 gap-14 lg:gap-16 xl:grid-cols-2 xl:items-center xl:gap-x-16 xl:gap-y-0 2xl:gap-x-24">
          <div className="max-w-xl min-w-0 justify-self-start">
            <a
              href="https://www.jwtherapeutics.com/en/"
              className="inline-flex items-start gap-4"
            >
              <img
                src="/images/logo.png"
                alt=""
                className="h-10 w-auto shrink-0 brightness-0 invert opacity-95 sm:h-11"
                aria-hidden
              />
              <span className="flex flex-col gap-0.5 border-l border-white/25 pl-4 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-xs">
                  上海药明巨诺生物科技有限公司
                </span>
                <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  JW Therapeutics
                </span>
              </span>
            </a>

            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/95 sm:text-base">
              Our mission is to bring breakthrough cell immunotherapy products to patients in
              China and beyond, and to support the healthy, standardized development of the cell
              immunotherapy industry worldwide.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <SocialIcon
                href="https://www.linkedin.com/company/jwtherapeutics/"
                label="JW Therapeutics on LinkedIn"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6.5 8.5h-3V21h3V8.5zM4.48 6.27c.96 0 1.73-.78 1.73-1.73a1.73 1.73 0 10-3.46 0c0 .95.78 1.73 1.73 1.73zM21.5 21h-3v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V21h-3v-9.5h2.89v1.3h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V21z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://twitter.com/jwtherapeutics" label="JW Therapeutics on X">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.jwtherapeutics.com/en/" label="JW Therapeutics (opens in new tab)">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14 3h7v7M10 14L21 3M21 3v6M21 3h-6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

          <nav
            className="w-full min-w-0 justify-self-end xl:flex xl:w-full xl:justify-end"
            aria-label="Site"
          >
            <div className="ml-auto w-fit grid grid-flow-col grid-rows-3 grid-cols-2 gap-x-8 gap-y-4 sm:gap-x-10 sm:gap-y-5 xl:ml-0">
              {navItems.map((item) => (
                <div key={item.label} className="min-w-0">
                  <a
                    href={item.href}
                    className="text-sm font-semibold tracking-wide text-white transition-colors hover:text-white/80"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
