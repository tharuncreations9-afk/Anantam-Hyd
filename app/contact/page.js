import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import ContactHashScroll from "@/components/ContactHashScroll";
import { images } from "@/data/images";
import { site, canonicalBase } from "@/data/site";

export const metadata = {
  title: "Contact Us",
  description:
    "Enquire about stays, dining and celebrations at Anantam, Madanpalle, Hyderabad.",
  alternates: {
    canonical: `${canonicalBase}/contact`,
  },
  openGraph: {
    title: "Contact | Anantam",
    description:
      "Plan your stay or celebration at Anantam in Madanpalle, Hyderabad.",
    url: `${canonicalBase}/contact`,
  },
};

export default function ContactPage() {
  const phoneHref = `tel:+91${site.contact.phone}`;
  const emailHref = `mailto:${site.contact.email}`;

  return (
    <>
      <ContactHashScroll />
      <PageHero
        image={images.contact}
        label="Contact"
        titleLines={["Let's plan", "your Anantam."]}
        subtitle="Share a few details about your stay or celebration. Our team will follow up to help shape the experience."
        compact
      />

      <section className="section-pad bg-ivory py-20 lg:py-28">
        <div className="container-luxury grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <FadeIn>
            <SectionLabel>Reach Us</SectionLabel>
            <h2 className="editorial-heading text-balance">
              Begin with a conversation.
            </h2>

            <div className="mt-10 overflow-hidden border border-forest-deep/10 bg-cream">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
                <iframe
                  title="Anantam location map"
                  src={site.location.mapsEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="border-t border-forest-deep/10 px-5 py-4 sm:px-6">
                <a
                  href={site.location.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps text-gold transition-colors hover:text-gold-deep"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="mt-10 space-y-8">
              <div>
                <p className="label-caps mb-3 text-gold">Address</p>
                <p className="text-base leading-relaxed text-charcoal">
                  {site.location.line1}
                </p>
                <p className="mt-1 text-base leading-relaxed text-charcoal">
                  {site.location.line2}
                </p>
                <p className="mt-2 text-sm text-muted">{site.location.plusCode}</p>
              </div>

              <div>
                <p className="label-caps mb-3 text-gold">Mobile</p>
                <a
                  href={phoneHref}
                  className="text-base tracking-wide text-charcoal transition-colors hover:text-gold"
                >
                  {site.contact.phoneDisplay}
                </a>
              </div>

              <div>
                <p className="label-caps mb-3 text-gold">Email</p>
                <a
                  href={emailHref}
                  className="text-base tracking-wide text-charcoal transition-colors hover:text-gold"
                >
                  {site.contact.email}
                </a>
              </div>

              <div>
                <p className="label-caps mb-3 text-gold">Enquiries</p>
                <p className="text-sm leading-relaxed text-muted">
                  Ideal for stays, dining reservations, destination weddings and
                  private celebrations. Share preferred dates and guest numbers
                  where possible.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div
              id="enquiry"
              className="scroll-mt-32 bg-cream px-6 py-10 sm:px-10 lg:px-12"
            >
              <SectionLabel>Enquiry Form</SectionLabel>
              <h3 className="mb-10 font-serif text-3xl font-light tracking-wide text-gold">
                Tell us about your plans
              </h3>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
