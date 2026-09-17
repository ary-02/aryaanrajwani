import { Analytics } from "@vercel/analytics/react";
import SiteNav from "@/components/site-nav";
import SiteDock from "@/components/site-dock";
import SectionTimeTracker from "@/components/section-time-tracker";
import Hero42 from "@/components/blocks/hero-42";
import Journey from "@/components/sections/journey";
import Vision from "@/components/sections/vision";

export default function App() {
  return (
    <div id="top" className="bg-ink min-h-screen antialiased">
      <SiteNav />
      {/* Bottom padding clears the fixed contact dock. */}
      <main className="pb-28">
        <Hero42 />
        <Journey />
        <Vision />
      </main>
      <SiteDock />
      {/* Vercel's own script, injected on production only — see
          docs/analytics.md for what it collects and the dashboard step
          this still needs. */}
      <Analytics />
      {/* Renders nothing; reports per-section dwell time as custom events
          alongside it. */}
      <SectionTimeTracker />
    </div>
  );
}
