import { useState, type ReactNode } from "react";
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

/**
 * Work Experience is grouped into category blocks rather than listed flat. A
 * union rather than a bare string so a typo fails the typecheck instead of
 * silently dropping the role out of every block.
 */
type WorkCategory = "Accounting" | "Finance" | "Venture Capital";

/**
 * What a certification can hang off. A work category, or the projects as a
 * group — the two Claude certificates fed all three projects rather than any
 * one of them, so they converge on the set instead of branching from a single
 * entry.
 */
type BranchTarget = WorkCategory | "Projects";

interface Entry {
  period: string;
  /**
   * Which category block this role sits under. Work Experience only — projects,
   * certifications and competitions are not grouped.
   */
  category?: WorkCategory;
  /**
   * For a certification: the work category it came out of. Set it and the
   * certification branches off that category's strip instead of sitting in the
   * Certifications block — a credential means more beside the role that earned
   * it than in a row of badges.
   *
   * Unset is the normal case, and those still list in the block below.
   */
  branchOf?: BranchTarget;
  title: string;
  /**
   * Shorter label for the compact branch strips, where the full title would
   * clamp mid-word. The dialog always shows `title` — the official name is what
   * a certificate is verified against, so it must not be the thing we shorten.
   */
  shortTitle?: string;
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
    category: "Venture Capital",
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
    category: "Accounting",
    logo: "/logos/work-exp/grant-thornton.jpeg",
    blurb: "",
    links: [
      {
        label: "doanegrantthornton.ca",
        href: "https://www.doanegrantthornton.ca/",
      },
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
    category: "Finance",
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
    category: "Accounting",
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
    period: "July 2026",
    title: "Claude Coded Portfolio Tracker",
    shortTitle: "Portfolio Tracker",
    // Middots rather than semicolons, matching the Accounting strip's
    // "Doane Grant Thornton · G&R CPA" — the strips all separate this line the
    // same way.
    org: "Personal Project · Claude Coded · Live Demo",
    logo: "/logos/projects/portfolio.png",
    blurb: "",
    tags: [],
  },
  {
    period: "August 2026",
    title: "Claude Automated Discounted Cash Flow Model",
    shortTitle: "Auto DCF Builder",
    org: "Personal Project · Claude Coded · Live",
    blurb: "",
    tags: ["Beta"],
  },
  {
    period: "August 2026",
    title: "Aryaan Rajwani's Website",
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
    branchOf: "Finance",
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
    // Aryaan's own shortening, matching how the resume lists it.
    shortTitle: "Financial Modelling",
    branchOf: "Finance",
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
    branchOf: "Projects",
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
    branchOf: "Projects",
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

/**
 * Work Experience, grouped for display. Order is editorial, not chronological:
 * finance leads because it is the direction Aryaan is heading rather than the
 * one with the most hours behind it, accounting follows as the deeper record,
 * and venture capital closes on the incoming role.
 *
 * Derived from WORK_EXPERIENCE rather than duplicating the entries, so the
 * resume ordering above stays the single source of truth. A role whose
 * `category` is unset appears in no block — the union type on WorkCategory is
 * what stops a typo causing that silently.
 */
/**
 * What the WORK in a category built — not what its certificates taught. These
 * branch off the category panel itself, as siblings of the certifications
 * rather than children of them, because the roles are where they came from.
 *
 * A category with no entry here renders no skills tier.
 */
const CATEGORY_SKILLS: Partial<Record<WorkCategory, string[]>> = {
  Finance: [
    "Forecasting",
    "Analytics",
    "Research",
    "Narration",
    "Portfolio Management",
  ],
  "Venture Capital": ["Cold Outreach", "Investment Risk", "Due Diligence"],
  Accounting: [
    "Client Communication",
    "Compliance",
    "Canadian Tax",
    "Tax Frameworks",
    "Strategy",
    "Procedural Planning",
  ],
};

/**
 * An aside under a category panel. Deliberately quiet — smaller, dimmer and
 * italic — so it reads as a remark rather than as information, which is the
 * only way a joke survives sitting next to a resume.
 */
const CATEGORY_CAPTIONS: Partial<Record<WorkCategory, string>> = {
  Finance: "In my peak finance bro era",
  Accounting:
    "Safe to say that I can debit what comes in and credit what goes out",
};

/**
 * Whether a category has already happened or is still ahead.
 *
 * Venture Grade starts in September 2026, so filing it under "Successful Shots"
 * beside two finished roles would claim a result that has not happened yet.
 * Split out, the same entry reads as intent rather than as an overstatement.
 */
const CATEGORY_STAGE: Record<WorkCategory, "landed" | "aiming"> = {
  Finance: "landed",
  Accounting: "landed",
  "Venture Capital": "aiming",
};

const WORK_CATEGORIES: {
  label: WorkCategory;
  entries: Entry[];
  branches: Entry[];
  skills: string[];
  caption?: string;
  stage: "landed" | "aiming";
}[] = (["Finance", "Accounting", "Venture Capital"] as const).map((label) => ({
  label,
  entries: WORK_EXPERIENCE.filter((entry) => entry.category === label),
  branches: CERTIFICATIONS.filter((entry) => entry.branchOf === label),
  skills: CATEGORY_SKILLS[label] ?? [],
  caption: CATEGORY_CAPTIONS[label],
  stage: CATEGORY_STAGE[label],
}));

const LANDED_CATEGORIES = WORK_CATEGORIES.filter((c) => c.stage === "landed");
const AIMING_CATEGORIES = WORK_CATEGORIES.filter((c) => c.stage === "aiming");

/**
 * The certifications that did NOT branch off a role, and so still need the
 * block below to be seen at all. Derived rather than hand-maintained, so moving
 * a certification onto a category cannot leave it listed in both places.
 */
const UNBRANCHED_CERTIFICATIONS = CERTIFICATIONS.filter(
  (entry) => !entry.branchOf,
);

/** The certifications that converge on the projects rather than on a role. */
const PROJECT_CERTIFICATIONS = CERTIFICATIONS.filter(
  (entry) => entry.branchOf === "Projects",
);

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

/**
 * Non-morphing stand-ins for the dialog's shared-layout elements.
 *
 * MorphingDialogTitle/Subtitle/Image read the dialog's `uniqueId` from context
 * and animate against the card that opened it. Inside a category dialog that
 * card is the CATEGORY, not the role, so using them for a role's title would
 * hand two elements the same layoutId and the morph would tear. These render
 * the same markup with no shared-layout participation.
 */
function PlainTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={className}>{children}</h3>;
}

function PlainSubtitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

function PlainImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} className={className} />;
}

/**
 * Everything inside an entry's dialog, below the panel chrome.
 *
 * Factored out of EntryCard so a category dialog can render the same detail for
 * whichever role is on show without duplicating it. `morph` picks the animating
 * title/logo (a role opened directly from its own card) or the static ones (a
 * role reached through a category block).
 *
 * Deliberately renders no scroll container of its own — each dialog owns its
 * own scrolling, because the category dialog keeps its tab bar outside it.
 */
function EntryDetail({
  entry,
  emphasis = "title",
  morph = false,
}: {
  entry: Entry;
  emphasis?: Emphasis;
  morph?: boolean;
}) {
  const leadsWithOrg = emphasis === "org";
  const primary = leadsWithOrg ? entry.org : entry.title;
  const secondary = leadsWithOrg ? entry.title : entry.org;
  const Title = morph ? MorphingDialogTitle : PlainTitle;
  const Subtitle = morph ? MorphingDialogSubtitle : PlainSubtitle;

  return (
    <>
      <EntryLogo
        entry={entry}
        size="h-14 w-14"
        label={primary}
        Image={morph ? undefined : PlainImage}
      />

      {entry.period && (
        <p className="mt-5 text-xs font-normal tracking-wide text-white/45">
          {entry.period}
        </p>
      )}

      <Title
        className={`mt-1.5 pr-8 font-medium text-white ${
          leadsWithOrg ? "text-3xl" : "text-2xl"
        }`}
      >
        {primary}
      </Title>
      <Subtitle className="mt-1 text-sm text-orange-400/80">
        {secondary}
      </Subtitle>

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
              <span className={`mt-0.5 ${DIALOG_LABEL}`}>{stat.label}</span>
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
    </>
  );
}

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
            <EntryLogo entry={entry} size="h-9 w-9" label={primary} />

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
              <EntryDetail entry={entry} emphasis={emphasis} morph />
            </div>

            {/* The button is pinned to the panel while the body scrolls
                underneath it, so on a narrow screen it ends up sitting on top
                of running text. The tinted disc keeps it legible over whatever
                scrolls past and makes the tap target obvious. */}
            <MorphingDialogClose className="top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#1f130b]/85 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </article>
  );
}

/** Shared with EntryBlock, so a category heading matches every other label. */
const BLOCK_LABEL =
  "mb-4 text-sm font-normal tracking-[0.14em] text-white/40 uppercase";

/**
 * Category panel footprint — the two knobs worth tuning, kept together.
 *
 * `max-w` caps the panel at roughly 40% of the section's own max-w-6xl, so it
 * reads as a deliberate column rather than a full-bleed banner. Below that
 * width the cap does nothing and the panel is simply fluid, which is what
 * keeps it correct on a phone.
 */
const PANEL_WIDTH = "w-full shrink-0 sm:max-w-[29rem]";
/**
 * Applied to the trigger itself, not its contents, so the number is the panel's
 * real height rather than a figure with padding still to be added.
 *
 * A rem floor rather than a vh one: at strip height a viewport-relative value
 * would make the panel a different shape on a laptop than on a monitor for no
 * gain. This just keeps the three even when one carries two logos and the
 * others carry one.
 */
const PANEL_MIN_HEIGHT = "min-h-[6.125rem]";

/**
 * One category of work experience: a tall, full-width panel that opens into the
 * roles it holds.
 *
 * The face carries the category rather than any single employer, which is the
 * point — it stops four roles reading as four disconnected jobs and presents
 * them as three threads. Roles inside are reached by tab rather than by a
 * nested dialog: a dialog opened from inside a dialog has nowhere to morph back
 * to, and stacking two scrim layers traps focus.
 */
function WorkCategoryBlock({
  label,
  entries,
  caption,
}: {
  label: WorkCategory;
  entries: Entry[];
  caption?: string;
}) {
  const [active, setActive] = useState(0);
  // Guards against a category whose roles were all retagged away: without it
  // the dialog would render undefined and take the page down.
  if (entries.length === 0) return null;
  const current = entries[Math.min(active, entries.length - 1)];
  const orgs = entries.map((entry) => entry.org).join("  ·  ");

  return (
    // Reopening a category always starts on its first role. Without this the
    // tab you last looked at is still selected the next time the panel opens,
    // so clicking "Accounting" lands on the second firm with nothing on screen
    // explaining why.
    //
    // Capture phase on the wrapper, which only ever contains the trigger: the
    // dialog — tab bar included — portals to document.body, so a tab click is
    // not a descendant of this element and cannot reset the state it just set.
    <article className={PANEL_WIDTH} onClickCapture={() => setActive(0)}>
      <MorphingDialog
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        <MorphingDialogTrigger
          className={`group block w-full ${PANEL_MIN_HEIGHT} rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3.5 text-left transition-[background-color,border-color] duration-200 hover:border-white/[0.22] hover:bg-white/[0.08] sm:px-6`}
        >
          {/* Reads across rather than down: the category and its firms hold the
              left, the logos and the affordance the right. Stacked, the same
              content needed twice the height for no extra information.

              Below `sm` it does stack — at phone width a row would crush the
              category name to two or three characters per line. */}
          <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0">
              <p className="text-xs font-normal tracking-wide text-white/45">
                {entries.length === 1 ? "1 role" : `${entries.length} roles`}
              </p>

              <MorphingDialogTitle className="mt-1 text-2xl leading-[1.15] font-medium tracking-[-0.02em] text-white">
                {label}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="mt-1 truncate text-sm text-orange-400/80">
                {orgs}
              </MorphingDialogSubtitle>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
              <div className="flex items-center gap-2.5">
                {entries.map((entry, i) => (
                  <EntryLogo
                    key={i}
                    entry={entry}
                    size="h-10 w-10"
                    label={entry.org}
                    Image={PlainImage}
                  />
                ))}
              </div>

              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-white/40 transition-[transform,color] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/85"
                aria-hidden="true"
              />
            </div>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="relative w-full max-w-lg rounded-xl border border-white/[0.14] bg-[#1f130b]">
            <div className="max-h-[85vh] overflow-y-auto p-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <MorphingDialogTitle className="pr-8 text-3xl font-medium tracking-[-0.02em] text-white">
                {label}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="mt-1 text-sm text-orange-400/80">
                {orgs}
              </MorphingDialogSubtitle>

              {/* One role needs no chooser — the tab bar would be a control
                  with nothing to switch between. */}
              {entries.length > 1 && (
                <div
                  role="tablist"
                  aria-label={`${label} roles`}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {entries.map((entry, i) => {
                    const selected = i === active;
                    return (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActive(i)}
                        className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-sm transition-[background-color,border-color,color] duration-200 ${
                          selected
                            ? "border-white/[0.28] bg-white/[0.12] text-white"
                            : "border-white/[0.12] bg-white/[0.04] text-white/60 hover:border-white/[0.22] hover:text-white/85"
                        }`}
                      >
                        {entry.org}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-7 border-t border-white/[0.08] pt-7">
                <EntryDetail entry={current} emphasis="org" />
              </div>
            </div>

            <MorphingDialogClose className="top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#1f130b]/85 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>

      {caption && (
        <p className="mt-2.5 pl-1 text-xs text-white/35 italic">{caption}</p>
      )}
    </article>
  );
}

/**
 * A certification hanging off a work category — deliberately smaller than a
 * category strip so the hierarchy reads without a caption: the role is the
 * subject, the credential is supporting evidence.
 *
 * Its own MorphingDialog rather than something nested inside the category's.
 * It sits OUTSIDE the category trigger in the DOM, so the two never collide,
 * and a dialog opened from inside another dialog has nowhere to morph back to.
 */
function CertBranchStrip({ entry }: { entry: Entry }) {
  return (
    <MorphingDialog
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      <MorphingDialogTrigger className="group flex w-full items-center gap-3 rounded-lg border border-white/[0.10] bg-white/[0.03] px-3.5 py-2.5 text-left transition-[background-color,border-color] duration-200 hover:border-white/[0.20] hover:bg-white/[0.07]">
        <EntryLogo entry={entry} size="h-8 w-8" label={entry.title} />

        <span className="min-w-0 flex-1">
          {/* line-clamp rather than truncate: "Financial Modeling Fundamentals
              and Corporate Valuation" loses its meaning cut to one line. */}
          <MorphingDialogTitle className="line-clamp-2 text-[0.8125rem] leading-[1.35] font-medium text-white/90">
            {entry.shortTitle ?? entry.title}
          </MorphingDialogTitle>
          <MorphingDialogSubtitle className="mt-0.5 truncate text-xs text-white/45">
            {entry.org}
          </MorphingDialogSubtitle>
        </span>

        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-white/30 transition-colors duration-150 group-hover:text-white/70"
          aria-hidden="true"
        />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="relative w-full max-w-lg rounded-xl border border-white/[0.14] bg-[#1f130b]">
          <div className="max-h-[85vh] overflow-y-auto p-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <EntryDetail entry={entry} morph />
          </div>

          <MorphingDialogClose className="top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#1f130b]/85 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

/**
 * The certifications branching off one category.
 *
 * The connector — a vertical rule with a stub into each strip — is drawn from
 * `sm` up ONLY. Below that the row stacks, the branch lands underneath the
 * category rather than beside it, and a line pointing rightward would point at
 * nothing. Stacked, the relationship is carried by a label and indentation
 * instead: same meaning, no geometry to break.
 */
/**
 * Everything hanging off one category panel: the certifications it produced,
 * and the skills the work itself built. Either tier can be absent.
 *
 * With certifications present the skills sit to their RIGHT, on a stub taken
 * from the vertical middle of the pair — stacked underneath they cost another
 * 70px of height for a few short words, alongside they fill space the row
 * already occupied. With no certifications (Accounting) the skills take the
 * certificate column's place and hang straight off the panel, rather than
 * leaving an empty column and a rule with nothing on it.
 *
 * That right-hand placement does risk reading as "the certificates taught
 * these", which is not where they came from — the label carries the
 * correction, which is why it stays even though dropping it would save a line.
 *
 * Connectors are drawn from `sm` up ONLY. Below that the row stacks, the branch
 * lands underneath the category rather than beside it, and a line pointing
 * rightward would point at nothing. Stacked, the relationship is carried by
 * labels and indentation instead: same meaning, no geometry to break.
 */
function CategoryBranch({
  items,
  skills,
  skillsLabel,
}: {
  items: Entry[];
  skills: string[];
  /**
   * Past or future tense, chosen by the category's stage. A role starting in
   * September has not built anything yet, and saying it did would undo the
   * point of separating "Currently aiming at" in the first place.
   */
  skillsLabel: string;
}) {
  const hasCerts = items.length > 0;

  return (
    <div className="mt-1 sm:mt-0 sm:flex sm:min-w-0 sm:flex-1 sm:items-center">
      {hasCerts && (
        <div className="flex w-full flex-col gap-3 border-white/[0.14] pl-4 sm:w-[22rem] sm:shrink-0 sm:border-l sm:pl-8">
          <p className="text-[0.6875rem] font-normal tracking-[0.14em] text-white/35 uppercase sm:hidden">
            Certified through this
          </p>

          {items.map((entry, i) => (
            <div key={i} className="relative">
              {/* Stub from the vertical rule into this strip. Width matches the
                  `sm:pl-8` above, so the two always meet. */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 -left-8 hidden h-px w-8 bg-white/[0.14] sm:block"
              />
              <CertBranchStrip entry={entry} />
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div
          className={`relative pl-4 sm:pl-8 ${
            hasCerts
              ? "mt-4 sm:mt-0"
              : // No certificate column to sit beside, so this tier owns the
                // rule descending from the panel.
                "mt-1 border-white/[0.14] sm:mt-0 sm:max-w-[26rem] sm:border-l"
          }`}
        >
          {/* One stub for the set, taken at the vertical centre of the row.
              Separate lines into each loose word read as noise; a single line
              into a labelled group reads as one branch, which is what it is. */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-0 hidden h-px w-8 bg-white/[0.14] sm:block"
          />

          <p className="text-[0.6875rem] font-normal tracking-[0.14em] text-white/30 uppercase">
            {skillsLabel}
          </p>

          <div className="mt-2 flex max-w-[22rem] flex-wrap gap-1.5">
            {/* Static labels, not triggers: there is nothing behind a skill to
                open, and styling them like the strips would promise a dialog
                that does not exist. */}
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-white/[0.09] bg-white/[0.02] px-2.5 py-1 text-xs text-white/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * A run of category panels with their branches.
 *
 * A grid with `auto-rows-fr` from `sm` up, not a flex column. The rows are
 * different heights — Finance's certificate column overhangs its panel, Venture
 * Capital has nothing beside it — and with a plain flex gap the space between
 * PANELS then varied, because the gap sits between rows while the eye measures
 * between panels. `auto-rows-fr` sizes every row to the tallest in its stack,
 * so the rhythm stays even whatever any one branch contains, and it corrects
 * itself as content changes where a hand-tuned margin would not.
 *
 * Mobile stays a flex column: there the rows differ by hundreds of pixels, and
 * equalising them would pad the short ones with dead space.
 */
/**
 * A single entry wearing the category panel's clothes.
 *
 * Same footprint, same chrome, same dialog as WorkCategoryBlock — the
 * difference is that there is no category above the entry, so the title leads
 * and there are no tabs. Sharing PANEL_WIDTH and PANEL_MIN_HEIGHT is the point:
 * the projects have to sit at the same visual weight as the roles, or the
 * heading above them is arguing something the layout contradicts.
 */
function EntryStrip({ entry }: { entry: Entry }) {
  return (
    // `h-full` down the chain: the grid stretches this article to the tallest
    // row, and without it the trigger inside keeps its own content height — so
    // a two-line title left one card visibly taller than its neighbours.
    <article className={`${PANEL_WIDTH} h-full`}>
      <MorphingDialog
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        <MorphingDialogTrigger
          className={`group block h-full w-full ${PANEL_MIN_HEIGHT} rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3.5 text-left transition-[background-color,border-color] duration-200 hover:border-white/[0.22] hover:bg-white/[0.08] sm:px-6`}
        >
          <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0">
              {entry.period && (
                <p className="text-xs font-normal tracking-wide text-white/45">
                  {entry.period}
                </p>
              )}

              <MorphingDialogTitle
                className={`text-2xl leading-[1.15] font-medium tracking-[-0.02em] text-white ${
                  entry.period ? "mt-1" : ""
                }`}
              >
                {entry.shortTitle ?? entry.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="mt-1 truncate text-sm text-orange-400/80">
                {entry.org}
              </MorphingDialogSubtitle>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
              <EntryLogo
                entry={entry}
                size="h-9 w-9"
                label={entry.title}
                Image={PlainImage}
              />

              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-white/40 transition-[transform,color] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/85"
                aria-hidden="true"
              />
            </div>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="relative w-full max-w-lg rounded-xl border border-white/[0.14] bg-[#1f130b]">
            <div className="max-h-[85vh] overflow-y-auto p-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <EntryDetail entry={entry} morph />
            </div>

            <MorphingDialogClose className="top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#1f130b]/85 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </article>
  );
}

function CategoryStack({
  categories,
}: {
  categories: (typeof WORK_CATEGORIES)[number][];
}) {
  return (
    <div className="flex flex-col gap-6 sm:grid sm:auto-rows-fr">
      {categories.map((category) => (
        <div
          key={category.label}
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0"
        >
          <WorkCategoryBlock
            label={category.label}
            entries={category.entries}
            caption={category.caption}
          />

          {(category.branches.length > 0 || category.skills.length > 0) && (
            <CategoryBranch
              items={category.branches}
              skills={category.skills}
              skillsLabel={
                category.stage === "aiming"
                  ? "What the work is building"
                  : "What the work built"
              }
            />
          )}
        </div>
      ))}
    </div>
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
      <h3 className={BLOCK_LABEL}>{label}</h3>

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
      {/* Work Experience runs full width, one panel per category, stacked.
          Deliberately not in the two-column grid below: these panels are the
          section's opening statement, and a half-height panel squeezed into a
          column reads as just another widget. */}
      <Reveal standalone>
        {/* Picks up the hero's "shooting strategic shots" — the roles below are
            the ones that landed. */}
        {/* Picks up the hero's "shooting strategic shots" — the roles below
            are the ones that landed. */}
        <h3 className={BLOCK_LABEL}>Successful Shots</h3>
        <CategoryStack categories={LANDED_CATEGORIES} />

        {/* Set apart rather than listed with the rest: this one has not started,
            and the separation is what keeps "Successful Shots" honest. */}
        {AIMING_CATEGORIES.length > 0 && (
          <div className="mt-12">
            <h3 className={BLOCK_LABEL}>Currently aiming at</h3>
            <CategoryStack categories={AIMING_CATEGORIES} />
          </div>
        )}
      </Reveal>

      {/* Third heading in the same run, set apart by the same mt-12 as
          "Currently aiming at", and the third to use the hero's shooting
          metaphor. The run reads as a sequence — the shots that landed, the one
          being aimed at, and the ones aimed somewhere else entirely — so the
          projects stop being a category of artefact and become the argument
          that the finance track is a choice rather than the whole person. */}
      <Reveal standalone className="mt-12">
        <h3 className={BLOCK_LABEL}>Evolving world, evolving shots</h3>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-0">
          {/*
            The projects, with a rail down their right edge that every strip
            reaches. The certificates then take a SINGLE line off the middle of
            that rail, which is what draws three-into-two rather than six
            separate lines: the two Claude courses fed all three projects, not
            any one of them.

            The rail is a border on this container rather than a positioned
            element, so it spans exactly the projects' height whatever they
            contain, and each stub is measured against the same `pr-8`.
          */}
          <div className="flex flex-col gap-6 sm:grid sm:auto-rows-fr sm:border-r sm:border-white/[0.14] sm:pr-8">
            {PROJECTS.map((entry, i) => (
              <div key={i} className="relative">
                <EntryStrip entry={entry} />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-8 hidden h-px w-8 bg-white/[0.14] sm:block"
                />
              </div>
            ))}
          </div>

          {PROJECT_CERTIFICATIONS.length > 0 && (
            <div className="relative sm:pl-8">
              {/* Stacked, the rail and its stubs are gone — a line pointing
                  left would point at nothing once the columns become rows — so
                  a label carries the relationship instead. */}
              <p className="mb-2 text-[0.6875rem] font-normal tracking-[0.14em] text-white/35 uppercase sm:hidden">
                What made all three possible
              </p>

              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 hidden h-px w-8 bg-white/[0.14] sm:block"
              />

              <div className="flex flex-col gap-2 pl-4 sm:w-[19rem] sm:pl-0">
                {PROJECT_CERTIFICATIONS.map((entry, i) => (
                  <CertBranchStrip key={i} entry={entry} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* Second row, mirroring the first. Both blocks loop, so neither has an
          intrinsic height — `minHeight` is what sizes the row, set to one card
          plus the block's padding. */}
      {/* Every certification now branches off the work or the projects that
          produced it, so this block usually has nothing left to show. It stays
          for the day one lands that belongs to neither — rendering an empty
          bordered box would read as a loading failure. */}
      <div
        className={`mt-6 grid gap-6 lg:mt-8 lg:gap-8 ${
          UNBRANCHED_CERTIFICATIONS.length > 0 ? "lg:grid-cols-2" : ""
        }`}
      >
        {UNBRANCHED_CERTIFICATIONS.length > 0 && (
          <Reveal standalone>
            <EntryBlock
              label="Certifications"
              minHeight="min-h-[278px]"
              blurHeight="26%"
            >
              <LoopingEntries entries={UNBRANCHED_CERTIFICATIONS} />
            </EntryBlock>
          </Reveal>
        )}

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
