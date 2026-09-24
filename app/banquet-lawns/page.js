import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import PrimaryButton from "@/components/PrimaryButton";
import FadeIn from "@/components/FadeIn";
import FinalCTA from "@/components/FinalCTA";
import MediaSlider from "@/components/MediaSlider";
import { images } from "@/data/images";
import { canonicalBase } from "@/data/site";

export const metadata = {
  title: "Banquet & Lawns",
  description:
    "Banquet hall, lobby and landscaped lawns for weddings and celebrations at Anantam Resort, Shamshabad, Hyderabad.",
  alternates: {
    canonical: `${canonicalBase}/banquet-lawns`,
  },
  openGraph: {
    title: "Banquet & Lawns | Anantam",
    description:
      "Banquet hall, lobby and landscaped lawns for weddings and celebrations at Anantam Resort.",
    url: `${canonicalBase}/banquet-lawns`,
  },
};

function FeatureBlock({
  id,
  label,
  titleLines,
  text,
  amenities,
  slides,
  alt,
  reverse = false,
  tone = "cream",
}) {
  return (
    <section id={id} className={tone === "cream" ? "bg-cream" : "bg-ivory"}>
      <div
        className={`container-luxury section-pad grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <FadeIn>
          <div className="relative aspect-[3/2] overflow-hidden bg-ivory">
            <MediaSlider
              slides={slides}
              alt={alt}
              interval={5000}
              fit="cover"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="editorial-heading text-4xl sm:text-5xl">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            {text}
          </p>
          {amenities?.length ? (
            <ul className="mt-8 max-w-md space-y-3">
              {amenities.map((item) => (
                <li
                  key={item}
                  className="border-b border-forest-deep/10 pb-3 text-sm tracking-wide text-charcoal"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10">
            <PrimaryButton href="/contact#enquiry">
              Plan Your Celebration
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default function BanquetLawnsPage() {
  return (
    <>
      <PageHero
        image={images.banquet}
        label="Banquet & Lawns"
        titleLines={["Hall, lobby", "and open lawns."]}
        subtitle="An indoor banquet hall and lobby for gatherings, with landscaped lawns for weddings and celebrations under open sky."
      />

      <section className="section-pad bg-ivory py-20 lg:py-28">
        <div className="container-luxury max-w-3xl">
          <FadeIn>
            <SectionLabel>Gather</SectionLabel>
            <p className="font-serif text-2xl font-light leading-relaxed tracking-wide text-gold sm:text-3xl">
              Anantam holds space for celebrations — a banquet hall and lobby
              for gatherings indoors, and lawns for open-air moments.
            </p>
          </FadeIn>
        </div>
      </section>

      <FeatureBlock
        id="banquet-hall"
        label="Banquet Hall"
        titleLines={["A hall made", "for gathering."]}
        text="A spacious indoor hall with warm light, gold accents and room to host — weddings, receptions and celebrations shaped around your day."
        amenities={[
          "Spacious floor plan",
          "Warm ambient lighting",
          "AV-ready setup",
          "Connected to lobby",
        ]}
        slides={images.banquetHallSlides}
        alt="Anantam banquet hall interior"
        tone="cream"
      />

      <FeatureBlock
        id="lobby"
        label="Lobby"
        titleLines={["Arrive.", "Settle in."]}
        text="A bright pre-function lobby with chandelier light and easy seating — the clear welcome before the hall, for guests to gather and pause."
        amenities={[
          "Pre-function seating",
          "Chandelier lobby",
          "Polished arrival space",
          "Direct hall access",
        ]}
        slides={images.lobbySlides}
        alt="Anantam banquet lobby and pre-function area"
        reverse
        tone="ivory"
      />

      <FeatureBlock
        id="lawns"
        label="Lawns"
        titleLines={["Open skies.", "Open celebrations."]}
        text="Reception lawn, banquet lawn and infinity lawn — landscaped grounds framed by greenery for weddings, gatherings and evenings under open sky."
        amenities={[
          "Reception lawn",
          "Banquet lawn",
          "Infinity lawn",
          "Open-air setting",
        ]}
        slides={images.lawnSlides}
        alt="Anantam lawns — reception, banquet and infinity lawns"
        tone="cream"
      />

      <FinalCTA />
    </>
  );
}
