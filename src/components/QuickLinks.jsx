const LINKS = [
  {
    label: "Products",
    href: "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/products/",
    image: "/images/tile-products.png",
    blurb: "Approved and investigational cell immunotherapy products.",
  },
  {
    label: "Process Development",
    href: "https://www.jwtherapeutics.com/en/r-d-and-manufacturing/process-development/",
    image: "/images/tile-process.png",
    blurb:
      "An integrated platform for next-generation CAR-T process development.",
  },
  {
    label: "Join Us",
    href: "https://www.jwtherapeutics.com/en/career/join-us/",
    image: "/images/tile-join.png",
    blurb: "Build the future of cell therapy with our growing team.",
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative block overflow-hidden rounded-2xl shadow-card hover:shadow-cardHover transition-all duration-300 aspect-[4/5] md:aspect-[3/4]"
            >
              <img
                src={link.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/85 via-brand-primary/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7 text-white">
                <div className="text-xl lg:text-2xl font-semibold mb-2">
                  {link.label}
                </div>
                <p className="text-sm text-white/85 mb-4 line-clamp-2">{link.blurb}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/60 pb-0.5 group-hover:border-white">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
