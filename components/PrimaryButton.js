import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrimaryButton({
  href = "/contact#enquiry",
  children,
  variant = "dark",
  className = "",
  type,
  onClick,
  as = "link",
  disabled = false,
}) {
  const base =
    "group inline-flex items-center gap-3 font-sans text-[0.7rem] uppercase tracking-[0.22em] transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

  const variants = {
    dark: "text-forest-deep hover:text-forest",
    light: "text-ivory hover:text-cream",
    solid:
      "bg-forest-deep px-7 py-3.5 text-ivory hover:bg-forest focus-visible:outline-gold",
    solidLight:
      "bg-ivory/95 px-7 py-3.5 text-forest-deep hover:bg-off-white focus-visible:outline-gold",
    outline:
      "border border-forest-deep/30 px-7 py-3.5 text-forest-deep hover:border-forest-deep hover:bg-forest-deep hover:text-ivory",
    outlineLight:
      "border border-ivory/50 px-7 py-3.5 text-ivory hover:border-ivory hover:bg-ivory/10",
  };

  const content = (
    <>
      <span>{children}</span>
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </>
  );

  const classes = `${base} ${variants[variant] || variants.dark} ${className}`;

  if (as === "button" || type) {
    return (
      <button
        type={type || "button"}
        onClick={onClick}
        disabled={disabled}
        className={`${classes} disabled:pointer-events-none disabled:opacity-50`}
      >
        {content}
      </button>
    );
  }

  const external = typeof href === "string" && href.startsWith("http");

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
