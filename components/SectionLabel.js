export default function SectionLabel({ children, className = "", light = false }) {
  return (
    <p
      className={`label-caps mb-5 ${light ? "text-ivory/70" : "text-muted"} ${className}`}
    >
      {children}
    </p>
  );
}
