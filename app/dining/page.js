import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import PrimaryButton from "@/components/PrimaryButton";
import FadeIn from "@/components/FadeIn";
import FinalCTA from "@/components/FinalCTA";
import ResortImage from "@/components/ResortImage";
import { images } from "@/data/images";
import { canonicalBase } from "@/data/site";

export const metadata = {
  title: "Dining",
  description:
    "Experience curated dining, private gatherings and celebration hospitality at Anantam Resort, Shamshabad.",
  alternates: {
    canonical: `${canonicalBase}/dining`,
  },
  openGraph: {
    title: "Dining | Anantam",
    description:
      "Curated dining and private gatherings at Anantam Resort, Shamshabad, Hyderabad.",
    url: `${canonicalBase}/dining`,
  },
};

const sections = [
  {
    label: "The Experience",
    title: ["Food as", "atmosphere."],
    text: "Dining at Anantam is shaped around warmth and pace — meals that feel considered, whether for a quiet evening or a longer celebration.",
    image: images.diningDetail,
  },
  {
    label: "Cuisine",
    title: ["Flavours,", "carefully chosen."],
    text: "Menus are curated for the occasion and the season. Exact offerings can be shared upon enquiry so every gathering feels personal.",
    image: images.dine,
  },
  {
    label: "Private Dining",
    title: ["Tables for", "your circle."],
    text: "Intimate settings for private dinners and smaller gatherings — space for conversation, without the noise of the city.",
    image: images.privateDining,
  },
  {
    label: "Celebrations",
    title: ["Evenings made", "to linger."],
    text: "From outdoor dining moments to celebration hosting, hospitality at Anantam centres on people, light and the feeling of being well looked after.",
    image: images.weddingLawn,
  },
];

export default function DiningPage() {
  return (
    <>
      <PageHero
        image={images.dining}
        label="Dining"
        titleLines={["Good food.", "Good company.", "Good time."]}
        subtitle="Curated meals and gatherings set within the calm of the resort landscape."
      />

      {sections.map((section, index) => {
        const reverse = index % 2 === 1;
        return (
          <section
            key={section.label}
            className={`${index % 2 === 0 ? "bg-ivory" : "bg-cream"}`}
          >
            <div
              className={`container-luxury section-pad grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28 ${
                reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <FadeIn>
                <ResortImage
                  src={section.image}
                  alt={section.label}
                  width={1600}
                  height={1067}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </FadeIn>
              <FadeIn delay={100}>
                <SectionLabel>{section.label}</SectionLabel>
                <h2 className="editorial-heading text-4xl sm:text-5xl">
                  {section.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                  {section.text}
                </p>
              </FadeIn>
            </div>
          </section>
        );
      })}

      <section className="section-pad bg-forest-deep py-20 text-center lg:py-24">
        <FadeIn>
          <h2 className="editorial-heading text-3xl text-gold sm:text-4xl">
            Ready to reserve a table
            <span className="block">or plan a gathering?</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/contact#enquiry" variant="solidLight">
              Enquire About Dining
            </PrimaryButton>
          </div>
        </FadeIn>
      </section>

      <FinalCTA />
    </>
  );
}
