import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import PrimaryButton from "@/components/PrimaryButton";
import FadeIn from "@/components/FadeIn";
import FinalCTA from "@/components/FinalCTA";
import MediaSlider from "@/components/MediaSlider";
import { images } from "@/data/images";
import { site, canonicalBase } from "@/data/site";

export const metadata = {
  title: "Accommodation",
  description:
    "Rooms, private cottages, swimming pool, bonfire and gaming room at Anantam Resort in Shamshabad, Hyderabad.",
  alternates: {
    canonical: `${canonicalBase}/accommodation`,
  },
  openGraph: {
    title: "Accommodation | Anantam",
    description:
      "Rooms, private cottages, swimming pool, bonfire and gaming room at Anantam Resort in Shamshabad, Hyderabad.",
    url: `${canonicalBase}/accommodation`,
  },
};

export default function AccommodationPage() {
  return (
    <>
      <PageHero
        image={images.accommodation}
        label="Accommodation"
        titleLines={["A place to", "call your own."]}
        subtitle="Rooms and private cottages, with a resort pool, bonfire evenings and a gaming room for unhurried days."
      />

      <section className="section-pad bg-ivory py-20 lg:py-28">
        <div className="container-luxury max-w-3xl">
          <FadeIn>
            <SectionLabel>Stay</SectionLabel>
            <p className="font-serif text-2xl font-light leading-relaxed tracking-wide text-gold sm:text-3xl">
              Anantam offers stays shaped around rest — soft light, quiet
              interiors, a calm swimming pool and evenings by the fire.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad bg-cream py-16 lg:py-24">
        <div className="container-luxury space-y-20 lg:space-y-28">
          {site.accommodationCategories.map((category, index) => {
            const reverse = index % 2 === 1;
            const slides = category.slidesKey
              ? images[category.slidesKey]
              : null;
            const single = images[category.imageKey];

            return (
              <div
                key={category.slug}
                id={category.slug}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <FadeIn>
                  <div className="relative aspect-[3/2] overflow-hidden bg-ivory">
                    {slides?.length ? (
                      <MediaSlider
                        slides={slides}
                        alt={category.name}
                        interval={5000}
                        fit="cover"
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <Image
                        src={single}
                        alt={category.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                        className="object-cover object-center"
                      />
                    )}
                  </div>
                </FadeIn>

                <FadeIn delay={80}>
                  <p className="label-caps mb-4 text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="editorial-heading">
                    {category.name}
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                    {category.description}
                  </p>
                  <ul className="mt-8 max-w-xl space-y-3">
                    {category.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="border-b border-forest-deep/10 pb-3 text-sm tracking-wide text-charcoal"
                      >
                        {amenity}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <PrimaryButton href="/contact#enquiry">
                      Enquire to Stay
                    </PrimaryButton>
                  </div>
                </FadeIn>
              </div>
            );
          })}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
