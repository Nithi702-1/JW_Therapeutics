export default function PipelineSection() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-xs uppercase tracking-[0.18em] text-brand-accent font-semibold mb-3">
              Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] leading-snug font-semibold text-brand-primary mb-5">
              Comprehensive and differentiated cell therapy pipeline covering both
              hematological cancers and solid tumors
            </h2>
            <p className="text-base lg:text-lg leading-relaxed text-brand-ink/80 mb-6">
              We have strategically built a comprehensive and differentiated product
              pipeline of cellular immunotherapy, covering a variety of next-generation
              approaches that improve the risk-to-benefit ratio of our products,
              including allogeneic approaches, combination strategies with small
              molecules and other CAR-T products with new gene modifications. We
              believe that our product candidates have the potential to be the
              ground-breaking therapies in their respective indications.
            </p>
            <a
              href="https://www.jwtherapeutics.com/en/r-d-and-manufacturing/pipeline/"
              className="btn-primary"
            >
              Explore the pipeline
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-brand-accent/10 to-brand-primary/5 rounded-3xl -z-10" />
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card bg-brand-muted">
              <img
                src="/images/pipeline.png"
                alt="Pipeline imagery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
