/**
 * Placeholder mark for MOTION.
 *
 * Swap the <path>/<circle> geometry below for the real logo when it exists —
 * keep the `className` prop and `fill="currentColor"` so callers can keep
 * colouring it with a Tailwind text-* class.
 */
export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M3 12h18" opacity="0.45" />
    </svg>
  );
}
