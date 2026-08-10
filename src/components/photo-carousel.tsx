import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  useCarousel,
} from "@/components/blocks/carousel";

export interface Photo {
  src: string;
  alt: string;
}

/**
 * Slide indicator.
 *
 * Upstream's `CarouselIndicator` cannot be used here. Its palette is light-first
 * (`bg-zinc-950` active, `bg-zinc-900/50` idle) and this project does not enable
 * Tailwind's class-based dark variant, so both states land on near-black and
 * vanish against a photo. Passing `classNameButton` does not help: it merges
 * over BOTH states at once, so the active dot stops being distinguishable.
 * Rebuilt from the exported `useCarousel` hook, which is the supported seam.
 */
function Dots() {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
      {Array.from({ length: itemsCount }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={index === i}
          onClick={() => setIndex(i)}
          className={`pointer-events-auto h-1.5 rounded-full ring-1 ring-black/30 transition-all duration-200 ${
            index === i ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Swipeable photo strip for a dialog.
 *
 * Every slide is locked to one aspect ratio and cropped from the centre. Mixed
 * ratios are what make a carousel look broken — the frame jumps height on each
 * slide and the controls move with it. Phone photos are portrait and would run
 * ~680px tall at this width, so 3:2 also keeps the strip from pushing the rest
 * of the dialog off the screen.
 *
 * Upstream's navigation sits at left-[-12.5%] / w-[125%], i.e. outside the
 * frame — but Carousel wraps its children in `overflow-hidden`, so those arrows
 * are clipped away. They are pulled inside here, which is also the only thing
 * that works at dialog width.
 */
export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <Carousel className="overflow-hidden rounded-xl border border-white/[0.12]">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.src}>
            <img
              src={photo.src}
              alt={photo.alt}
              className="block aspect-[3/2] w-full bg-black/40 object-cover object-center select-none"
              draggable={false}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* A single photo needs no controls, and a lone disabled arrow pair reads
          as broken rather than as "there is nothing else here". */}
      {photos.length > 1 && (
        <>
          <CarouselNavigation
            className="left-0 w-full justify-between px-3"
            classNameButton="border border-white/15 bg-black/55 backdrop-blur-sm hover:bg-black/75 [&_svg]:stroke-white"
            alwaysShow
          />
          <Dots />
        </>
      )}
    </Carousel>
  );
}
