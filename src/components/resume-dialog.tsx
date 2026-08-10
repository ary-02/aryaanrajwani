import { Download, ExternalLink, FileText } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
} from "@/components/blocks/morphing-dialog";
import { ShimmerButton } from "@/components/blocks/shimmer-button";
import PdfPage from "@/components/pdf-page";

/**
 * TODO: replace public/resume.pdf with the real file — this is a placeholder.
 *
 * One file, and only one. The preview below is drawn from this same PDF, so
 * dropping a new one in updates the dialog and the download together. Nothing
 * to regenerate.
 */
const RESUME_URL = "/resume.pdf";

const ACTION_BASE =
  "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97]";

/**
 * Resume button that morphs open into a PDF preview.
 *
 * Uses the same MorphingDialog as the Journey cards so the interaction reads as
 * one system. `#toolbar=0&navpanes=0` hides the browser viewer's own chrome so
 * the embed looks like a snippet rather than a nested application — the two
 * explicit actions below it do that job instead.
 */
export default function ResumeDialog() {
  return (
    <MorphingDialog transition={{ type: "spring", stiffness: 200, damping: 24 }}>
      {/* The trigger stays the interactive element — it owns the click, the
          keyboard handling, the aria wiring and the layoutId that drives the
          morph. ShimmerButton renders as a span inside it purely for the look;
          nesting its default <button> would put a control inside a control. */}
      <MorphingDialogTrigger className="w-fit rounded-full">
        <ShimmerButton
          as="span"
          background="rgba(31,19,11,1)"
          shimmerDuration="3s"
          className="min-h-[44px] gap-2 px-5 py-2.5 text-base font-normal"
        >
          <FileText className="z-10 h-4 w-4 shrink-0" aria-hidden="true" />
          <MorphingDialogTitle className="z-10 text-base font-normal">
            Resume
          </MorphingDialogTitle>
        </ShimmerButton>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="relative flex w-full max-w-2xl flex-col rounded-3xl border border-white/[0.14] bg-[#1f130b]">
          <div className="flex flex-col p-6 sm:p-7">
            <MorphingDialogTitle className="pr-10 text-xl font-medium text-white">
              Resume
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="mt-1 text-sm text-orange-400/80">
              Aryaan Rajwani
            </MorphingDialogSubtitle>

            {/* Preview snippet. Fixed height with the canvas cropped from the
                top, so the panel does not jump as the page finishes rendering
                and so a two-column resume still opens on its masthead. */}
            <div className="relative mt-5 h-[45vh] max-h-[520px] min-h-[280px] overflow-hidden rounded-2xl border border-white/[0.12] bg-white">
              <PdfPage
                src={RESUME_URL}
                alt="First page of Aryaan Rajwani's resume"
              />
              {/* Fades the crop into the panel so the cut reads as a snippet
                  rather than a truncated image. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)",
                }}
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={RESUME_URL}
                download
                className={`${ACTION_BASE} bg-orange-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_2px_8px_rgba(234,88,12,0.35)] hover:bg-orange-500`}
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                Download
              </a>

              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={`${ACTION_BASE} border border-white/20 bg-white/[0.07] text-white/85 hover:border-white/35 hover:bg-white/[0.12] hover:text-white`}
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                View in browser
              </a>
            </div>
          </div>

          <MorphingDialogClose className="top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#1f130b]/85 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
