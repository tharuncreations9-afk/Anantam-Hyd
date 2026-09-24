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
      className={`relative flex items-end overflow-hidden bg-forest-deep ${
        compact
          ? "aspect-[3/2] sm:aspect-auto sm:min-h-[52vh] lg:min-h-[60vh]"
          : "aspect-[3/2] sm:aspect-auto sm:min-h-[65vh] lg:min-h-[85vh]"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-contain object-center sm:object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-forest-deep/25 to-forest-deep/15 sm:from-forest-deep/65 sm:via-forest-deep/25 sm:to-forest-deep/20" />

      <div className="relative z-10 container-luxury section-pad w-full pb-8 pt-20 sm:pb-16 sm:pt-32 lg:pb-20">
        {label ? (
          <SectionLabel light className="animate-[fade-up_0.8s_ease_both]">
            {label}
          </SectionLabel>
        ) : null}
        <h1 className="editorial-heading max-w-4xl animate-[fade-up_0.9s_ease_0.1s_both] text-[1.85rem] leading-[1.1] text-gold xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-xl animate-[fade-up_0.9s_ease_0.2s_both] text-xs leading-relaxed text-ivory/75 sm:mt-6 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
