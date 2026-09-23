import Image from "next/image";
import Link from "next/link";

/**
 * Official Anantam logo artwork only — name + tagline come from the logo file.
 * nav   — compact full lockup for navbar (top left)
 * full  — larger lockup when needed
 * mark  — emblem only
 */
export default function BrandLogo({
  variant = "nav",
  href = "/",
  className = "",
  markClassName = "",
  priority = false,
  asLink = true,
}) {
  if (variant === "mark") {
    const mark = (
      <Image
        src="/logo-mark.png"
        alt=""
        width={80}
        height={80}
        priority={priority}
        className={`h-10 w-10 object-contain sm:h-12 sm:w-12 ${markClassName}`}
      />
    );
    const node = (
      <span className={`inline-flex items-center ${className}`}>{mark}</span>
    );
    if (!asLink) return node;
    return (
      <Link href={href} className="inline-flex" aria-label="Anantam home">
        {node}
      </Link>
    );
  }

  const sizes =
    variant === "full"
      ? {
          src: "/logo-full.png",
          width: 320,
          height: 320,
          className: `h-auto w-full max-w-[240px] object-contain sm:max-w-[300px] ${className}`,
        }
      : {
          src: "/logo-nav.png",
          width: 280,
          height: 320,
          className: `h-[4.25rem] w-auto max-w-[9.5rem] object-contain object-left sm:h-[4.75rem] sm:max-w-[11rem] lg:h-[5.25rem] lg:max-w-[12.5rem] ${className}`,
        };

  const image = (
    <Image
      src={sizes.src}
      alt="Anantam — Luxury Spaces · Lawns · Stays"
      width={sizes.width}
      height={sizes.height}
      priority={priority}
      className={sizes.className}
    />
  );

  if (!asLink) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label="Anantam home"
    >
      {image}
    </Link>
  );
}
