import { useEffect, useId, useState } from "react";
import PharmaceuticalQualityWorkflow from "./PharmaceuticalQualityWorkflow.jsx";

const TABS = [
  { id: "jetcart", label: "JetCAR Platform" },
  { id: "vactails", label: "JW Vactails Lentiviral System" },
];

const JETCAR_COPY = {
  title: "JetCAR Platform",
  subtitle: "RAPID CAR-T CELL PRODUCTION PROCESS PLATFORM",
  body:
    "The JetCAR Platform is a rapid CAR-T cell production process platform independently developed by JW. By systematically optimizing cultivation processes, this platform can significantly shorten the production cycle, improve process efficiency, and ensure the reliability of self-transfection product quality. Currently, our platform has led to the development of various approved CAR-T products designed to improve the treatment efficiency as well as reliability and manufacturing capabilities of cell therapy products.",
  badges: [
    { key: "cycle", label: "Shorter production cycle", icon: "stopwatch" },
    {
      key: "efficiency",
      label: "200% improve process efficiency",
      icon: "trend",
    },
    {
      key: "quality",
      label: "Ensure self-transfection",
      icon: "check",
    },
  ],
};

const BAR_FILL_MS = 5000;
const BAR_HOLD_MS = 500;

/** Horizontal margins aligned with AboutSection / NewsCenter content column */
const ABOUT_PAGE_GUTTERS =
  "px-6 sm:px-10 md:px-16 lg:px-24 xl:px-[200px]";

const PIPELINE_COLUMNS = [
  {
    id: "armored",
    icon: "dna",
    headline: "CAR-T innovative therapies",
    tagline: "Developing next-generation",
    paragraphs: [
      "The world's leading Armored CAR-T product has entered clinical trials",
      "An enhanced lentiviral vector technology, a unique in vivo CAR-T technology platform has been constructed",
    ],
  },
  {
    id: "transfer",
    icon: "globe",
    headline: "CAR-T innovative therapies",
    tagline: "Promote technology transfer and",
    paragraphs: [
      "Successfully built a domestic best-in-class lentivirus technology platform, promoting the localization development and application of key core materials",
      "By leveraging international cooperation and technology transfer practices, we can help Chinese cell therapy innovations reach a wider market",
    ],
  },
  {
    id: "collab",
    icon: "target",
    headline: "collaborative R&D pipeline layout",
    tagline: "Multi-faceted and",
    paragraphs: [
      "The innovative pipeline comprehensively covers research topics addressing unmet medical needs challenging areas, including hematology malignancies, solid tumors, and autoimmune diseases",
      "Continuously meeting significant unmet clinical needs",
    ],
  },
];

function PipelineColumnIcon({ type, active }) {
  const cls = `h-[22px] w-[22px] transition-colors duration-300 ${
    active ? "text-brand-accent" : "text-white/35"
  }`;
  if (type === "dna") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9 7h2M13 11h2M9 15h2M13 19h2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "globe") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4 12h16M12 4c2.5 3 2.5 13 0 16M12 4c-2.5 3-2.5 13 0 16"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

const VACTAILS_COPY = {
  title: "JW Vactails Lentiviral System",
  subtitle: "LENTIVIRAL VECTOR MANUFACTURING PLATFORM",
  body:
    "The JW Vactails Lentiviral System supports scalable, high-quality vector production for advanced cell and gene therapies. Integrated process design and analytical controls help reduce variability, accelerate development timelines, and strengthen supply reliability as programs move from research toward clinical and commercial manufacturing.",
  badges: [
    { key: "scale", label: "Scalable vector production", icon: "trend" },
    { key: "control", label: "Robust process controls", icon: "check" },
    { key: "supply", label: "Reliable supply continuity", icon: "stopwatch" },
  ],
};

function BadgeIcon({ name }) {
  const common = "h-4 w-4 shrink-0 text-white/90";
  if (name === "stopwatch") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="13"
          r="7"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M12 9v4l2.5 1.5M10 3h4M12 3V1"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "trend") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 16l5-5 4 4 6-7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8h4v4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 12.5l3.5 3.5L18 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full-bleed lead-in above Featured Research.
 * Background: /images/BG.jpg — min height 2250px; grows with content; image fills via background-size 100% × 100%.
 */
export default function ResearchLeadInSection() {
  const [active, setActive] = useState("jetcart");
  const [pipelineActiveIndex, setPipelineActiveIndex] = useState(0);
  const [pipelineBarWidths, setPipelineBarWidths] = useState([0, 0, 0]);
  const tablistId = useId();
  const copy = active === "jetcart" ? JETCAR_COPY : VACTAILS_COPY;

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    (async () => {
      while (!cancelled) {
        for (let i = 0; i < PIPELINE_COLUMNS.length; i++) {
          if (cancelled) return;
          setPipelineActiveIndex(i);
          setPipelineBarWidths([0, 0, 0]);
          await sleep(50);
          if (cancelled) return;
          setPipelineBarWidths((prev) => {
            const next = [0, 0, 0];
            next[i] = 100;
            return next;
          });
          await sleep(BAR_FILL_MS + BAR_HOLD_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="research-lead-in"
      className="relative min-h-[2250px] w-full bg-no-repeat bg-center pb-16 sm:pb-20"
      style={{
        backgroundImage: "url(/images/BG.jpg)",
        backgroundSize: "100% 100%",
      }}
      aria-label="Research platforms"
    >
      <div
        className={`flex w-full min-w-0 flex-col ${ABOUT_PAGE_GUTTERS} pt-[80px]`}
      >
        <h2
          id={`${tablistId}-heading`}
          className="mb-3 text-center text-2xl font-bold tracking-tight text-white sm:mb-4 sm:text-3xl lg:text-[34px] lg:leading-snug"
        >
          Innovation Technology Platform
        </h2>
        <p
          id={`${tablistId}-intro`}
          className="mx-auto mb-6 max-w-3xl text-center text-sm leading-relaxed text-white/85 sm:mb-8 sm:text-base"
        >
          Our end-to-end innovation engine integrates discovery biology, advanced engineering, and AI-driven analytics into a unified CAR-T development flywheel.
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          role="tablist"
          aria-labelledby={`${tablistId}-heading`}
          aria-describedby={`${tablistId}-intro`}
          id={tablistId}
        >
          {TABS.map((tab) => {
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`${tablistId}-${tab.id}`}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors sm:px-7 sm:py-3 sm:text-[15px] ${
                  selected
                    ? "bg-brand-accent text-white shadow-sm"
                    : "border-2 border-brand-accent bg-transparent text-brand-accent"
                }`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          aria-labelledby={`${tablistId}-${active}`}
          className="mt-10 w-full min-w-0 sm:mt-12"
        >
          <div
            className="flex h-[550px] w-full min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#3E2D2A] shadow-[0_24px_60px_rgba(0,0,0,0.45)] lg:flex-row"
          >
            <div className="relative h-[42%] w-full shrink-0 min-h-0 overflow-hidden lg:h-full lg:w-[43%]">
              <img
                src="/images/Jetcar.png"
                alt={
                  active === "jetcart"
                    ? "JetCAR platform cell visualization"
                    : "Scientific cell visualization"
                }
                className="h-full w-full object-cover object-left object-bottom"
                loading="lazy"
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 pb-6 pt-2 lg:px-10 lg:py-10 lg:pl-4">
              <h2 className="text-xl font-bold text-brand-accent sm:text-2xl">
                {copy.title}
              </h2>
              <p className="mt-2 text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-white sm:text-xs">
                {copy.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-[15px]">
                {copy.body}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                {copy.badges.map((b) => (
                  <li
                    key={b.key}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/95 sm:px-4 sm:py-2 sm:text-[13px]"
                  >
                    <BadgeIcon name={b.icon} />
                    {b.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full min-w-0 text-left sm:mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[34px] lg:leading-snug">
            Building the Next Generation Pipeline
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-12 md:grid-cols-3 md:gap-10 lg:gap-14">
            {PIPELINE_COLUMNS.map((col, i) => {
              const isActive = pipelineActiveIndex === i;
              return (
                <div key={col.id} className="flex flex-col">
                  <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-brand-accent ease-out"
                      style={{
                        width: `${pipelineBarWidths[i]}%`,
                        transitionProperty: "width",
                        transitionDuration:
                          pipelineBarWidths[i] === 0 ? "0ms" : `${BAR_FILL_MS}ms`,
                      }}
                    />
                  </div>
                  <div className="mt-8 flex gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isActive
                          ? "border-brand-accent bg-brand-accent/15"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      <PipelineColumnIcon type={col.icon} active={isActive} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-[15px] font-bold leading-snug sm:text-base ${
                          isActive ? "text-brand-accent" : "text-white/45"
                        }`}
                      >
                        {col.headline}
                      </h3>
                      <p
                        className={`mt-1.5 text-xs leading-snug sm:text-[13px] ${
                          isActive ? "text-white/55" : "text-white/35"
                        }`}
                      >
                        {col.tagline}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-8 space-y-4 text-sm leading-relaxed sm:text-[15px] sm:leading-relaxed ${
                      isActive ? "text-white/90" : "text-white/40"
                    }`}
                  >
                    {col.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 w-full min-w-0 sm:mt-16 lg:mt-20">
          <PharmaceuticalQualityWorkflow />
        </div>
      </div>
    </section>
  );
}
