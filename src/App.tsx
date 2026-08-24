import SiteNav from "@/components/site-nav";
import SiteDock from "@/components/site-dock";
import Hero42 from "@/components/blocks/hero-42";
import Journey from "@/components/sections/journey";
import About from "@/components/sections/about";
import Vision from "@/components/sections/vision";

export default function App() {
  return (
    <div id="top" className="bg-ink min-h-screen antialiased">
      <SiteNav />
      {/* Bottom padding clears the fixed contact dock. */}
      <main className="pb-28">
        <Hero42 />
        <Journey />
        <About />
        <Vision />
      </main>
      <SiteDock />
    </div>
  );
}
