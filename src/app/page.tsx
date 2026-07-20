import {
  Award,
  ClipboardList,
  Hammer,
  Mail,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ReviewsSection from "@/components/site/ReviewsSection";
import ShowcaseCarousel from "@/components/site/ShowcaseCarousel";
import { COMPANY, SERVICES } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ---------- HERO ---------- */}
        <section className="grain relative overflow-hidden">
          <div className="glow-pulse absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,160,91,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(217,160,91,0.07),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-32 lg:pb-28 lg:pt-52">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16">
              <div className="flex flex-col items-start gap-7">
                <span className="fade-up inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                  <Sparkles size={13} /> Family owned · 20 years of craft
                </span>
                <h1 className="fade-up font-[family-name:var(--font-sora)] text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
                  Trim work that turns a house into a{" "}
                  <span className="text-gradient">showpiece</span>.
                </h1>
                <p className="fade-up max-w-xl text-lg leading-relaxed text-muted">
                  Family-owned finish carpentry — crown molding, wainscoting,
                  cabinets, mantles, and custom woodwork, all custom-built to
                  fit. Replace, remodel, or first-time install.{" "}
                  {COMPANY.serviceArea} — free quotes.
                </p>
                <div className="fade-up flex flex-wrap gap-4">
                  <Link href="/quote" className="btn-primary">
                    <ClipboardList size={18} /> Get My Free Quote
                  </Link>
                  <a href="#work" className="btn-ghost">
                    See Our Work
                  </a>
                </div>
              </div>

              <div className="fade-up">
                <ShowcaseCarousel />
              </div>
            </div>

            <div className="fade-up mt-14 grid w-full grid-cols-3 gap-4 lg:max-w-2xl">
              {[
                { k: "20", v: "Years of craft" },
                { k: "500+", v: "Rooms finished" },
                { k: "5.0", v: "Star rated" },
              ].map((s) => (
                <div key={s.v} className="card px-4 py-5 text-center">
                  <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-accent md:text-3xl">
                    {s.k}
                  </div>
                  <div className="mt-1 text-xs text-muted md:text-sm">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- SERVICES ---------- */}
        <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              What we do
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-bold tracking-tight md:text-5xl">
              Every detail, dialed in.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Trim, interior finish carpentry, and custom woodwork — whatever
              you&apos;re picturing, we&apos;ll make it work, make it fit, and
              make it look great. Every cut treated like it&apos;s going in our
              own home.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="card group p-7 transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent transition-colors group-hover:bg-accent/20">
                  <Ruler size={20} />
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-sora)] text-lg font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- GALLERY ---------- */}
        <section id="work" className="border-y border-line bg-surface/50">
          <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Our work
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-bold tracking-tight md:text-5xl">
                  Proof is in the lines.
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  A few recent projects, straight off the job site. Follow us
                  on Facebook for the latest installs.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { src: "/showcase/work-08.jpg", label: "Coffered ceiling — two-story great room" },
                { src: "/showcase/work-03.jpg", label: "Two-story fireplace feature wall" },
                { src: "/showcase/work-25.jpg", label: "Mudroom built-ins" },
                { src: "/showcase/work-33.jpg", label: "Custom corner cabinets" },
                { src: "/showcase/work-16.jpg", label: "Chevron bench nook" },
                { src: "/showcase/work-34.jpg", label: "Black accent panel — fireplace" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`card group relative flex aspect-[4/3] items-end overflow-hidden ${
                    i === 0 ? "sm:col-span-2 sm:aspect-[8/3.1] lg:col-span-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="relative z-10 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-14">
                    <p className="text-sm font-semibold">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PROCESS ---------- */}
        <section id="process" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              How it works
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-bold tracking-tight md:text-5xl">
              Simple from quote to cleanup.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: <ClipboardList size={20} />,
                step: "01",
                title: "Reach out",
                text: "Start a quote request below — tell us what you're dreaming up and add photos.",
              },
              {
                icon: <ClipboardList size={20} />,
                step: "02",
                title: "Free on-site quote",
                text: "We walk the space with you, talk options, and give you a straight price.",
              },
              {
                icon: <Hammer size={20} />,
                step: "03",
                title: "We build it",
                text: "Clean install, tight joints, and we leave the site cleaner than we found it.",
              },
            ].map((p) => (
              <div key={p.step} className="card relative overflow-hidden p-7">
                <span className="absolute -right-2 -top-4 font-[family-name:var(--font-sora)] text-7xl font-bold text-foreground/5">
                  {p.step}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-sora)] text-lg font-bold">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { icon: <ShieldCheck size={18} />, text: "Licensed, bonded & insured" },
              { icon: <Award size={18} />, text: "Family owned & operated" },
              { icon: <Star size={18} />, text: "Straight pricing, no surprises" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-sm font-medium"
              >
                <span className="text-accent">{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- REVIEWS ---------- */}
        <ReviewsSection />

        {/* ---------- QUOTE / CONTACT ---------- */}
        <section id="quote" className="grain relative scroll-mt-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,160,91,0.10),transparent_60%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Get started
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-bold tracking-tight md:text-5xl">
                Ready to love your walls again?
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                Answer a few quick questions, snap some photos of the space,
                and we&apos;ll often get you a real price without even needing a
                site visit.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex w-fit items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 transition-colors hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                    <Mail size={18} />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted">
                      Email
                    </span>
                    <span className="font-semibold">{COMPANY.email}</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="card flex flex-col justify-center p-8 sm:p-10">
              <h3 className="font-[family-name:var(--font-sora)] text-2xl font-bold">
                Get a quote in 3 minutes
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Tell us what you want done — trim, built-ins, accent walls, anything",
                  "Upload up to 20 photos of the space right from your phone",
                  "Ricky reviews it and often quotes you without a site visit",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 font-[family-name:var(--font-sora)] text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/quote" className="btn-primary mt-8 w-full justify-center">
                <ClipboardList size={18} /> Start My Quote
              </Link>
              <p className="mt-3 text-center text-xs text-muted">
                Free, no pressure, takes about 3 minutes.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
