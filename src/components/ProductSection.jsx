import { useEffect, useRef, useState } from "react";

/* ─── edge-feather constants ───────────────────────────────────────────────── */
const VIDEO_EDGE_WHITE = "255 255 255";
const VIDEO_EDGE_BLEND = [
  `linear-gradient(to bottom, rgb(${VIDEO_EDGE_WHITE}/55%) 0%,rgb(${VIDEO_EDGE_WHITE}/28%) 12%,rgb(${VIDEO_EDGE_WHITE}/10%) 24%,transparent 42%)`,
  `linear-gradient(to top,   rgb(${VIDEO_EDGE_WHITE}/55%) 0%,rgb(${VIDEO_EDGE_WHITE}/28%) 12%,rgb(${VIDEO_EDGE_WHITE}/10%) 24%,transparent 42%)`,
  `linear-gradient(to right, rgb(${VIDEO_EDGE_WHITE}/48%) 0%,rgb(${VIDEO_EDGE_WHITE}/22%) 10%,rgb(${VIDEO_EDGE_WHITE}/8%)  20%,transparent 36%)`,
  `linear-gradient(to left,  rgb(${VIDEO_EDGE_WHITE}/48%) 0%,rgb(${VIDEO_EDGE_WHITE}/22%) 10%,rgb(${VIDEO_EDGE_WHITE}/8%)  20%,transparent 36%)`,
].join(", ");

const PRODUCT_1_EDGE_RGB = "243 247 252";
const PRODUCT_1_EDGE_BLEND = [
  `radial-gradient(ellipse 138% 118% at 50% 50%,transparent 52%,rgb(${PRODUCT_1_EDGE_RGB}/14%) 74%,rgb(237 243 250/34%) 90%,rgb(234 241 248/44%) 100%)`,
  `linear-gradient(to bottom,rgb(${PRODUCT_1_EDGE_RGB}/30%) 0%,rgb(${PRODUCT_1_EDGE_RGB}/11%) 20%,transparent 44%)`,
  `linear-gradient(to top,   rgb(${PRODUCT_1_EDGE_RGB}/30%) 0%,rgb(${PRODUCT_1_EDGE_RGB}/11%) 20%,transparent 44%)`,
  `linear-gradient(to right, rgb(${PRODUCT_1_EDGE_RGB}/26%) 0%,rgb(${PRODUCT_1_EDGE_RGB}/9%)  18%,transparent 40%)`,
  `linear-gradient(to left,  rgb(${PRODUCT_1_EDGE_RGB}/26%) 0%,rgb(${PRODUCT_1_EDGE_RGB}/9%)  18%,transparent 40%)`,
].join(", ");

function productEdgeBlend(i) { return i === 0 ? PRODUCT_1_EDGE_BLEND : VIDEO_EDGE_BLEND; }

/* ─── video sources ─────────────────────────────────────────────────────────── */
const PRODUCT_VIDEOS = [
  "/images/Prodcut_1.mp4",
  "/images/Prodcut_2.mp4",
  "/images/Prodcut_3.mp4",
  "/images/Prodcut_4.mp4",
  "/images/Prodcut_5.mp4",
];

/* ─── overlay copy ──────────────────────────────────────────────────────────── */
const PRODUCT_1_OVERLAY = {
  title: "Large B-Cell Lymphoma",
  body:  "Carteyva® demonstrated exceptional clinical outcomes in relapsed/refractory Large B-Cell Lymphoma, establishing a landmark complete response rate in heavily pre-treated patients.",
  href:  "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/products/",
  tag:   "≥ 3L LBCL",
};
const PRODUCT_2_3_OVERLAY = {
  tag:   "≥ 3L FL",
  title: "Follicular Lymphoma",
  body:  "Follicular lymphoma (FL), a subtype of non-Hodgkin's lymphoma, is the most common indolent lymphoma. FL has a longer disease duration because the tumor grows slowly in the body. FL usually relapses and becomes more aggressive with each relapse, it also can transform to an aggressive lymphoma subtype.",
  href:  "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/products/",
};
const PRODUCT_4_5_OVERLAY = {
  tagTitle: "Mantle Cell Lymphoma",
  title:    "Mantle Cell Lymphoma",
  body:     "Follicular lymphoma (FL), a subtype of non-Hodgkin's lymphoma, is the most common indolent lymphoma. FL has a longer disease duration because the tumor grows slowly in the body. FL usually relapses and becomes more aggressive with each relapse, it also can transform to an aggressive lymphoma subtype.",
  href:     "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/products/",
};

/* ─── glass styles ──────────────────────────────────────────────────────────── */
const GLASS_SHADOW =
  "shadow-[0_2px_8px_rgba(15,23,42,0.05),0_10px_36px_rgba(15,23,42,0.08),0_20px_56px_-16px_rgba(15,23,42,0.06),inset_0_1px_0_0_rgba(255,255,255,0.55)]";
const glassPanelMain =
  `border border-sky-100/50 bg-[linear-gradient(155deg,rgba(232,244,253,0.78)_0%,rgba(245,250,255,0.58)_48%,rgba(255,255,255,0.48)_100%)] ${GLASS_SHADOW} backdrop-blur-2xl backdrop-saturate-[1.35]`;
const glassPanelTag =
  `border border-sky-100/50 bg-[linear-gradient(145deg,rgba(232,244,253,0.72)_0%,rgba(255,255,255,0.52)_100%)] ${GLASS_SHADOW} backdrop-blur-2xl backdrop-saturate-[1.35]`;
const videoBaseClass =
  "absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] [backface-visibility:hidden]";

/* ─── scroll engine config ───────────────────────────────────────────────────── */
const STICKY_HEIGHT   = "500vh";  // 400 vh of scroll travel
/**
 * Smoothing factor applied each rAF tick (lerp, not spring).
 * 0.08 = very gentle inertia, no oscillation, no overshoot.
 */
const LERP            = 0.08;
/** Hard cap on playbackRate when driving forward. */
const MAX_RATE        = 3.5;
/**
 * Minimum ms between backward seeks.
 * 150ms ≈ ~6-7 seeks/s — gives the decoder time to decode each keyframe
 * before the next seek is issued, eliminating the stutter cascade.
 */
const BACK_SEEK_MS    = 150;
/**
 * Round backward seek targets to this many decimal places.
 * 0.2 s grid = keyframe cache hits are far more likely.
 */
const BACK_SEEK_ROUND = 0.2;

/* ─── overlay group helper ───────────────────────────────────────────────────  */
function groupOf(idx) { return idx <= 0 ? 0 : idx <= 2 ? 1 : 2; }

/* ─── reusable "Learn More" link ─────────────────────────────────────────────  */
function LearnMore({ href }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent transition-colors hover:text-brand-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent md:mt-5 md:gap-2 md:text-[13px] lg:text-sm"
    >
      Learn More
      <span aria-hidden="true" className="text-sm font-normal md:text-[0.9375rem]">→</span>
    </a>
  );
}

/** Offset of Carteyva title block from the top of the product video frame (px). */
const CARTEYVA_HEADER_TOP_PX = 120;

/** Carteyva title + subtitle — top-centre over video */
function CarteyvaHeroHeader() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-[5] flex justify-center px-4 pb-0"
      style={{ top: CARTEYVA_HEADER_TOP_PX }}
      role="region"
      aria-label="Carteyva"
    >
      <div className="flex w-full max-w-3xl flex-col items-center px-4 pt-0 pb-0 sm:max-w-4xl sm:px-6">
        <h2 className="text-center text-[1.75rem] font-bold leading-[1.1] tracking-tight text-brand-primary sm:text-3xl md:text-[2.35rem] md:leading-none">
          Carteyva<sup className="align-super text-[0.45em] font-semibold">®</sup>
        </h2>
        <p className="mt-2 max-w-2xl text-center text-[12px] font-normal italic leading-snug text-slate-600 sm:mt-2.5 sm:text-sm md:text-[15px] md:leading-relaxed">
          Relmacabtagene Autoleucel — Autologous anti-CD19 CAR-T cell therapy
        </p>
      </div>
    </div>
  );
}

export default function ProductSection() {
  /* ─── video refs ───────────────────────────────────────────────────────── */
  const stickyRef = useRef(null);
  const ref0 = useRef(null); const ref1 = useRef(null); const ref2 = useRef(null);
  const ref3 = useRef(null); const ref4 = useRef(null);

  /* ─── video index React state (drives overlay visibility) ─────────────── */
  const [topIndex, setTopIndex] = useState(0);
  const topIdxRef    = useRef(0);
  const setTopIdxRef = useRef(setTopIndex);   // stable — never reassigned

  /* ─── overlay animation state ─────────────────────────────────────────── */
  const [overlayGroup,  setOverlayGroup]  = useState(0);   // which group is SHOWN
  const [closingGroup,  setClosingGroup]  = useState(null); // group playing mask-out
  const overlayGroupRef  = useRef(0);
  const closingGroupRef  = useRef(null);
  const pendingGroupRef  = useRef(null);
  const exitTimerRef     = useRef(null);

  /* ─── scrub engine refs ────────────────────────────────────────────────── */
  const durRef        = useRef([null, null, null, null, null]);
  const totalRef      = useRef(0);
  const targetRef     = useRef(0);    // desired global time (s) — written by scroll handler
  const dispRef       = useRef(0);    // lerp-smoothed display position (s)
  const lastSeekRef   = useRef(0);    // timestamp of last backward seek (ms)
  const seekPendRef   = useRef(false);// a seek is in flight on the active video
  const isBackRef     = useRef(false);// currently in backward-scrub mode
  const rafIdRef      = useRef(null);
  const rafOnRef      = useRef(false);

  /* ─── canvas double-buffer (eliminates blank frames during backward seek) */
  const scrubCanvasRef = useRef(null);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const canvasVisRef   = useRef(false);

  /* ─── preload every video ─────────────────────────────────────────────── */
  useEffect(() => {
    [ref0, ref1, ref2, ref3, ref4].forEach(r => r.current?.load());
  }, []);

  /* ─── overlay transition: watch topIndex ─────────────────────────────── */
  useEffect(() => {
    const newGroup = groupOf(topIndex);
    const cur      = overlayGroupRef.current;
    if (newGroup === cur && closingGroupRef.current === null) return;
    if (newGroup === cur) return;

    pendingGroupRef.current = newGroup;
    if (closingGroupRef.current !== null) return; // already transitioning — pending updated, wait

    // Start close
    closingGroupRef.current = cur;
    setClosingGroup(cur);
    clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => {
      const next = pendingGroupRef.current;
      overlayGroupRef.current  = next;
      closingGroupRef.current  = null;
      setOverlayGroup(next);
      setClosingGroup(null);
    }, 580); // slightly longer than lbclMaskOut (0.56 s)
  }, [topIndex]);

  /* ─── canvas double-buffer helpers ───────────────────────────────────── */
  /** Draw the current decoded frame of videoEl onto the scrub canvas. */
  const drawFrameToCanvas = useRef((videoEl) => {
    const canvas = scrubCanvasRef.current;
    if (!canvas || !videoEl || !videoEl.videoWidth) return;
    if (canvas.width  !== videoEl.videoWidth)  canvas.width  = videoEl.videoWidth;
    if (canvas.height !== videoEl.videoHeight) canvas.height = videoEl.videoHeight;
    try { canvas.getContext("2d")?.drawImage(videoEl, 0, 0); } catch (_) {}
  }).current;

  const showCanvas = useRef((show) => {
    if (canvasVisRef.current === show) return;
    canvasVisRef.current = show;
    setCanvasVisible(show);
  }).current;

  /* ─── core scroll + rAF scrub engine ─────────────────────────────────── */
  useEffect(() => {
    const vRefs = [ref0, ref1, ref2, ref3, ref4];

    /** Map a global time (s) → { idx, local } across all 5 clips. */
    function resolve(gTime) {
      const durs  = durRef.current;
      const total = totalRef.current;
      if (!total) return { idx: 0, local: 0 };
      const t = Math.max(0, Math.min(total, gTime));
      let cumul = 0;
      for (let i = 0; i < durs.length; i++) {
        const d = durs[i] ?? 0;
        if (t <= cumul + d || i === durs.length - 1) {
          return { idx: i, local: Math.max(0, Math.min(t - cumul, d)) };
        }
        cumul += d;
      }
      return { idx: 4, local: durs[4] ?? 0 };
    }

    /**
     * Issue one backward seek on `el` to `time`.
     * Before seeking: capture current frame to canvas so display never goes blank.
     * After seeked fires: capture the newly decoded frame to canvas.
     */
    function backwardSeek(el, time) {
      if (seekPendRef.current) return;   // don't pile up seeks
      // Capture last-good frame immediately so canvas stays non-blank
      drawFrameToCanvas(el);
      seekPendRef.current = true;
      const onSeeked = () => {
        el.removeEventListener("seeked", onSeeked);
        seekPendRef.current = false;
        drawFrameToCanvas(el);           // update canvas with newly decoded frame
      };
      el.addEventListener("seeked", onSeeked, { once: true });
      const safeT = Math.max(0, Math.min(time, durRef.current[topIdxRef.current] ?? 0));
      if (typeof el.fastSeek === "function") el.fastSeek(safeT);
      else el.currentTime = safeT;
    }

    /**
     * rAF tick
     * FORWARD  → playbackRate, zero seeking, hardware-accelerated = silky smooth.
     * BACKWARD → canvas double-buffer: canvas always shows last decoded frame;
     *            seeks happen in background, canvas updates on each seeked event.
     * AT REST  → pause, hide canvas, rAF loop exits.
     */
    function tick(now) {
      const target = targetRef.current;
      const prev   = dispRef.current;
      const delta  = target - prev;

      // Lerp — no overshoot, no oscillation
      const next = Math.abs(delta) < 0.002 ? target : prev + delta * LERP;
      dispRef.current = next;

      const direction = next - prev;   // + = forward, − = backward
      const { idx, local } = resolve(next);

      /* ── switch active video when scrub crosses a boundary ──────────── */
      if (idx !== topIdxRef.current) {
        // Capture outgoing video frame before switching so canvas doesn't flash
        if (isBackRef.current) drawFrameToCanvas(vRefs[topIdxRef.current]?.current);
        vRefs.forEach((r, i) => { if (i !== idx && r.current) r.current.pause(); });
        seekPendRef.current = false;
        const el = vRefs[idx].current;
        if (el) el.currentTime = local;
        topIdxRef.current = idx;
        setTopIdxRef.current(idx);
      }

      const el = vRefs[idx].current;
      if (!el) { rafIdRef.current = requestAnimationFrame(tick); return; }

      if (direction > 0.0005) {
        /* ── FORWARD ─────────────────────────────────────────────────── */
        if (isBackRef.current) {
          isBackRef.current = false;
          showCanvas(false);           // hide canvas, show live video
          seekPendRef.current = false;
        }
        const rate = Math.min(Math.max((delta / (1 / 60)) * 0.5, 0.1), MAX_RATE);
        if (el.paused) el.play().catch(() => {});
        el.playbackRate = rate;

      } else if (direction < -0.0005) {
        /* ── BACKWARD ────────────────────────────────────────────────── */
        if (!isBackRef.current) {
          isBackRef.current = true;
          // Capture first frame before entering backward mode
          drawFrameToCanvas(el);
          showCanvas(true);            // canvas overlays video — no blank frames
        }
        if (!el.paused) el.pause();
        // Issue a seek only when throttle window has elapsed AND no seek pending
        if (!seekPendRef.current && now - lastSeekRef.current >= BACK_SEEK_MS) {
          lastSeekRef.current = now;
          // Snap to BACK_SEEK_ROUND grid → maximize keyframe cache hits
          const snapped = Math.round(local / BACK_SEEK_ROUND) * BACK_SEEK_ROUND;
          backwardSeek(el, snapped);
        }

      } else {
        /* ── AT REST ─────────────────────────────────────────────────── */
        if (isBackRef.current) {
          isBackRef.current = false;
          showCanvas(false);
        }
        el.playbackRate = 1;
        if (!el.paused) el.pause();
      }

      const settled = Math.abs(delta) < 0.002 && Math.abs(direction) < 0.0005;
      if (settled) {
        rafOnRef.current = false;
      } else {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    }

    function startRaf() {
      if (!rafOnRef.current) {
        rafOnRef.current = true;
        rafIdRef.current = requestAnimationFrame(tick);
      }
    }

    function handleScroll() {
      const container = stickyRef.current;
      if (!container) return;
      const rect   = container.getBoundingClientRect();
      if (rect.top > 0) return;
      const travel = container.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top) / travel);
      targetRef.current = progress * (totalRef.current || 1);
      startRaf();
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafOnRef.current = false;
    };
  }, []);

  /** Store each video duration when metadata fires; recalculate total. */
  function handleLoadedMetadata(index) {
    return (e) => {
      const d    = e.currentTarget.duration;
      const next = durRef.current.map((v, i) => (i === index ? d : v));
      durRef.current = next;
      if (next.every(v => v !== null)) {
        const total = next.reduce((a, b) => a + b, 0);
        totalRef.current = total;
        // Re-anchor lerp position to current scroll so the video doesn't jump
        const c = stickyRef.current;
        if (c) {
          const r = c.getBoundingClientRect();
          const t = c.offsetHeight - window.innerHeight;
          if (r.top <= 0 && t > 0) {
            const prog = Math.min(1, Math.max(0, -r.top) / t);
            const tgt  = prog * total;
            targetRef.current = tgt;
            dispRef.current   = tgt;   // jump lerp position to avoid initial drift
          }
        }
      }
    };
  }

  /* ─── mask animation class helpers ───────────────────────────────────── */
  function cardMask(group) {
    return closingGroup === group ? "animate-lbcl-mask-out" : "animate-lbcl-mask-in";
  }
  function tagMask(group) {
    return closingGroup === group ? "animate-lbcl-mask-out" : "animate-lbcl-mask-in";
  }

  /* ─── render ──────────────────────────────────────────────────────────── */
  return (
    <div ref={stickyRef} style={{ height: STICKY_HEIGHT }}>
      <section
        id="product-section"
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-white"
      >
        <div className="flex min-h-0 flex-1 flex-col p-0">
          <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-white">

            {/* videos + edge — full bleed inside sticky frame */}
            <div className="absolute inset-0 z-[1]">
              {PRODUCT_VIDEOS.map((src, index) => (
                <video
                  key={src}
                  ref={[ref0, ref1, ref2, ref3, ref4][index]}
                  className={videoBaseClass}
                  style={{ zIndex: topIndex === index ? 2 : 1 }}
                  src={src} muted playsInline preload="auto"
                  onLoadedMetadata={handleLoadedMetadata(index)}
                  aria-hidden="true"
                />
              ))}
              {/*
                Canvas double-buffer — sits above videos (z-[2.5] effectively z-[3] below
                the edge overlay). Visible only during backward scrub. Always shows the
                last decoded frame so the display never goes blank between seeks.
              */}
              <canvas
                ref={scrubCanvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover [transform:translateZ(0)]"
                style={{ zIndex: 2, display: canvasVisible ? "block" : "none" }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 z-[3]"
                style={{ backgroundImage: productEdgeBlend(topIndex) }}
                aria-hidden="true"
              />
            </div>

            {/* Carteyva hero — top centre over video */}
            <CarteyvaHeroHeader />

            {/* ── LBCL overlay — group 0 ───────────────────────────────── */}
            {(overlayGroup === 0 || closingGroup === 0) && (
              <div className="pointer-events-none absolute inset-0 z-[4]">
                {/* main card */}
                <div className="absolute top-1/2 max-w-[22rem] -translate-y-1/2 translate-y-4 -translate-x-[130px] left-4 w-[min(calc(100%-2rem),20rem)] sm:left-8 sm:w-[min(calc(100%-3rem),21rem)] md:left-24 md:w-[min(calc(100%-3rem),22rem)] lg:left-72 xl:left-[500px] xl:w-[min(calc(100%-520px),22rem)]">
                  <div key={closingGroup === 0 ? "g0-card-out" : "g0-card-in"} className={`pointer-events-auto rounded-2xl md:rounded-3xl ${glassPanelMain} p-6 md:p-8 lg:p-10 ${cardMask(0)}`}>
                    <h2 className="text-lg font-bold leading-snug tracking-tight text-brand-ink md:text-xl lg:text-[1.35rem]">
                      {PRODUCT_1_OVERLAY.title}
                    </h2>
                    <p className="mt-3 text-[13px] leading-relaxed text-brand-ink md:mt-4 md:text-sm md:leading-[1.62] lg:mt-5 lg:text-[0.9375rem]">
                      {PRODUCT_1_OVERLAY.body}
                    </p>
                    <LearnMore href={PRODUCT_1_OVERLAY.href} />
                  </div>
                </div>
                {/* tag pill */}
                <div className="pointer-events-none absolute left-[calc(50%+min(3.5vw,2.75rem)+80px)] top-[calc(50%-175px)] z-[1] -translate-x-1/2 -translate-y-1/2 max-md:left-[calc(50%+min(7vw,3.25rem)+80px)]">
                  <div
                    key={closingGroup === 0 ? "g0-tag-out" : "g0-tag-in"}
                    className={`rounded-xl px-6 py-3 md:rounded-2xl md:px-8 md:py-4 ${glassPanelTag} ${tagMask(0)}`}
                    style={{ animationDelay: closingGroup === 0 ? "0.06s" : "0.12s" }}
                  >
                    <p className="text-center text-base font-bold tracking-tight text-brand-ink md:text-lg lg:text-[1.1875rem]">
                      {PRODUCT_1_OVERLAY.tag}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── FL overlay — group 1 ─────────────────────────────────── */}
            {(overlayGroup === 1 || closingGroup === 1) && (
              <div className="pointer-events-none absolute inset-0 z-[4]">
                <div className="relative h-full w-full">
                  {/* tag pill */}
                  <div
                    className={`pointer-events-none absolute left-4 top-[6%] z-[1] sm:left-6 sm:top-[7%] md:left-8 md:top-[8%] lg:left-12 lg:top-[9%] xl:left-[600px] xl:top-[600px] ${
                      topIndex === 1
                        ? "-translate-x-[60px] -translate-y-[70px] md:-translate-y-[320px]"
                        : "-translate-x-[30px] -translate-y-[50px] md:-translate-y-[300px]"
                    }`}
                  >
                    <div
                      key={closingGroup === 1 ? "g1-tag-out" : "g1-tag-in"}
                      className={`rounded-xl px-6 py-3 md:rounded-2xl md:px-8 md:py-4 ${glassPanelTag} ${tagMask(1)}`}
                      style={{ animationDelay: closingGroup === 1 ? "0.06s" : "0.12s" }}
                    >
                      <p className="text-center text-base font-bold tracking-tight text-brand-ink md:text-lg lg:text-[1.1875rem]">
                        {PRODUCT_2_3_OVERLAY.tag}
                      </p>
                    </div>
                  </div>
                  {/* main card */}
                  <div className="absolute bottom-[calc(6%+5rem)] left-4 right-4 z-[1] w-[min(calc(100%-2rem),22rem)] max-w-[22rem] sm:bottom-[calc(7%+5rem)] sm:left-6 sm:right-6 sm:w-[min(calc(100%-2.5rem),23rem)] md:bottom-[calc(8%+5rem)] md:left-8 md:right-8 md:max-w-[23rem] translate-x-[280px] translate-y-[80px] md:translate-y-[50px] lg:bottom-[calc(9%+5rem)] lg:left-12 lg:right-auto lg:w-[min(calc(100%-3rem),24rem)] xl:bottom-[140px] xl:left-[550px] xl:right-auto xl:w-[min(calc(100%-2rem),24rem)]">
                    <div key={closingGroup === 1 ? "g1-card-out" : "g1-card-in"} className={`pointer-events-auto rounded-2xl md:rounded-3xl ${glassPanelMain} p-6 md:p-8 lg:p-10 ${cardMask(1)}`}>
                      <h2 className="text-lg font-bold leading-snug tracking-tight text-brand-ink md:text-xl lg:text-[1.35rem]">
                        {PRODUCT_2_3_OVERLAY.title}
                      </h2>
                      <p className="mt-3 text-[13px] leading-relaxed text-brand-ink md:mt-4 md:text-sm md:leading-[1.62] lg:mt-5 lg:text-[0.9375rem]">
                        {PRODUCT_2_3_OVERLAY.body}
                      </p>
                      <LearnMore href={PRODUCT_2_3_OVERLAY.href} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MCL overlay — group 2 ────────────────────────────────── */}
            {(overlayGroup === 2 || closingGroup === 2) && (
              <div className="pointer-events-none absolute inset-0 z-[4]">
                <div className="relative h-full w-full">
                  {/* main card */}
                  <div
                    className={`absolute bottom-[9%] left-[5%] z-[1] w-[min(calc(100%-1.25rem),22rem)] max-w-[22rem] sm:bottom-[10%] sm:left-[6%] sm:w-[min(calc(100%-1.5rem),23rem)] md:bottom-[11%] md:left-[7%] md:max-w-[23rem] lg:bottom-[12%] lg:left-[8%] lg:w-[min(24rem,40vw)] xl:bottom-[11%] xl:left-[9%] xl:w-[min(26rem,38vw)] ${
                      topIndex === 3
                        ? "translate-x-[240px] -translate-y-[20px]"
                        : "translate-x-[240px]"
                    }`}
                  >
                    <div key={closingGroup === 2 ? "g2-card-out" : "g2-card-in"} className={`pointer-events-auto rounded-2xl md:rounded-3xl ${glassPanelMain} p-6 md:p-8 lg:p-10 ${cardMask(2)}`}>
                      <h2 className="text-lg font-bold leading-snug tracking-tight text-brand-ink md:text-xl lg:text-[1.35rem]">
                        {PRODUCT_4_5_OVERLAY.title}
                      </h2>
                      <p className="mt-3 text-[13px] leading-relaxed text-brand-ink md:mt-4 md:text-sm md:leading-[1.62] lg:mt-5 lg:text-[0.9375rem]">
                        {PRODUCT_4_5_OVERLAY.body}
                      </p>
                      <LearnMore href={PRODUCT_4_5_OVERLAY.href} />
                    </div>
                  </div>
                  {/* tag pill */}
                  <div
                    className={`pointer-events-none absolute right-[6%] top-[7%] z-[2] sm:right-[7%] sm:top-[8%] md:right-[8%] md:top-[7.5%] lg:right-[9%] lg:top-[7%] xl:right-[10%] xl:top-[6.5%] ${
                      topIndex === 3
                        ? "translate-x-[80px] -translate-y-[130px] md:translate-y-[270px] md:-translate-x-[360px]"
                        : "translate-x-[100px] -translate-y-[130px] md:translate-y-[270px] md:-translate-x-[340px]"
                    }`}
                  >
                    <div
                      key={closingGroup === 2 ? "g2-tag-out" : "g2-tag-in"}
                      className={`rounded-xl px-5 py-2.5 md:rounded-2xl md:px-6 md:py-3 ${glassPanelTag} ${tagMask(2)}`}
                      style={{ animationDelay: closingGroup === 2 ? "0.06s" : "0.12s" }}
                    >
                      <p className="max-w-[14rem] text-center text-sm font-bold leading-snug tracking-tight text-brand-ink md:max-w-[16rem] md:text-base lg:text-[1.0625rem]">
                        {PRODUCT_4_5_OVERLAY.tagTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
