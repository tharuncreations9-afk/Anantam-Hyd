import HomePageContent from "@/components/HomePageContent";
import { canonicalBase } from "@/data/site";

export const metadata = {
  title: "Anantam | Luxury Resort & Wedding Venue in Hyderabad",
  description:
    "Anantam is a luxury resort and celebration destination in Shamshabad, Hyderabad — luxury spaces, lawns and stays.",
  alternates: {
    canonical: canonicalBase,
  },
  openGraph: {
    title: "Anantam | Luxury Resort & Wedding Venue in Hyderabad",
    description:
      "Anantam is a luxury resort and celebration destination in Shamshabad, Hyderabad — luxury spaces, lawns and stays.",
    url: canonicalBase,
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
