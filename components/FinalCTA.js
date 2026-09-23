import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import FadeIn from "./FadeIn";
import { images } from "@/data/images";

export default function FinalCTA() {
  return (
    <section className="relative min-h-[55vh] overflow-hidden">
      <Image
        src={images.cta}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/55" />

      <div className="relative z-10 flex min-h-[55vh] items-center justify-center section-pad py-20 text-center">
        <FadeIn>
          <h2 className="editorial-heading text-4xl text-gold sm:text-5xl">
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
