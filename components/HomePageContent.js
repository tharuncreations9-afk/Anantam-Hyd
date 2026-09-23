import Image from "next/image";
import Link from "next/link";
import SectionLabel from "./SectionLabel";
import PrimaryButton from "./PrimaryButton";
import FadeIn from "./FadeIn";
import ResortImage from "./ResortImage";
import { images } from "@/data/images";
import { galleryItems } from "@/data/gallery";

const signature = [
  {
    title: "Stay",
    description:
      "Rooms and private cottages shaped for slow mornings and quiet evenings.",
    image: images.stay,
    href: "/accommodation",
  },
  {
    title: "Dine",
    description:
      "Curated dining and private gatherings set within the calm of the resort.",
    image: images.dine,
    href: "/dining",
  },
  {
    title: "Celebrate",
    description:
      "Lawns and open skies for weddings and moments worth gathering for.",
    image: images.celebrate,
    href: "/contact",
  },
];

const scrollGallery = [
  galleryItems[0],
  galleryItems[12],
  galleryItems[28],
  galleryItems[45],
  galleryItems[62],
  galleryItems[80],
  galleryItems[98],
  galleryItems[120],
  galleryItems[145],
  galleryItems[170],
].filter(Boolean);

export default function HomePageContent() {
  return (
    <>
      {/* HERO — full-bleed background */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={images.hero}
          alt="Anantam Resort, Shamshabad"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-forest-deep/15 to-forest-deep/25" />

        <div className="relative z-10 container-luxury section-pad w-full pb-24 pt-32 sm:pb-28 lg:pb-32">
          <p className="label-caps animate-[fade-up_0.9s_ease_both] text-ivory/70">
            Shamshabad · Hyderabad
          </p>
          <h1 className="editorial-heading mt-5 max-w-4xl animate-[fade-up_0.9s_ease_0.12s_both] text-5xl text-gold sm:text-6xl lg:text-7xl">
            <span className="block">A quiet escape,</span>
            <span className="block">just beyond the city.</span>
          </h1>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="scroll-indicator flex flex-col items-center gap-2 text-ivory/70">
            <span className="label-caps text-[0.58rem]">Scroll</span>
            <span className="h-8 w-px bg-ivory/50" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="section-pad bg-ivory py-24 lg:py-32">
        <div className="container-luxury grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <ResortImage
              src={images.intro}
              alt="Anantam resort interiors and hospitality"
              width={1600}
              height={1067}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </FadeIn>
          <FadeIn delay={100}>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl">
              The Anantam
              <span className="block">philosophy.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Nestled in Shamshabad, Anantam is a quiet landscape for unhurried
              stays, considered dining and celebrations framed by lawns, water
              and open sky.
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Close enough to the city. Far enough to feel away. Every space is
              shaped around presence — soft light, generous grounds and
              hospitality that does not rush the moment.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SIGNATURE — 2nd content section */}
      <section className="section-pad bg-cream py-24 lg:py-32">
        <div className="container-luxury">
          <FadeIn className="mb-14 text-center">
            <SectionLabel className="text-center">Featured</SectionLabel>
            <h2 className="editorial-heading text-4xl sm:text-5xl">
              Signature experiences
            </h2>
            <p className="mt-4 text-sm text-muted sm:text-base">
              Stay, dine and celebrate at Anantam
            </p>
          </FadeIn>

          <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8">
            {signature.map((item, index) => (
              <FadeIn key={item.title} delay={index * 90}>
                <Link href={item.href} className="block">
                  <div className="relative mb-6 aspect-[3/2] overflow-hidden bg-ivory">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                  <h3 className="font-serif text-2xl font-light tracking-[0.12em] uppercase text-gold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="link-underline mt-5 text-[0.68rem] uppercase tracking-[0.22em] text-forest-deep">
                    Explore
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOUSE — 3rd content section */}
      <section className="section-pad bg-ivory py-24 lg:py-32">
        <div className="container-luxury">
          <FadeIn className="mx-auto mb-14 max-w-4xl text-center">
            <SectionLabel className="text-center">Our House</SectionLabel>
            <h2 className="editorial-heading whitespace-nowrap text-[clamp(1.35rem,4.2vw,3.25rem)]">
              Luxury spaces. Lawns. Stays.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              One Place. Many ways to belong here.
            </p>
          </FadeIn>

          <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-12">
            <FadeIn className="text-center md:text-left">
              <p className="label-caps mb-4 text-gold">Spaces &amp; Stays</p>
              <h3 className="font-serif text-3xl font-light tracking-wide text-gold">
                Private retreats
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Rooms and cottages designed for rest — privacy, comfort and the
                soft rhythm of resort living.
              </p>
            </FadeIn>

            <div
              className="mx-auto hidden h-28 w-px bg-forest-deep/15 md:block"
              aria-hidden="true"
            />

            <FadeIn delay={80} className="text-center md:text-right">
              <p className="label-caps mb-4 text-gold">Lawns &amp; Celebrations</p>
              <h3 className="font-serif text-3xl font-light tracking-wide text-gold">
                Open gatherings
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base md:ml-auto md:max-w-md">
                Landscaped lawns and event spaces for destination weddings and
                celebrations near Hyderabad.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP — natural proportions, no crop */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="section-pad container-luxury mb-10 text-center">
          <FadeIn>
            <SectionLabel className="text-center">Browse</SectionLabel>
            <h2 className="editorial-heading text-4xl sm:text-5xl">
              Frames of Anantam
            </h2>
            <p className="mt-4 text-sm text-muted">
              Architecture, lawns, stays and still water
            </p>
          </FadeIn>
        </div>

        <div className="gallery-scroll-wrapper overflow-hidden">
          <div className="gallery-scroll flex w-max items-center gap-4 px-4 sm:gap-5 sm:px-6">
            {/* Second copy is aria-hidden — seamless marquee only, not a second gallery */}
            {[0, 1].map((copy) =>
              scrollGallery.map((item, index) => (
                <div
                  key={`${copy}-${item.id}-${index}`}
                  className="h-56 w-auto shrink-0 bg-ivory sm:h-64 lg:h-72"
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  <Image
                    src={item.thumb || item.image}
                    alt={copy === 0 ? item.title : ""}
                    width={item.width}
                    height={item.height}
                    sizes="400px"
                    className="h-full w-auto max-w-none object-contain"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <PrimaryButton href="/gallery">View Gallery</PrimaryButton>
        </div>
      </section>
    </>
  );
}
