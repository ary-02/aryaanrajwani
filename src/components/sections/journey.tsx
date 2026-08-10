import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Section, { Reveal } from "@/components/section";
import { ProgressiveBlur } from "@/components/blocks/progressive-blur";
import AutoScroller from "@/components/auto-scroller";
import DocumentPreview, {
  type EntryDocument,
} from "@/components/document-preview";
import PhotoCarousel, { type Photo } from "@/components/photo-carousel";
import WorkSamples, { type EntryWork } from "@/components/work-samples";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogImage,
  MorphingDialogClose,
} from "@/components/blocks/morphing-dialog";

/**
 * A labelled block inside a dialog. `chips` suits short labels that scan as a
 * set; `list` suits phrases long enough to carry their own dates.
 */
interface EntryGroup {
  label: string;
  items: string[];
  as?: "chips" | "list";
}

interface Entry {
  period: string;
  title: string;
  org: string;
  /**
   * Path to the organisation's logo, served from `public/` — e.g.
   * "/logos/acme.svg". See docs/logos.md. Omit it and the card falls
   * back to a monogram of the primary line's initial.
   */
  logo?: string;
  /**
   * One-line summary shown in the dialog, above `details`. Empty on every entry
   * today: the card face deliberately carries only period/title/org, and the
   * long-form writing is done by hand. Renders nothing while blank.
   */
  blurb: string;
  tags: string[];
  /**
   * Paragraphs shown only in the dialog — the point of the site, and where each
   * role and project gets expanded. Omitted until written.
   */
  details?: string[];
  /**
   * Headline figures, e.g. a GPA or a selection ratio. Given their own blocks
   * because a number buried in a sentence stops being a number a recruiter can
   * scan for. Keep it to two — a row of them stops reading as a highlight.
   */
  stats?: { label: string; value: string }[];
  /** Photographs, shown as a swipeable strip above the body. */
  gallery?: Photo[];
  /** Labelled groups in the dialog — coursework, awards, and the like. */
  groups?: EntryGroup[];
  /**
   * Supporting document — a certificate, a piece of competition work — plus the
   * link that backs it up. Loads only when the dialog opens, since the dialog
   * body is mounted on demand, so these cost nothing on first paint.
   */
  document?: EntryDocument;
  /**
   * Several pieces of work, each with its own heading, snippet and open/download
   * actions. `document` is the single-artefact shorthand; reach for this when an
   * entry has a body of work to show rather than one certificate.
   */
  works?: EntryWork[];
  /**
   * Outbound links shown above the document — the source a piece of work
   * responds to, rather than the work itself.
   */
  links?: { label: string; href: string }[];
  /**
   * Small print under the dialog body. Rights notices and similar: the kind of
   * line that has to be present but must not compete with the content.
   */
  note?: string;
}

// Roles, titles and dates transcribed from the August 2026 resume.
// Ordered most-recent-first by start date, matching the resume.
// Blurbs and dialog details are intentionally empty — the dialog is where
// the real elaboration goes, and it is being written by hand.
const WORK_EXPERIENCE: Entry[] = [
  {
    // Incoming: the role has not started, so no "— Present" and no work to show.
    period: "From September 2026",
    title: "Investment Associate",
    org: "Venture Grade",
    logo: "/logos/work-exp/venture-grade.jpeg",
    blurb: "",
    links: [
      {
        label: "Venture Grade at the Sobey School of Business",
        href: "https://www.smu.ca/sobey/venturegrade/",
      },
    ],
    groups: [
      {
        label: "Role",
        as: "list",
        items: [
          "Source investment opportunities and take them through due diligence",
          "Put investment and risk-capital training into practice on live deals",
          "Raise donations toward an evergreen fund, run by the students themselves",
        ],
      },
    ],
    tags: [],
  },
  {
    period: "January 2026 — April 2026",
    title: "Accounting Intern (Co-op)",
    org: "Doane Grant Thornton",
    logo: "/logos/work-exp/grant-thornton.jpeg",
    blurb: "",
    links: [
      { label: "doanegrantthornton.ca", href: "https://www.doanegrantthornton.ca/" },
    ],
    gallery: [
      {
        src: "/logos/work-exp/dgt/dgt-2026-co-op-team.jpeg",
        alt: "The Doane Grant Thornton co-op cohort at the firm's office",
      },
    ],
    groups: [
      {
        label: "Role",
        as: "list",
        items: [
          "Planned and executed review and compilation engagements, including the drafting of financial statements",
          "Performed bookkeeping and financial analysis, and supported payroll and HST calculations",
          "Completed personal and corporate tax returns for clients across a range of industries and sectors",
          "Worked directly with clients in a growing advisory practice",
        ],
      },
    ],
    tags: [],
  },
  {
    period: "September 2025 — Present",
    title: "Fund Manager & Ex-Equity Research Associate, Technology & Telecom",
    org: "IMPACT Investment Fund",
    logo: "/logos/work-exp/impact-investment-fund.jpeg",
    blurb: "",
    gallery: [
      {
        src: "/logos/work-exp/impact/impact-2025-hockey-hall-of-fame.jpg",
        alt: "The IMPACT Investment Fund team on an industry trip to Toronto",
      },
      {
        src: "/logos/work-exp/impact/impact-2025-fund-managers.jpg",
        alt: "The IMPACT Investment Fund management team",
      },
      {
        src: "/logos/work-exp/impact/impact-2025-team-dinner.jpeg",
        alt: "The IMPACT Investment Fund team at a team dinner",
      },
    ],
    stats: [
      { label: "Assets under management", value: "$900,000" },
      { label: "Fund managers", value: "1 of 12" },
    ],
    groups: [
      {
        label: "Role",
        as: "list",
        items: [
          "Investment, revaluation and compliance decisions across the technology and telecom sector",
          "Set sector weights and review the investment proposals put forward by the associates",
          "Report to the fund's board of directors, under two academic and fund advisors",
        ],
      },
    ],
    works: [
      {
        title: "Valuation model — ServiceNow (NOW)",
        meta: "Three-statement model, DCF and trading comparables across nine linked sheets. Inspired by a Training The Street template.",
        files: [
          {
            label: "ServiceNow model — XLSX",
            href: "/logos/work-exp/impact/servicenow-model.xlsx",
            viewer: "office",
          },
        ],
        note: "Initiating coverage not published due to possible copyright infringement.",
      },
      {
        title: "Economic forecast — Africa & Australia",
        meta: "Co-authored with a fellow associate; the Africa half is Aryaan's.",
        document: {
          src: "/logos/work-exp/impact/economic-forecast-snippet.png",
          alt: "First page of the IMPACT economic forecast on Africa and Australia",
          href: "/logos/work-exp/impact/economic-forecast-africa-australia.pdf",
          label: "View in browser",
        },
      },
    ],
    tags: ["Bloomberg", "Capital IQ", "PitchBook"],
  },
  {
    period: "February 2025 — July 2025",
    title: "Accounting Intern (Part-time + Co-op)",
    org: "G&R CPA",
    logo: "/logos/work-exp/gr-cpa.png",
    blurb: "",
    links: [{ label: "grcpa.ca", href: "https://grcpa.ca/" }],
    groups: [
      {
        label: "Role",
        as: "list",
        items: [
          "Prepared and compiled financial statements and tax returns for small business and individual entrepreneur clients",
          "Applied CRA compliance requirements and assurance procedures throughout each engagement",
          "Supported the review of client tax positions and maintained engagement documentation",
          "Prepared final tax deliverables for review and filing",
        ],
      },
    ],
    tags: [],
  },
];

// Three projects, confirmed. Logos beyond Portfolio still to come — the rest
// fall back to a monogram until files land in public/logos/projects.
const PROJECTS: Entry[] = [
  {
    // TODO: the resume gives no date for either project.
    period: "TODO — year",
    title: "Claude Coded Portfolio Tracker",
    org: "Self-directed",
    logo: "/logos/projects/portfolio.png",
    blurb: "",
    tags: [],
  },
  {
    period: "In progress",
    title: "Claude Automated Discounted Cash Flow Model",
    org: "Self-directed",
    blurb: "",
    tags: ["Beta"],
  },
  {
    period: "In progress",
    title: "MOTION",
    org: "This website",
    blurb: "",
    tags: ["React", "TypeScript", "Tailwind"],
  },
];

// Issuers are read off the supplied logos. These cards lead with `title`, so
// that holds the certification and `org` the issuing body.
// Names and dates read off the certificates themselves, which outrank the
// resume where the two disagree. Snippets live in public/logos/certfi/snippets.
const CERTIFICATIONS: Entry[] = [
  {
    period: "2025",
    title: "Bloomberg Market Concepts",
    org: "Bloomberg",
    logo: "/logos/certfi/bloomberg.jpeg",
    document: {
      src: "/logos/certfi/snippets/bloomberg-market-concepts.png",
      alt: "Bloomberg Market Concepts certificate of completion awarded to Aryaan Rajwani",
      href: "https://portal.bloombergforeducation.com/certificates/Te9ECdGBgTBBzpSoZsuYbG8L",
    },
    blurb: "",
    tags: [],
  },
  {
    // Titled as printed on the certificate. The resume shortens this to
    // "Financial Modelling & Corporate Valuations"; granted 27 October 2025.
    period: "2025",
    title: "Financial Modeling Fundamentals and Corporate Valuation",
    org: "Training The Street",
    logo: "/logos/certfi/training-the-street.jpeg",
    document: {
      src: "/logos/certfi/snippets/financial-modeling-fundamentals.png",
      alt: "Training The Street certificate of completion for Financial Modeling Fundamentals and Corporate Valuation",
      href: "https://app.diplomasafe.com/en-US/certificates/d6c921c0ed2f5ee6affd2940efa5f14a57e54c16f",
    },
    blurb: "",
    tags: [],
  },
  {
    // Verified: skilljar records "Claude Code in Action", completed 27 June 2026.
    period: "2026",
    title: "Claude Code in Action",
    org: "Anthropic",
    logo: "/logos/certfi/anthropic.png",
    document: {
      src: "/logos/certfi/snippets/claude-code-in-action.png",
      alt: "Anthropic certificate of completion for Claude Code in Action",
      href: "https://verify.skilljar.com/c/rj2k72t8porn",
    },
    blurb: "",
    tags: [],
  },
  {
    // Verified: skilljar records "Claude Code 101", completed 25 June 2026.
    period: "2026",
    title: "Claude Code 101",
    org: "Anthropic",
    logo: "/logos/certfi/anthropic.png",
    document: {
      src: "/logos/certfi/snippets/claude-code-101.png",
      alt: "Anthropic certificate of completion for Claude Code 101",
      href: "https://verify.skilljar.com/c/2euui9hdn2qq",
    },
    blurb: "",
    tags: [],
  },
];

// Programme and dates from the August 2026 resume. Single entry by design — it renders as a
// full-width card below the other blocks and does not scroll.
const EDUCATION: Entry[] = [
  {
    period: "September 2023 — Present",
    title: "BCom, Accounting & Finance (Co-op)",
    org: "Sobey School of Business, Saint Mary's University",
    logo: "/logos/education/smu.png",
    blurb: "",
    stats: [{ label: "Cumulative GPA", value: "4.05 / 4.3" }],
    groups: [
      {
        label: "Relevant coursework",
        items: [
          "Financial & Managerial Accounting",
          "Statistics",
          "Econometrics",
          "Finance",
          "Business Analytics",
          "Marketing",
        ],
      },
      {
        label: "Awards",
        as: "list",
        items: [
          "Samuel & Anneliese Jopling Scholarship 2026-27",
          "$4,000 Renewable International Scholarship Recipient",
          "Dean’s List 2024-2027",
        ],
      },
    ],
    tags: [],
  },
];

// Names are read off the supplied logos. These cards lead with `title`, so that
// holds the competition and `org` holds the placement or result.
// Names, results and dates from the August 2026 resume.
const COMPETITIONS: Entry[] = [
  {
    // Named "Challenge", not "Competition" — that is what McGill Desautels and
    // mipc.ca call it. The resume says "Competition" and wants correcting too.
    period: "2025",
    title: "McGill International Portfolio Challenge",
    org: "Participant",
    logo: "/logos/comp/mipc.png",
    blurb: "",
    // The case is McGill's, so it is linked rather than reproduced. What is
    // hosted here is the team's own report.
    links: [
      {
        label: "Read the 2025 case on mipc.ca",
        href: "https://mipc.ca/past-challenges/",
      },
    ],
    document: {
      src: "/logos/comp/mipc/mipc-2025-team-report.png",
      alt: "First page of the team report submitted to the 2025 McGill International Portfolio Challenge",
      href: "/logos/comp/mipc/mipc2025reportpdf.pdf",
      label: "View in browser",
    },
    stats: [
      {
        label: "Equities, reallocated to real assets and fixed income",
        value: "−600 bps",
      },
    ],
    groups: [
      {
        label: "The 2025 case",
        as: "list",
        items: [
          "Finland is 75% forest — 23 million hectares — and had reached an ecological inflection point",
          "Design a sovereign wealth fund that turns forest revenue into biodiversity gains without giving up long-term returns",
        ],
      },
      {
        label: "Our answer",
        as: "list",
        items: [
          "Screen on nature first: exclusions, an ESG baseline, then biodiversity impact — financial performance after",
          "Rebuilt the allocation around real assets, public and private credit, fixed income and conservation assets",
          "Phased across three steps, 2025 to 2035",
        ],
      },
    ],
    note: "Team submission. The case itself is © McGill International Portfolio Challenge and is linked, not reproduced.",
    tags: [],
  },
  {
    period: "2025",
    title: "KPMG Ace the Case National Competition",
    org: "Finalist",
    logo: "/logos/comp/kpmg.jpeg",
    blurb: "",
    // The selection ratio is the whole story on this one, so it is pulled out
    // of the prose rather than left buried mid-sentence.
    stats: [{ label: "Finalists from 1,600+ applicants", value: "1 of 35" }],
    groups: [
      {
        label: "What it involved",
        as: "list",
        items: [
          "A real-world consulting problem, taken from framing through to a defended recommendation",
          "Three hours end to end, against a national field",
          "Practical exposure to consulting principles under genuine time pressure",
        ],
      },
    ],
    document: {
      src: "/logos/comp/kpmg/ace-the-case-2025-finalists.jpg",
      alt: "Finalists of the KPMG Ace the Case 2025 national competition",
      // Letterboxed source: cropping from the top would open the card on a
      // black band, so this one crops from the middle.
      position: "center",
    },
    note: "Photograph from the KPMG Ace the Case 2025 national final. Case materials remain © KPMG and are not reproduced here.",
    tags: [],
  },
  {
    // Sits under "& more": a volunteer role rather than a competition.
    period: "2025",
    title: "Global Encounters — Jubilee Games",
    org: "HR Coordinator — Volunteer",
    logo: "/logos/comp/the-ismaili.jpeg",
    blurb: "",
    gallery: [
      {
        src: "/logos/comp/GE/ge-2025-volunteers.jpeg",
        alt: "Festival volunteers at the Global Encounters Jubilee Games 2025 in Dubai",
      },
      {
        src: "/logos/comp/GE/ge-2025-festival-banner.jpeg",
        alt: "Global Encounters 2025 GE Festival banner at the Dubai venue",
      },
    ],
    stats: [
      { label: "Attendees served", value: "15,000" },
      { label: "Competing athletes", value: "3,000" },
    ],
    groups: [
      {
        label: "The role",
        as: "list",
        items: [
          "Pre-screened volunteer candidates for the Sports Operations team",
          "Selected from applicants worldwide against event needs and role requirements",
        ],
      },
    ],
    tags: [],
  },
];

// TODO: replace with the real toolkit.
const SKILLS = [
  "Skill",
  "Skill",
  "Skill",
  "Skill",
  "Skill",
  "Skill",
  "Skill",
  "Skill",
];

/** Section label inside a dialog — echoes the block headings in the grid. */
const DIALOG_LABEL =
  "text-[0.6875rem] font-normal tracking-[0.14em] text-white/40 uppercase";

const TAG_CLASS =
  "rounded-md border border-white/[0.12] bg-white/[0.05] px-2.5 py-1 text-xs text-white/60";

const LOGO_FRAME =
  "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border";

/**
 * Real logos sit on a light tile: the supplied artwork is dark-on-white, so on
 * the dark card a transparent frame would render a glaring white rectangle.
 * A deliberate light chip reads as intentional instead.
 */
const LOGO_FRAME_IMAGE = "border-white/[0.14] bg-white";
const LOGO_FRAME_MONOGRAM = "border-white/[0.12] bg-white/[0.06]";

/**
 * Organisation logo, or a monogram when there isn't one yet.
 *
 * Rendered via MorphingDialogImage so it animates between the card and the
 * dialog along with the title — a plain <img> would pop instead of morphing.
 * The monogram fallback can't do that (there's no shared image), so it's a
 * static element by necessity.
 */
function EntryLogo({
  entry,
  size,
  label,
  Image,
}: {
  entry: Entry;
  size: string;
  /**
   * The card's primary line — org on work cards, title everywhere else. The
   * monogram takes its letter from this rather than from `org`, which on a
   * project card holds "Self-directed" and would render a meaningless "S".
   */
  label: string;
  Image?: typeof MorphingDialogImage;
}) {
  if (!entry.logo) {
    return (
      <div
        className={`${LOGO_FRAME} ${LOGO_FRAME_MONOGRAM} ${size}`}
        aria-hidden="true"
      >
        <span className="text-sm font-medium text-white/40">
          {label.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  const Img = Image ?? MorphingDialogImage;

  return (
    <div className={`${LOGO_FRAME} ${LOGO_FRAME_IMAGE} ${size}`}>
      <Img
        src={entry.logo}
        // Decorative: the name it represents is rendered right beside it, so
        // announcing it again is redundant. Deriving alt from a field was also
        // wrong — `org` holds the placement on competition cards, which read
        // out as "TODO — placement logo".
        alt=""
        className="h-full w-full object-contain p-1.5"
      />
    </div>
  );
}

/**
 * Card face plus the dialog it morphs into. The card stays deliberately sparse
 * — period, title, org, one line, tags — and everything longer lives in
 * `entry.details`, revealed only on open.
 *
 * MorphingDialogContainer portals to document.body, which is what keeps the
 * dialog from being clipped by the `overflow-hidden` on its EntryBlock.
 */
/**
 * Which of org / title carries the visual weight.
 *
 * Work Experience leads with the organisation — for a role at a known company
 * the employer is the recognisable part. Everywhere else the title leads, since
 * a project or competition name means more than "Self-directed".
 */
type Emphasis = "title" | "org";

function EntryCard({
  entry,
  emphasis = "title",
}: {
  entry: Entry;
  emphasis?: Emphasis;
}) {
  const leadsWithOrg = emphasis === "org";
  const primary = leadsWithOrg ? entry.org : entry.title;
  const secondary = leadsWithOrg ? entry.title : entry.org;
  return (
    // <article> rather than <li>: these render inside InfiniteSlider's plain
    // div as well as inside static lists, and a stray <li> would be invalid there.
    <article>
      <MorphingDialog
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        {/* Card face is period / title / org only. Everything longer lives in
            the dialog — that's the whole point of the morph. */}
        <MorphingDialogTrigger className="block w-full rounded-xl border border-white/[0.10] bg-white/[0.04] p-5 text-left transition-[background-color,border-color] duration-200 hover:border-white/[0.20] hover:bg-white/[0.08]">
          <div className="flex items-start gap-4">
            <EntryLogo entry={entry} size="h-10 w-10" label={primary} />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-normal tracking-wide text-white/45">
                {entry.period}
              </p>

              <MorphingDialogTitle
                className={`mt-1.5 font-medium text-white ${
                  leadsWithOrg ? "text-xl" : "text-lg"
                }`}
              >
                {primary}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="mt-1 text-sm text-orange-400/80">
                {secondary}
              </MorphingDialogSubtitle>
            </div>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="relative w-full max-w-lg rounded-xl border border-white/[0.14] bg-[#1f130b]">
            <div className="max-h-[85vh] overflow-y-auto p-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <EntryLogo entry={entry} size="h-14 w-14" label={primary} />

              <p className="mt-5 text-xs font-normal tracking-wide text-white/45">
                {entry.period}
              </p>

              <MorphingDialogTitle
                className={`mt-1.5 pr-8 font-medium text-white ${
                  leadsWithOrg ? "text-3xl" : "text-2xl"
                }`}
              >
                {primary}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="mt-1 text-sm text-orange-400/80">
                {secondary}
              </MorphingDialogSubtitle>

              {/* Every one of these is optional and most are empty today.
                  They must not render at all when blank, or the dialog carries
                  the margin of prose that isn't there. */}
              {entry.blurb && (
                <p className="mt-5 text-sm leading-[1.7] text-pretty text-white/70">
                  {entry.blurb}
                </p>
              )}

              {entry.details?.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-4 text-sm leading-[1.75] text-pretty text-white/60"
                >
                  {paragraph}
                </p>
              ))}

              {entry.links && entry.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-sm text-orange-400/90 underline-offset-4 transition-colors duration-150 hover:text-orange-300 hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              )}

              {entry.gallery && entry.gallery.length > 0 && (
                <div className="mt-5">
                  <PhotoCarousel photos={entry.gallery} />
                </div>
              )}

              {entry.document && (
                <div className="mt-5">
                  <DocumentPreview doc={entry.document} />
                </div>
              )}

              {entry.stats && entry.stats.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {entry.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex min-w-[8rem] flex-1 flex-col rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3"
                    >
                      <span className="text-2xl font-medium text-white">
                        {stat.value}
                      </span>
                      <span className={`mt-0.5 ${DIALOG_LABEL}`}>
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {entry.groups?.map((group) => (
                <div key={group.label} className="mt-6">
                  <h4 className={DIALOG_LABEL}>{group.label}</h4>

                  {group.as === "list" ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {group.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-sm leading-[1.6] text-white/70"
                        >
                          {/* Own element rather than a list marker: `list-disc`
                              can't be colour-matched to the accent. */}
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/70"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item, i) => (
                        <span key={i} className={TAG_CLASS}>
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* After the groups, deliberately: the work only means something
                  once you know what the role was. */}
              {entry.works && entry.works.length > 0 && (
                <WorkSamples works={entry.works} />
              )}

              {entry.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className={TAG_CLASS}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {entry.note && (
                <p className="mt-6 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-white/35 italic">
                  {entry.note}
                </p>
              )}
            </div>

            <MorphingDialogClose className="top-5 right-5 text-white/50 transition-colors duration-200 hover:text-white" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </article>
  );
}

function EntryList({
  entries,
  emphasis,
}: {
  entries: Entry[];
  emphasis?: Emphasis;
}) {
  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry, i) => (
        <EntryCard key={i} entry={entry} emphasis={emphasis} />
      ))}
    </div>
  );
}

/**
 * Cards on an endless vertical loop that the visitor can also scroll by hand.
 *
 * The drift stops entirely on hover rather than slowing: these cards are dialog
 * triggers, and now that the list is grabbable, whoever is pointing at a card
 * is about to either click it or scroll it. Either way they want it to hold
 * still. AutoScroller resumes the moment the pointer leaves.
 */
function LoopingEntries({
  entries,
  emphasis,
}: {
  entries: Entry[];
  emphasis?: Emphasis;
}) {
  return (
    <AutoScroller speed={22} className="p-4">
      {entries.map((entry, i) => (
        <EntryCard key={i} entry={entry} emphasis={emphasis} />
      ))}
    </AutoScroller>
  );
}

/**
 * Labelled block of entries.
 *
 * When `scrollable`, the content sits in a scroller with the fade pinned to its
 * bottom edge. The blur is absolutely positioned, so it must be a SIBLING of the
 * scrolling element inside a shared `relative` parent — nest it inside the
 * scroller and it scrolls away with the content.
 *
 * When not scrollable, the block grows to fit and takes no blur. Either way
 * `h-full` on the wrapper lets the grid stretch it to match its row sibling.
 */
function EntryBlock({
  label,
  scrollable = true,
  minHeight = "min-h-[440px]",
  blurHeight = "40%",
  children,
}: {
  label: string;
  scrollable?: boolean;
  minHeight?: string;
  /** Shorter blocks need a shallower fade, or it swallows the visible card. */
  blurHeight?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-sm font-normal tracking-[0.14em] text-white/40 uppercase">
        {label}
      </h3>

      {/*
        The scroller is `absolute inset-0`, so it fills the block without
        contributing any intrinsic height. That's what lets a scrollable block
        take its height from a non-scrollable sibling in the same grid row
        (Education sets the height, Competitions fills it). When every block in
        a row scrolls, nothing has intrinsic height and `minHeight` is the floor
        that gives the row its size.
      */}
      <div
        className={`relative flex-1 ${minHeight} overflow-hidden rounded-xl border border-white/[0.12]`}
      >
        {scrollable ? (
          <>
            <div className="absolute inset-0">{children}</div>

            <ProgressiveBlur position="bottom" height={blurHeight} />
          </>
        ) : (
          <div className="p-4">{children}</div>
        )}
      </div>
    </div>
  );
}

export default function Journey() {
  return (
    <Section
      id="journey"
      eyebrow="Journey"
      title="The opportunities grabbed and given."
      lede={<em>And this is only the beginning</em>}
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal standalone>
          <EntryBlock label="Work Experience">
            <LoopingEntries entries={WORK_EXPERIENCE} emphasis="org" />
          </EntryBlock>
        </Reveal>

        <Reveal standalone>
          <EntryBlock label="Projects">
            <LoopingEntries entries={PROJECTS} />
          </EntryBlock>
        </Reveal>
      </div>

      {/* Second row, mirroring the first. Both blocks loop, so neither has an
          intrinsic height — `minHeight` is what sizes the row, set to one card
          plus the block's padding. */}
      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8">
        <Reveal standalone>
          <EntryBlock
            label="Certifications"
            minHeight="min-h-[278px]"
            blurHeight="26%"
          >
            <LoopingEntries entries={CERTIFICATIONS} />
          </EntryBlock>
        </Reveal>

        <Reveal standalone>
          <EntryBlock
            label="Competitions & More"
            minHeight="min-h-[278px]"
            blurHeight="26%"
          >
            <LoopingEntries entries={COMPETITIONS} />
          </EntryBlock>
        </Reveal>
      </div>

      {/* Education closes the section: one full-width card, no scroll. */}
      <Reveal standalone className="mt-6 lg:mt-8">
        <EntryBlock label="Education" scrollable={false} minHeight="min-h-0">
          <EntryList entries={EDUCATION} />
        </EntryBlock>
      </Reveal>

      {/* Skills */}
      <Reveal className="mt-16">
        <h3 className="text-sm font-normal tracking-[0.14em] text-white/40 uppercase">
          Toolkit
        </h3>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {SKILLS.map((skill, i) => (
            <span
              key={i}
              className="rounded-lg border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-[background-color,border-color] duration-200 hover:border-white/[0.22] hover:bg-white/[0.11]"
            >
              {skill}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
