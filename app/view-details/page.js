import SectionLabel from "@/components/SectionLabel";
import EnquiriesViewer from "@/components/EnquiriesViewer";
import FadeIn from "@/components/FadeIn";
import { canonicalBase } from "@/data/site";

export const metadata = {
  title: "View Details",
  description: "Saved enquiry records for Anantam.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${canonicalBase}/view-details`,
  },
};

export default function ViewDetailsPage() {
  return (
    <section className="section-pad bg-ivory pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="container-luxury">
        <FadeIn>
          <SectionLabel>Admin</SectionLabel>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl">
            View Details
          </h1>
        </FadeIn>

        <div className="mt-12 lg:mt-16">
          <EnquiriesViewer />
        </div>
      </div>
    </section>
  );
}
