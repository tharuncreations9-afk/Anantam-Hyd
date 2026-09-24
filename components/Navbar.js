"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import BrandLogo from "./BrandLogo";
import PrimaryButton from "./PrimaryButton";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const lightHero =
    pathname === "/" ||
    pathname === "/accommodation" ||
    pathname === "/dining" ||
    pathname === "/banquet-lawns" ||
    pathname === "/gallery" ||
    pathname === "/contact";

  const solid = scrolled || open || !lightHero;
  const textClass = solid ? "text-forest-deep" : "text-ivory";
  const mutedClass = solid ? "text-muted" : "text-ivory/75";
  const onContact = pathname === "/contact";
  const enquireHref = "/contact#enquiry";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-forest-deep/10 bg-ivory/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-luxury section-pad flex h-[5.25rem] items-center justify-between sm:h-[5.75rem] lg:h-[6.25rem]">
          <BrandLogo variant="nav" priority />

          <nav
            className="hidden items-center gap-7 lg:flex xl:gap-9"
            aria-label="Primary"
          >
            {site.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-sans text-[0.68rem] uppercase tracking-[0.22em] transition-colors duration-500 ${
                    active ? textClass : mutedClass
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={`hidden lg:block ${onContact ? "invisible" : ""}`}>
            {!onContact ? (
              <PrimaryButton
                href={enquireHref}
                variant={solid ? "dark" : "light"}
                className="text-[0.68rem]"
              >
                Enquire Now
              </PrimaryButton>
            ) : null}
          </div>

          <button
            type="button"
            className={`lg:hidden ${textClass}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(165deg, #f7f3eb 0%, #efe8dc 48%, #e8dfd0 100%)",
          transitionProperty: "opacity",
          transitionDuration: "500ms",
          transitionTimingFunction: "ease",
        }}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-8 pb-10 pt-28 sm:px-12">
          <p className="label-caps mb-10 text-gold/70">Menu</p>

          <nav className="flex flex-1 flex-col" aria-label="Mobile">
            {site.nav.map((item, index) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-baseline gap-5 border-b border-forest-deep/10 py-5 ${
                    active ? "text-gold" : "text-forest-deep"
                  }`}
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(12px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "550ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: open ? `${90 + index * 55}ms` : "0ms",
                  }}
                >
                  <span className="font-sans text-[0.65rem] tracking-[0.28em] text-gold/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[2rem] font-light tracking-[0.06em] transition-colors duration-300 group-hover:text-gold sm:text-[2.35rem]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className="mt-auto space-y-5 border-t border-forest-deep/10 pt-8"
            style={{
              opacity: open ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: "600ms",
              transitionTimingFunction: "ease",
              transitionDelay: open ? "320ms" : "0ms",
            }}
          >
            {!onContact ? (
              <PrimaryButton href={enquireHref} variant="solid">
                Enquire Now
              </PrimaryButton>
            ) : null}
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.24em] text-muted">
              {site.location.display}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
