import { Fragment, useEffect, useState } from "react";

const CIRCLE_ANIM_MS = 1000;
const LINE_ANIM_MS = 3000;

const SEGMENT_COLORS = [  "#eb6338",
  "#2dd4bf",
  "#38bdf8",
  "#a855f7",
  "#f97316",
  "#4f46e5",
  "#3b82f6",
];

const WORKFLOW_STEPS = [
  {
    id: "leuko",
    label: "Patient Leukapheresis",
    ring: "border-[#eb6338]",
    icon: "blood",
  },
  {
    id: "activation",
    label: "T-cell Activation",
    ring: "border-[#2563eb]",
    icon: "bolt",
  },
  {
    id: "transduction",
    label: "Viral Transduction",
    ring: "border-[#2563eb]",
    icon: "dna",
  },
  {
    id: "expansion",
    label: "Expansion & Culture",
    ring: "border-[#2563eb]",
    icon: "scope",
  },
  {
    id: "cryo",
    label: "Cryopreservation",
    ring: "border-[#2563eb]",
    icon: "snow",
  },
  {
    id: "qc",
    label: "QC Release Testing",
    ring: "border-[#2563eb]",
    icon: "qc",
  },
  {
    id: "infusion",
    label: "Patient Infusion",
    ring: "border-dashed border-white",
    icon: "syringe",
  },
];

const QUALITY_PILLAR_CARDS = [
  {
    id: "gmp",
    status: "Certified",
    title: "GMP Manufacturing",
    theme: "blue",
    iconBg: "bg-sky-500/15",
    iconStroke: "text-sky-400",
    dotClass: "bg-sky-400",
    bullets: [
      "ISO 13485 certified facility",
      "Closed-system automated processing",
      "Real-time environmental monitoring",
      "Full electronic batch records",
    ],
  },
  {
    id: "release",
    status: "Validated",
    title: "Product Release Testing",
    theme: "green",
    iconBg: "bg-emerald-500/15",
    iconStroke: "text-emerald-400",
    dotClass: "bg-emerald-400",
    bullets: [
      "Identity and potency assays",
      "Sterility and mycoplasma testing",
      "Vector copy number (VCN) analysis",
      "Phenotypic characterization",
    ],
  },
  {
    id: "reg",
    status: "Compliant",
    title: "Regulatory Compliance",
    theme: "purple",
    iconBg: "bg-violet-500/15",
    iconStroke: "text-violet-400",
    dotClass: "bg-violet-400",
    bullets: [
      "NMPA CTD submission ready",
      "ICH Q10 quality system framework",
      "Pharmacovigilance & risk management",
      "Post-market surveillance program",
    ],
  },
  {
    id: "analytics",
    status: "Active",
    title: "Analytics & QC",
    theme: "orange",
    iconBg: "bg-orange-500/15",
    iconStroke: "text-orange-400",
    dotClass: "bg-orange-400",
    bullets: [
      "Flow cytometry phenotyping",
      "Next-gen sequencing (NGS) integration",
      "ELISA & cytokine multiplex panels",
      "In vitro killing assays",
    ],
  },
];

function PillarCardIcon({ theme }) {
  const stroke = "currentColor";
  const cls = "h-5 w-5";
  if (theme === "blue") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20V10l4-2 4 2 4-2 4 2v10H4zM9 20v-6M15 20v-6"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 10V6l2-2h4l2 2v4"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (theme === "green") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M10 3h4v18H10V3zM12 7v6"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 21h8M9 3h6"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (theme === "purple") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4h10v14H8V4zM8 8h10M11 4v4"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 12h4M11 15h3"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="5" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M15 15l4 4M8 3h6M11 3v3"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepGlyph({ type }) {
  switch (type) {
    case "blood":
      return (
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5c-2.5 3.5-6 8.8-6 13a6 6 0 1012 0c0-4.2-3.5-9.5-6-13z" />
        </svg>
      );
    case "bolt":
      return (
        <svg
          className="h-5 w-5 text-amber-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      );
    case "dna":
      return (
        <svg
          className="h-5 w-5 text-violet-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8" />
          <path d="M9 7h2M13 11h2M9 15h2M13 19h2" strokeLinecap="round" />
        </svg>
      );
    case "scope":
      return (
        <svg
          className="h-5 w-5 text-sky-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="6" />
          <path d="M15.5 15.5L20 20M8 2h6M11 2v3" strokeLinecap="round" />
        </svg>
      );
    case "snow":
      return (
        <svg
          className="h-5 w-5 text-sky-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <path d="M12 3v18M5 7l14 10M19 7L5 17M8 4l2 2-2 2M16 16l2 2-2 2M8 20l2-2-2-2M16 8l2-2-2-2" />
        </svg>
      );
    case "qc":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-emerald-500">
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <path d="M6 12l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case "syringe":
      return (
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M10 4h4M12 4v3l3 8H9l3-8V4zM10 15h4" strokeLinecap="round" />
          <path d="M11 18v3M13 18v3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SegmentTrack({ index, filled }) {
  return (
    <div
      className="relative z-0 -mx-6 flex min-w-[4px] flex-1 items-center sm:-mx-7"
      aria-hidden
    >
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full ease-out"
          style={{
            width: filled ? "100%" : "0%",
            transitionProperty: "width",
            transitionDuration: filled ? `${LINE_ANIM_MS}ms` : "0ms",
            backgroundColor: SEGMENT_COLORS[index] ?? SEGMENT_COLORS[0],
          }}
        />
      </div>
    </div>
  );
}

export default function PharmaceuticalQualityWorkflow() {
  const [segmentFilled, setSegmentFilled] = useState(() =>
    Array(7).fill(false),
  );
  const [iconRevealed, setIconRevealed] = useState(() =>
    Array(7).fill(false),
  );
  const [pulsingNode, setPulsingNode] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    (async () => {
      while (!cancelled) {
        setSegmentFilled(Array(7).fill(false));
        setIconRevealed(Array(7).fill(false));
        setPulsingNode(null);
        await sleep(80);

        for (let i = 0; i < 6; i++) {
          if (cancelled) return;
          setPulsingNode(i);
          setIconRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await sleep(CIRCLE_ANIM_MS);
          setPulsingNode(null);
          if (cancelled) return;

          setSegmentFilled((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await sleep(LINE_ANIM_MS);
        }

        if (cancelled) return;
        setPulsingNode(6);
        setIconRevealed((prev) => {
          const next = [...prev];
          next[6] = true;
          return next;
        });
        await sleep(CIRCLE_ANIM_MS);
        setPulsingNode(null);
        if (cancelled) return;

        setSegmentFilled((prev) => {
          const next = [...prev];
          next[6] = true;
          return next;
        });
        await sleep(LINE_ANIM_MS);
        await sleep(600);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full min-w-0 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400 sm:text-xs">
        <span aria-hidden className="text-emerald-400">
          ✓
        </span>
        Quality assurance
      </div>

      <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px] lg:leading-snug">
        <span className="text-white">Pharmaceutical-Grade </span>
        <span className="text-emerald-400">Quality &amp; Safety</span>
      </h2>

      <p className="mt-5 w-full text-sm leading-relaxed text-white/65 sm:text-base">
        Every step of the Carteyva® manufacturing journey is governed by rigorous
        quality systems ensuring product consistency, patient safety, and regulatory
        compliance.
      </p>

      <div className="mt-10 rounded-3xl border border-white/10 bg-black/35 px-4 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-6 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-white">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <path d="M6 12l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-left text-sm font-semibold text-brand-accent sm:text-base">
              Vein-to-Vein Manufacturing Workflow
            </span>
          </div>
          <div className="flex justify-center sm:justify-end">
            <span className="rounded-full border border-emerald-400/90 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400 sm:text-[11px]">
              GMP validated
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[720px] sm:min-w-0">
            <div className="flex w-full items-center">
              {WORKFLOW_STEPS.map((step, i) => (
                <Fragment key={step.id}>
                  <div className="relative z-10 flex w-12 shrink-0 justify-center sm:w-14">
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-black transition-all ease-out sm:h-14 sm:w-14 ${
                        step.ring
                      } ${
                        iconRevealed[i]
                          ? "opacity-100 grayscale-0"
                          : "opacity-25 grayscale"
                      } ${
                        pulsingNode === i
                          ? "scale-110 shadow-[0_0_22px_rgba(235,99,56,0.55)] ring-2 ring-brand-accent ring-offset-2 ring-offset-[#0a0a0a]"
                          : "scale-100 shadow-none ring-0"
                      }`}
                      style={{
                        transitionDuration: `${CIRCLE_ANIM_MS}ms`,
                      }}
                    >
                      <StepGlyph type={step.icon} />
                    </div>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <SegmentTrack index={i} filled={segmentFilled[i]} />
                  )}
                </Fragment>
              ))}
              <div className="relative z-0 -ml-6 flex w-10 shrink-0 items-center sm:-ml-7 sm:w-12">
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full ease-out"
                    style={{
                      width: segmentFilled[6] ? "100%" : "0%",
                      transitionProperty: "width",
                      transitionDuration: segmentFilled[6]
                        ? `${LINE_ANIM_MS}ms`
                        : "0ms",
                      backgroundColor: SEGMENT_COLORS[6],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex w-full items-start">
              {WORKFLOW_STEPS.map((step, i) => (
                <Fragment key={`${step.id}-label`}>
                  <div className="flex w-12 shrink-0 flex-col items-center px-0.5 sm:w-14">
                    <p className="max-w-[5.5rem] text-center text-[9px] font-medium leading-snug text-white sm:max-w-[6.5rem] sm:text-[10px] md:text-[11px]">
                      {step.label}
                    </p>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div
                      className="-mx-6 min-w-[4px] flex-1 sm:-mx-7"
                      aria-hidden
                    />
                  )}
                </Fragment>
              ))}
              <div className="-ml-6 w-10 shrink-0 sm:-ml-7 sm:w-12" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 w-full text-left sm:mt-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {QUALITY_PILLAR_CARDS.map((card) => (
            <article
              key={card.id}
              className="group rounded-2xl border border-white/10 bg-zinc-900/45 px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_22px_48px_rgba(0,0,0,0.38)] sm:px-6 sm:py-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg} ${card.iconStroke}`}
                >
                  <PillarCardIcon theme={card.theme} />
                </div>
                <span className="pt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400 sm:text-[11px]">
                  {card.status}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold leading-snug text-white sm:text-lg">
                {card.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {card.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[13px] leading-snug text-white/90 sm:text-sm"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${card.dotClass}`}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
