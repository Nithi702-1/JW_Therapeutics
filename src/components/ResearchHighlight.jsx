export default function ResearchHighlight() {
  return (
    <section className="bg-brand-muted py-14 lg:py-20">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-[460px]">
            <img
              src="/images/research-highlight.png"
              alt="CD19 CAR-T research"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-6 sm:px-10 lg:pr-12 py-8 lg:py-10">
            <div className="text-xs uppercase tracking-[0.18em] text-brand-accent font-semibold mb-3">
              Featured Research
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-[28px] leading-snug font-semibold text-brand-primary mb-4">
              1186 Clinical Response of CD19 CAR-T Cells (relmacabtagene autoleucel,
              relma-cel) in Adults with Heavily-Pre-Treated Relapsed/Refractory (r/r)
              Large B-Cell Lymphoma in China
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-brand-ink/80">
              The RELIANCE Trial provided the first demonstration of licensure-quality
              CAR-T manufacturing and clinical trial data generation in r/r patients
              originating in China. These results with relma-cel demonstrate similar
              preliminary response rates and PK profiles while providing the potential
              for an improved toxicity profile in heavily-pre-treated patients with r/r
              DLBCL having poor risk features relative to other CD19-specific CAR-Ts
              approved in the US and EU.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
