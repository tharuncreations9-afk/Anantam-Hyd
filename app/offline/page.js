import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-6 py-24 text-center">
      <BrandLogo variant="mark" asLink={false} />
      <h1 className="mt-8 font-serif text-4xl font-light tracking-wide text-forest-deep sm:text-5xl">
        You&apos;re offline
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Check your connection and try again. Cached pages may still be available.
      </p>
      <Link
        href="/"
        className="mt-10 border border-forest-deep/25 px-8 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-forest-deep transition-colors hover:border-forest-deep hover:bg-forest-deep hover:text-ivory"
      >
        Back to home
      </Link>
    </section>
  );
}
