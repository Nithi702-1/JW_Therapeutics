export default function NewsCard({ item }) {
  return (
    <article className="group flex flex-col bg-white rounded-xl shadow-card hover:shadow-cardHover transition-all duration-300 overflow-hidden h-full">
      <a href={item.href} className="block aspect-[16/10] overflow-hidden bg-brand-muted">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </a>
      <div className="flex flex-col flex-1 p-5 lg:p-6">
        <div className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-2">
          {item.date}
        </div>
        <a href={item.href} className="block flex-1">
          <h3 className="text-base lg:text-[17px] leading-snug font-medium text-brand-ink group-hover:text-brand-accent transition-colors line-clamp-4">
            {item.title}
          </h3>
        </a>
        <div className="mt-4">
          <a href={item.href} className="btn-ghost">
            Read More
            <span aria-hidden="true">&gt;</span>
          </a>
        </div>
      </div>
    </article>
  );
}
