import Link from "next/link";
import { Hammer, Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Hammer size={18} />
            </span>
            <span className="font-[family-name:var(--font-sora)] text-lg font-bold">
              Perdue <span className="text-accent">Construction</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Family-owned {COMPANY.tagline.toLowerCase()} — 20 years of
            craftsmanship you can see in every corner, joint, and line.
            Licensed, bonded &amp; insured.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2.5 text-foreground/90 hover:text-accent"
              >
                <Mail size={15} className="text-accent" /> {COMPANY.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-muted">
              <MapPin size={15} className="text-accent" /> {COMPANY.serviceArea}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href="#services" className="text-foreground/90 hover:text-accent">Services</a></li>
            <li><a href="#work" className="text-foreground/90 hover:text-accent">Our Work</a></li>
            <li><Link href="/quote" className="text-foreground/90 hover:text-accent">Get a Quote</Link></li>
            <li>
              <Link href="/login" className="text-muted hover:text-accent">
                Team Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
      </div>
    </footer>
  );
}
