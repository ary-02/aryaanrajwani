import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/blocks/dock";

/**
 * Brand icons here are nominative use: they link to Aryaan's own profiles. The
 * "no third-party brand logos" rule in CLAUDE.md targets fake social proof,
 * which this isn't.
 */
const CONTACTS = [
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/aryaanrajwani/",
  },
  {
    label: "GitHub",
    icon: Github,
    href: "https://github.com/ary-02",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/aryaanrajwani/",
  },
  {
    label: "Email",
    icon: Mail,
    // Gmail's web compose rather than a bare `mailto:`. `view=cm` is compose
    // mode and `fs=1` makes it full-screen instead of the corner popout; `to`
    // is the only field prefilled. Being an https: URL, it passes the
    // isExternal test below and opens in a new tab — which it must, or the
    // visitor loses the site to navigate to Gmail.
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=aryaan.rajwani@smu.ca",
  },
];

/**
 * Contact dock, fixed to the bottom of the viewport so it's reachable from any
 * section. `pointer-events-none` on the wrapper keeps the full-width strip from
 * swallowing clicks on the page behind it; the dock itself re-enables them.
 */
export default function SiteDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
      <div className="pointer-events-auto">
        <Dock
          className="items-end border border-white/[0.12] bg-[#241710]/80 pb-3 backdrop-blur-md"
          magnification={64}
          distance={120}
        >
          {CONTACTS.map((contact) => {
            const Icon = contact.icon;
            const isExternal = contact.href.startsWith("http");

            return (
              <DockItem
                key={contact.label}
                href={contact.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer noopener" : undefined}
                aria-label={contact.label}
                className="aspect-square rounded-full border border-white/[0.12] bg-white/[0.07] transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.12]"
              >
                <DockLabel className="border-white/[0.12] bg-[#241710] text-white/85">
                  {contact.label}
                </DockLabel>
                <DockIcon>
                  <Icon className="h-full w-full text-white/75" />
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </div>
  );
}
