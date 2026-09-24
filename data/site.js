export const site = {
  name: "Anantam",
  fullName: "Anantam Resort",
  tagline: "A quiet escape, just beyond the city.",
  location: {
    area: "Madanpalle",
    city: "Hyderabad",
    display: "Madanpalle, Hyderabad",
    line1: "Next to Shani Temple",
    line2: "Madanpalle, Hyderabad, Telangana 509325",
    plusCode: "682G+MJ Hyderabad, Telangana",
    fullAddress:
      "Next to Shani Temple, Madanpalle, Hyderabad, Telangana 509325",
    mapsQuery: "ANANTAM Madanpalle Hyderabad",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=ANANTAM+Madanpalle+Hyderabad+Telangana+509325&z=15&output=embed",
    mapsLink:
      "https://www.google.com/maps/search/?api=1&query=ANANTAM+Madanpalle+Hyderabad+Telangana+509325",
  },
  contact: {
    phone: "9848000416",
    phoneDisplay: "+91 98480 00416",
    email: "info@anantam.co.in",
  },
  social: {
    instagram: "https://www.instagram.com/anantamhyd/",
    whatsapp: "https://wa.me/919848000416",
    facebook: null,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Accommodation", href: "/accommodation" },
    { label: "Dining", href: "/dining" },
    { label: "Banquet & Lawns", href: "/banquet-lawns" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  taglineBrand: "Luxury Spaces · Lawns · Stays",
  experiences: [
    {
      id: "01",
      title: "Stay",
      description:
        "Thoughtfully designed spaces created for slow mornings and quiet evenings.",
      href: "/accommodation",
      imageKey: "stay",
    },
    {
      id: "02",
      title: "Dine",
      description:
        "Curated meals and gatherings shaped around warmth, flavour and unhurried hospitality.",
      href: "/dining",
      imageKey: "dine",
    },
    {
      id: "03",
      title: "Celebrate",
      description:
        "Lawns, open skies and intimate settings for weddings and meaningful celebrations.",
      href: "/banquet-lawns",
      imageKey: "celebrate",
    },
    {
      id: "04",
      title: "Unwind",
      description:
        "Still water, green spaces and quiet corners made for rest between the moments.",
      href: "/gallery",
      imageKey: "unwind",
    },
  ],
  facilities: [
    "Infinity Pool",
    "Gaming Room",
    "Landscaped Lawns",
    "Bonfire",
    "Koi Pond",
    "Waterfall",
    "Children's Play Area",
    "Private Spaces",
    "Event Areas",
  ],
  accommodationCategories: [
    {
      slug: "rooms",
      name: "Rooms",
      description:
        "Calm, comfortable rooms designed for restful stays — soft light, quiet finishes and space to settle in.",
      amenities: ["Comfortable bedding", "Private washroom", "Climate control", "Thoughtful interiors"],
      imageKey: "room",
    },
    {
      slug: "private-cottages",
      name: "Private Cottages",
      description:
        "Secluded cottage stays for guests who prefer privacy, open air and a more intimate resort rhythm.",
      amenities: ["Private setting", "Spacious layout", "Resort access", "Quiet surroundings"],
      imageKey: "cottage",
      slidesKey: "cottageSlides",
    },
    {
      slug: "swimming-pool",
      name: "Swimming Pool",
      description:
        "A calm resort pool for unhurried afternoons — still water, easy lounging and soft open-air light.",
      amenities: ["Pool deck", "Lounge seating", "Open-air setting", "Resort access"],
      imageKey: "pool",
      slidesKey: "poolSlides",
    },
    {
      slug: "bonfire",
      name: "Bonfire",
      description:
        "Evenings around the fire — warm light, open air and conversation under the night sky.",
      amenities: ["Stone fire pit", "Circle seating", "Night ambience", "Garden setting"],
      imageKey: "bonfire",
      slidesKey: "bonfireSlides",
    },
    {
      slug: "gaming-room",
      name: "Gaming Room",
      description:
        "Foosball, billiards and easy lounge seating — an indoor leisure room made for unhurried evenings together.",
      amenities: ["Foosball", "Billiards", "Lounge seating", "Garden views"],
      imageKey: "gamingRoom",
    },
  ],
};

export const canonicalBase = "https://www.anantamresort.com";
