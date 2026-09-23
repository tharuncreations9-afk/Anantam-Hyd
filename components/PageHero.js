import Image from "next/image";
import SectionLabel from "./SectionLabel";

export default function PageHero({
  image,
  label,
  titleLines,
  subtitle,
  compact = false,
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden ${
        compact ? "min-h-[60vh]" : "min-h-[75vh] lg:min-h-[85vh]"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-forest-deep/25 to-forest-deep/20" />

      <div className="relative z-10 container-luxury section-pad w-full pb-16 pt-32 lg:pb-20">
        {label ? (
          <SectionLabel light className="animate-[fade-up_0.8s_ease_both]">
            {label}
          </SectionLabel>
        ) : null}
        <h1 className="editorial-heading max-w-4xl animate-[fade-up_0.9s_ease_0.1s_both] text-5xl text-gold sm:text-6xl lg:text-7xl">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-xl animate-[fade-up_0.9s_ease_0.2s_both] text-base leading-relaxed text-ivory/75 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
