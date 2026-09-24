import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.anantamresort.com"),
  title: {
    default: "Anantam | Luxury Resort & Wedding Venue in Hyderabad",
    template: "%s | Anantam",
  },
  description:
    "Anantam is a luxury resort and celebration destination in Shamshabad, Hyderabad, offering elegant stays, dining and event experiences.",
  applicationName: "Anantam",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anantam",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Anantam Resort",
    title: "Anantam | Luxury Resort & Wedding Venue in Hyderabad",
    description:
      "Anantam is a luxury resort and celebration destination in Shamshabad, Hyderabad, offering elegant stays, dining and event experiences.",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
