"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { site } from "@/data/site";

function InstagramIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep text-ivory">
      <div className="container-luxury section-pad py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <BrandLogo
              variant="nav"
              className="!h-[5.5rem] !max-w-[13rem] sm:!h-24 sm:!max-w-[14rem] brightness-110"
            />
            <p className="mt-6 text-sm leading-relaxed text-ivory/60">
              A luxury resort and celebration destination in Madanpalle,
              Hyderabad — for stays, dining and moments worth gathering for.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 lg:items-start lg:gap-20">
            <nav aria-label="Footer">
              <p className="label-caps mb-5 text-ivory/40">Explore</p>
              <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm tracking-wide text-ivory/75 transition-colors duration-500 hover:text-ivory"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3">
                {site.social.instagram ? (
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-ivory/70 transition-colors duration-500 hover:text-ivory"
                    aria-label="Anantam Hyd on Instagram"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ivory/20 transition-colors group-hover:border-ivory/50">
                      <InstagramIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm tracking-wide">Anantam Hyd</span>
                  </a>
                ) : null}
                {site.social.whatsapp ? (
                  <a
                    href={site.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-ivory/70 transition-colors duration-500 hover:text-ivory"
                    aria-label={`WhatsApp ${site.contact.phoneDisplay}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ivory/20 transition-colors group-hover:border-ivory/50">
                      <WhatsAppIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm tracking-wide">
                      {site.contact.phoneDisplay}
                    </span>
                  </a>
                ) : null}
              </div>
            </nav>

            <div>
              <p className="label-caps mb-5 text-ivory/40">Visit</p>
              <p className="text-sm leading-relaxed text-ivory/70">
                {site.location.fullAddress}
              </p>
              <p className="mt-3 text-sm text-ivory/70">
                <a
                  href={`tel:+91${site.contact.phone}`}
                  className="transition-colors hover:text-ivory"
                >
                  {site.contact.phoneDisplay}
                </a>
              </p>
              <p className="mt-1 text-sm text-ivory/70">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors hover:text-ivory"
                >
                  {site.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-caps text-ivory/35">© {year} Anantam</p>
        </div>
      </div>
    </footer>
  );
}
