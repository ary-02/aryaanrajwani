import { ArrowUpRight } from "lucide-react";
import { ProgressiveBlur } from "@/components/blocks/progressive-blur";

export interface EntryDocument {
  /** Snippet image, served from public/. */
  src: string;
  alt: string;
  /** Source or verification page. Omit and it renders as a plain image. */
  href?: string;
  label?: string;
  /**
   * Which part survives the crop when the image is taller than the frame.
   * "top" suits documents, where the heading carries the meaning. "center"
   * suits photographs, and rescues letterboxed source images whose black bands
   * would otherwise be the first thing the card shows.
   */
  position?: "top" | "center";
}

/**
 * Document snippet that reveals its source link under a progressive blur.
 *
 * Used for certificates and for competition work alike, so the label is set per
 * entry rather than baked in.
 *
 * The hover-blur pattern is adapted from Motion-Primitives' `ProgressiveBlurHover`
 * demo, but rebuilt on the Magic UI ProgressiveBlur this project already vendors.
 * The two are different components sharing a name: the demo passes
 * `blurIntensity` / `animate` / `variants` / `transition`, none of which exist on
 * ours (`height` / `position` / `blurLevels`). Vendoring the second one would put
 * two `ProgressiveBlur` imports in the tree, so the reveal is driven from CSS here
 * instead — no component state, and it can key off focus as well as hover.
 *
 * The overlay is permanently visible below `sm`. Touch devices have no hover, so
 * otherwise the only affordance that this image is a link would never appear.
 */
export default function DocumentPreview({
  doc,
}: {
  doc: EntryDocument;
}) {
  const {
    src,
    alt,
    href,
    label = "View credential",
    position = "top",
  } = doc;

  // `group-focus-visible` keeps the reveal reachable by keyboard; the overlays are
  // `pointer-events-none` so they never swallow the click meant for the anchor.
  const reveal =
    "opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100";

  const body = (
    <>
      {/* White plate: certificates are dark-on-white, so a transparent frame
          would render whatever the dialog sits on behind the artwork.

          Height is capped and cropped from the top. Without it a portrait
          snippet pushes the reveal below the dialog's scroll fold, so the
          verification affordance only appears if you scroll for it — and the
          whole point is that it is the first thing you see on hover. */}
      <img
        src={src}
        alt={alt}
        className={`block h-auto max-h-[300px] w-full bg-white object-cover ${
          position === "center" ? "object-center" : "object-top"
        }`}
      />

      {href && (
        <>
          <div className={`pointer-events-none absolute inset-0 ${reveal}`}>
            <ProgressiveBlur position="bottom" height="55%" />
            {/* The blur alone is not enough. Upstream's demo reveals white text
                over a dark painting; a certificate is white paper, so blurring
                it leaves white-on-white and the label vanishes. This scrim is
                what makes the label legible on any artwork.

                z-20/z-30 are load-bearing: ProgressiveBlur's own layer carries
                z-10, so without them the blur paints over the scrim and the
                darkening never reaches the composite. */}
            <div className="absolute inset-x-0 bottom-0 z-20 h-[55%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          </div>

          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-white ${reveal}`}
          >
            {label}
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </div>
        </>
      )}
    </>
  );

  const frame =
    "group relative block overflow-hidden rounded-xl border border-white/[0.12]";

  if (!href) return <div className={frame}>{body}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`${frame} transition-colors duration-200 hover:border-white/[0.25]`}
    >
      {body}
    </a>
  );
}
