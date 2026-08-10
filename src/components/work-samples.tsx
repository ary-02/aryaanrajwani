import { ArrowUpRight, Download, FileSpreadsheet, FileText } from "lucide-react";
import DocumentPreview, {
  type EntryDocument,
} from "@/components/document-preview";

/**
 * A file offered for download or in-browser viewing.
 *
 * `viewer: "office"` routes the link through Microsoft's Office Web Viewer,
 * which renders a spreadsheet read-only in the browser. There is no way to
 * "view" an .xlsx natively — a browser can only download it — and a downloaded
 * workbook is fully editable on the visitor's machine regardless. What the
 * viewer buys is that the common case (look at it, don't take it) never leaves
 * the browser, and never leaves our copy as the canonical one.
 *
 * Two consequences worth knowing:
 *   - It needs a PUBLICLY REACHABLE url. Microsoft fetches the file server-side,
 *     so this link is dead on localhost and only starts working once deployed.
 *     The Download action beside it always works, which is why both are shown.
 *   - The file is sent to Microsoft to be rendered. Only ever point this at
 *     something already published on the site.
 */
export interface EntryFile {
  label: string;
  /** Path under public/, e.g. "/logos/work-exp/impact/model.xlsx". */
  href: string;
  viewer?: "office";
}

/**
 * One piece of work: a heading, an optional rendered first page, and the ways
 * to actually open it.
 */
export interface EntryWork {
  title: string;
  /** One line of context — what it is, who it was for. */
  meta?: string;
  points?: string[];
  document?: EntryDocument;
  files?: EntryFile[];
  /**
   * Small print under this sample — a rights notice, or why something adjacent
   * to it is absent. Sits below the files so it reads as a footnote to the
   * work rather than as part of the description.
   */
  note?: string;
}

const LINK_CLASS =
  "inline-flex items-center gap-1.5 text-sm text-orange-400/90 underline-offset-4 transition-colors duration-150 hover:text-orange-300 hover:underline";

/**
 * Absolute URL for the current origin, which the Office viewer requires — it
 * fetches the file itself rather than receiving it from the browser.
 */
function officeViewerHref(href: string) {
  const absolute =
    typeof window === "undefined"
      ? href
      : new URL(href, window.location.origin).href;

  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
    absolute,
  )}`;
}

function FileRow({ file }: { file: EntryFile }) {
  const spreadsheet = file.href.endsWith(".xlsx") || file.href.endsWith(".xls");
  const Icon = spreadsheet ? FileSpreadsheet : FileText;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-white/45" aria-hidden="true" />
      <span className="min-w-0 flex-1 text-sm text-white/70">{file.label}</span>

      {file.viewer === "office" && (
        <a
          href={officeViewerHref(file.href)}
          target="_blank"
          rel="noreferrer noopener"
          className={LINK_CLASS}
        >
          View read-only
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      )}

      {/* `download` rather than a plain link: without it the browser navigates
          to the file and, finding nothing it can render, leaves a blank tab. */}
      <a href={file.href} download className={LINK_CLASS}>
        Download
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </a>
    </div>
  );
}

/**
 * Proof-of-work block for a dialog: each sample gets a heading, a first-page
 * snippet where one exists, and its own open/download actions.
 *
 * Ordered by the entry, not by type — the lead piece of work should be the
 * first thing under the fold, whatever format it happens to be in.
 */
export default function WorkSamples({ works }: { works: EntryWork[] }) {
  if (works.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {works.map((work) => (
        <div key={work.title}>
          <h4 className="text-sm font-medium text-white/85">{work.title}</h4>

          {work.meta && (
            <p className="mt-1 text-xs leading-relaxed text-white/40">
              {work.meta}
            </p>
          )}

          {work.points && work.points.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {work.points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-[1.6] text-white/70"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/70"
                  />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {work.document && (
            <div className="mt-3">
              <DocumentPreview doc={work.document} />
            </div>
          )}

          {work.files && work.files.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {work.files.map((file) => (
                <FileRow key={file.href} file={file} />
              ))}
            </div>
          )}

          {work.note && (
            <p className="mt-2.5 text-xs leading-relaxed text-white/35 italic">
              {work.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
