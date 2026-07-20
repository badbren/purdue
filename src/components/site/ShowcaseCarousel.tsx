"use client";

import { useEffect, useState } from "react";
import { Hammer, ImageIcon } from "lucide-react";

const CYCLE_MS = 10000;

// Photos live in /public/showcase/. Slides without a src render a styled
// placeholder, so adding new work is just dropping a file + one entry here.
interface Slide {
  src: string | null;
  label: string;
  caption: string;
  /** placeholder gradient, only used when src is null */
  bg?: string;
}

const SLIDES: Slide[] = [
  {
    src: "/showcase/work-05.jpg",
    label: "Board & batten entry",
    caption: "Staircase wainscoting, finished & styled",
  },
  {
    src: "/showcase/work-26.jpg",
    label: "White oak fireplace wall",
    caption: "Plank feature wall with chunky mantel",
  },
  {
    src: "/showcase/work-12.jpg",
    label: "Coffered ceiling",
    caption: "Painted & lit, stone fireplace great room",
  },
  {
    src: "/showcase/work-20.jpg",
    label: "Vaulted oak beams",
    caption: "White oak beams on a cathedral ceiling",
  },
  {
    src: "/showcase/work-22.jpg",
    label: "Classic wainscoting",
    caption: "Board & batten, crisp two-tone finish",
  },
  {
    src: "/showcase/work-29.jpg",
    label: "Craftsman porch",
    caption: "Tapered columns, stone bases, T&G ceiling",
  },
  {
    src: "/showcase/work-01.jpg",
    label: "Geometric accent wall",
    caption: "Custom diamond layout, cut & fit on site",
  },
  {
    src: "/showcase/work-13.jpg",
    label: "Chevron feature wall",
    caption: "Full-wall chevron paneling, ready for paint",
  },
  {
    src: "/showcase/work-24.jpg",
    label: "Picture-frame millwork",
    caption: "Paneled hallway with arched doors & crown",
  },
  {
    src: "/showcase/work-31.jpg",
    label: "Paneled staircase",
    caption: "Full-height panel molding, both walls",
  },
  {
    src: "/showcase/work-19.jpg",
    label: "Drop zone built-ins",
    caption: "Lockers, bench & crown — custom fit",
  },
  {
    src: "/showcase/work-14.jpg",
    label: "Floating oak shelves",
    caption: "Thick white oak, seamless mount",
  },
  {
    src: "/showcase/work-27.jpg",
    label: "Mitered mantel detail",
    caption: "The joints we're proud of, up close",
  },
  {
    src: "/showcase/work-32.jpg",
    label: "Stained coffered ceiling",
    caption: "Dark-stained oak, hand-finished",
  },
];

export default function ShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl border border-line shadow-2xl shadow-black/50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* soft gold glow behind the frame */}
      <div className="pointer-events-none absolute -inset-px z-20 rounded-3xl ring-1 ring-inset ring-white/5" />

      <div className="relative aspect-[4/3] sm:aspect-[3/2]">
        {SLIDES.map((s, i) => (
          <div
            key={s.label}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {s.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.src}
                alt={s.label}
                className={`h-full w-full object-cover ${i === index ? "kenburns" : ""}`}
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center ${
                  i === index ? "kenburns" : ""
                }`}
                style={{ background: s.bg }}
              >
                {/* wall paneling texture */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 110px), repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 130px)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(217,160,91,0.18),transparent_55%)]" />
                {/* picture-frame emblem while we wait on real photos */}
                <div className="relative flex flex-col items-center gap-3 rounded-sm border border-accent/25 px-10 py-8">
                  <div className="absolute inset-1.5 rounded-sm border border-accent/15" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent/80">
                    <Hammer size={22} />
                  </span>
                  <p className="font-[family-name:var(--font-sora)] text-sm font-bold uppercase tracking-[0.3em] text-accent/70">
                    Perdue
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted/70">
                    <ImageIcon size={11} /> Photo coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* caption overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-6 pb-6 pt-16">
          <div key={index} className="fade-up">
            <p className="font-[family-name:var(--font-sora)] text-lg font-bold">
              {SLIDES[index].label}
            </p>
            <p className="mt-0.5 text-sm text-white/70">{SLIDES[index].caption}</p>
          </div>
        </div>

        {/* top chip */}
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
          <Hammer size={12} className="text-accent" /> Recent work
        </div>

        {/* dots */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.label}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* cycle progress bar */}
        {!paused && (
          <div
            key={`bar-${index}`}
            className="progress-bar absolute bottom-0 left-0 z-10 h-0.5 bg-accent/80"
            style={{ animationDuration: `${CYCLE_MS}ms` }}
          />
        )}
      </div>
    </div>
  );
}
