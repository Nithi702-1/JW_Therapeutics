import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { newsItems } from "../data/news.js";

const SCROLL_DRIVER_VH = 220;
const GAP_PX = 24;

/** Horizontal margins aligned with `AboutSection` content column */
const ABOUT_PAGE_GUTTERS =
  "px-6 sm:px-10 md:px-16 lg:px-24 xl:px-[200px]";

function ArrowUpRight({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewsTile({ item, cardWidthPx }) {
  const fixed = cardWidthPx > 0;
  const w = fixed ? cardWidthPx : undefined;
  return (
    <article
      className="group flex h-full min-h-[28rem] w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-brand-line/70 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(235,99,56,0.12)] sm:min-h-[30rem]"
      style={
        fixed
          ? {
              flex: `0 0 ${w}px`,
              width: `${w}px`,
              minWidth: `${w}px`,
            }
          : undefined
      }
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-brand-muted sm:h-52">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
        <time
          dateTime={item.id}
          className="text-[13px] font-medium text-brand-subtle sm:text-sm"
        >
          {item.date}
        </time>
        <div className="mt-3 block min-h-0 flex-1">
          <h3 className="text-left text-base font-bold leading-snug text-brand-primary transition-colors group-hover:text-brand-accent sm:text-lg lg:line-clamp-4">
            {item.title}
          </h3>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-brand-line/50 pt-5 sm:mt-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-accent sm:text-xs">
            Read more
          </span>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function NewsCenter() {
  const scrollRootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cardWidthPx, setCardWidthPx] = useState(320);

  useLayoutEffect(() => {
    setReduceMotion(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const inner = vp.clientWidth;
    const perRow = inner < 768 ? 1 : 3;
    const gaps = (perRow - 1) * GAP_PX;
    const cardW = Math.max(240, Math.floor((inner - gaps) / perRow));
    setCardWidthPx(cardW);
    requestAnimationFrame(() => {
      const track = trackRef.current;
      const port = viewportRef.current;
      if (track && port) {
        setMaxTranslate(Math.max(0, track.scrollWidth - port.clientWidth));
      }
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (reduceMotion) {
      setTranslateX(0);
      return;
    }

    const onScroll = () => {
      const root = scrollRootRef.current;
      if (!root) return;
      const start = root.offsetTop;
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      const raw = (window.scrollY - start) / distance;
      const p = Math.min(1, Math.max(0, raw));
      setTranslateX(p * maxTranslate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [maxTranslate, reduceMotion]);

  if (reduceMotion) {
    return (
      <section className="bg-white py-14 lg:py-20">
        <div className={ABOUT_PAGE_GUTTERS}>
          <header className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl lg:text-[34px]">
                News &amp; Updates
              </h2>
              <p className="mt-2 max-w-xl text-sm text-brand-subtle sm:text-base">
                Explore latest news &amp; updates from our team.
              </p>
            </div>
            <span className="inline-flex shrink-0 cursor-default items-center gap-2 self-start rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm sm:self-auto">
              See All
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRight className="h-3.5 w-3.5 text-white" />
              </span>
            </span>
          </header>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <NewsTile key={item.id} item={item} cardWidthPx={0} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div
        ref={scrollRootRef}
        className="relative"
        style={{ minHeight: `${SCROLL_DRIVER_VH}vh` }}
      >
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
          <div
            className={`flex min-h-0 flex-1 flex-col ${ABOUT_PAGE_GUTTERS} py-10 sm:py-12 lg:py-14`}
          >
            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
              <div className="mt-[120px] shrink-0 border-b border-brand-line/40 pb-10 sm:pb-12 lg:pb-14">
                <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl lg:text-[34px] lg:leading-snug">
                      News &amp; Updates
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-subtle sm:text-[15px]">
                      Explore latest news &amp; updates from our team.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 cursor-default items-center gap-2 self-start rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md sm:self-auto">
                    See All
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </span>
                  </span>
                </header>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-center py-6 sm:py-8 lg:py-10">
                <div
                  ref={viewportRef}
                  className="min-h-0 w-full min-w-0 overflow-hidden"
                >
                  <div
                    ref={trackRef}
                    className="flex items-stretch gap-6"
                    style={{
                      transform: `translate3d(-${translateX}px,0,0)`,
                      willChange: "transform",
                    }}
                  >
                    {newsItems.map((item) => (
                      <NewsTile key={item.id} item={item} cardWidthPx={cardWidthPx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
