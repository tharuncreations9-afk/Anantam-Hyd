import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import FadeIn from "@/components/FadeIn";
import { images } from "@/data/images";
import { canonicalBase } from "@/data/site";

export const metadata = {
  title: "Gallery",
  description:
    "Explore the visual world of Anantam Resort — stays, dining, lawns, pool and celebration spaces in Shamshabad, Hyderabad.",
  alternates: {
    canonical: `${canonicalBase}/gallery`,
  },
  openGraph: {
    title: "Gallery | Anantam",
    description:
      "A visual journey through Anantam Resort in Shamshabad, Hyderabad.",
    url: `${canonicalBase}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        image={images.garden}
        label="Gallery"
        titleLines={["Seen in", "stillness."]}
        subtitle="A collection of moments across the resort — architecture, water, gardens, stays and celebration light."
        compact
      />

      <section className="section-pad bg-ivory py-16 lg:py-24">
        <div className="container-luxury">
          <FadeIn>
            <GalleryGrid />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
