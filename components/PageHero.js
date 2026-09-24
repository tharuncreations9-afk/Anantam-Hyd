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
      className={`relative bg-forest-deep sm:flex sm:items-end sm:overflow-hidden ${
        compact ? "sm:min-h-[52vh] lg:min-h-[60vh]" : "sm:min-h-[65vh] lg:min-h-[85vh]"
      }`}
    >
      {/* Full landscape image on mobile — no text over logo */}
      <div className="relative aspect-[3/2] w-full sm:absolute sm:inset-0 sm:aspect-auto">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-contain object-center sm:object-cover"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-forest-deep/65 via-forest-deep/25 to-forest-deep/20 sm:block" />
      </div>

      <div className="relative z-10 container-luxury section-pad w-full py-8 sm:absolute sm:inset-x-0 sm:bottom-0 sm:pb-16 sm:pt-32 lg:pb-20">
        {label ? (
          <SectionLabel light className="animate-[fade-up_0.8s_ease_both]">
            {label}
          </SectionLabel>
        ) : null}
        <h1 className="editorial-heading max-w-4xl animate-[fade-up_0.9s_ease_0.1s_both] text-balance">
          {Array.isArray(titleLines) ? titleLines.join(" ") : titleLines}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-xl animate-[fade-up_0.9s_ease_0.2s_both] text-sm leading-relaxed text-ivory/75 sm:mt-6 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
