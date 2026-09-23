import Image from "next/image";

/**
 * Full-frame resort photo — no crop, no zoom.
 * Renders at natural aspect ratio inside a neat frame.
 */
export default function ResortImage({
  src,
  alt,
  width = 1600,
  height = 1067,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
  frameClassName = "",
}) {
  return (
    <div className={`overflow-hidden bg-cream ${frameClassName}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={`h-auto w-full object-contain ${className}`}
      />
    </div>
  );
}
