import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import FadeIn from "./FadeIn";
import { images } from "@/data/images";

export default function FinalCTA() {
  return (
    <section className="relative aspect-[3/2] overflow-hidden bg-forest-deep sm:aspect-auto sm:min-h-[55vh]">
      <Image
        src={images.cta}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        className="object-contain object-center sm:object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/55" />

      <div className="relative z-10 flex h-full min-h-0 items-center justify-center section-pad py-12 text-center sm:min-h-[55vh] sm:py-20">
        <FadeIn>
          <h2 className="editorial-heading text-[1.85rem] leading-[1.1] text-gold sm:text-4xl md:text-5xl">
            <span className="block">Your escape</span>
            <span className="block">begins here.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <PrimaryButton href="/contact#enquiry" variant="solidLight">
              Book Your Stay
            </PrimaryButton>
            <PrimaryButton href="/contact#enquiry" variant="outlineLight">
              Make an Enquiry
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
