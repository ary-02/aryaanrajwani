import Section, { Reveal } from "@/components/section";

/**
 * One register, carried over from the Journey section's shooting metaphor: the
 * shots that were lined up and then taken without real commitment. Journey
 * shows what landed and what is mid-flight; this is the other half of the same
 * ledger.
 *
 * `items` is deliberately empty. This is the section the site does not yet have
 * the writing for, and inventing it would be worse than leaving it open — a
 * reader can tell the difference between a blank and a fake.
 *
 * TO FILL: push entries onto the array. The placeholder card below renders only
 * while it is empty, so it retires itself the moment the writing lands. Delete
 * `EmptyCard` and its call site then.
 *
 * On tone — a half-taken shot only works if the entry carries WHY, and what
 * would change it. A bare list of things not done reads as excuses; the same
 * list with reasoning reads as someone who knows themselves. That distinction
 * is the whole reason this section exists.
 */
const BLOCKS: {
  label: string;
  items: { title: string; blurb: string }[];
}[] = [
  {
    label: "Shots aimed, but only half-assed",
    items: [
      // Titles only for now — the blurb is the part that carries the WHY, and
      // it is the part still unwritten. Each card renders without one.
      { title: "Content creation", blurb: "" },
      { title: "Executing business ideas", blurb: "" },
      { title: "Stock trading", blurb: "" },
    ],
  },
];

/**
 * Stand-in for a group with nothing written yet.
 *
 * Deliberately says that it is unwritten rather than carrying filler prose. An
 * admitted gap costs nothing on a site whose whole pitch is honesty; invented
 * copy in the author's voice would cost the credibility the section exists to
 * build.
 */
function EmptyCard() {
  return (
    <article className="rounded-xl border border-dashed border-white/[0.16] px-6 py-7">
      <p className="text-sm text-white/35 italic">Being written.</p>
    </article>
  );
}

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="More about me"
      title="Parts a traditional resume does not cover"
      lede={<em>The side not too dramatic and glamorous</em>}
    >
      <div className="grid gap-x-8 gap-y-12">
        {BLOCKS.map((block) => (
          <Reveal key={block.label}>
            <h3 className="text-sm font-normal tracking-[0.14em] text-white/40 uppercase">
              {block.label}
            </h3>

            <div className="mt-5 grid gap-4 sm:auto-rows-fr sm:grid-cols-3">
              {block.items.length === 0 ? (
                <EmptyCard />
              ) : (
                block.items.map((item, i) => (
                  <article
                    key={i}
                    className="h-full rounded-xl border border-white/[0.12] bg-white/[0.05] p-6 backdrop-blur-sm transition-[background-color,border-color] duration-200 hover:border-white/[0.22] hover:bg-white/[0.09]"
                  >
                    <h4 className="text-base font-medium text-white/90">
                      {item.title}
                    </h4>
                    {/* Guarded the way the Vision cards are: an empty blurb
                        would still render its top margin and leave a gap under
                        the heading that reads as a layout bug. */}
                    {item.blurb && (
                      <p className="mt-2.5 text-sm leading-[1.7] text-pretty text-white/65">
                        {item.blurb}
                      </p>
                    )}
                  </article>
                ))
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
