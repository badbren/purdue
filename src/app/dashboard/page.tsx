import {
  CalendarDays,
  Clock,
  DollarSign,
  Inbox,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  APPOINTMENTS,
  INVOICES,
  TIME_ENTRIES,
  formatCurrency,
} from "@/lib/data";

export default function DashboardOverview() {
  const requested = APPOINTMENTS.filter((a) => a.status === "requested");
  const confirmed = APPOINTMENTS.filter((a) => a.status === "confirmed");
  const outstanding = INVOICES.filter(
    (i) => i.status === "sent" || i.status === "overdue"
  ).reduce((sum, i) => sum + i.amount, 0);
  const weekHours = TIME_ENTRIES.reduce((sum, t) => sum + (t.hours ?? 0), 0);

  const upcoming = [...APPOINTMENTS]
    .filter((a) => a.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const stats = [
    {
      label: "New quote requests",
      value: String(requested.length),
      icon: Inbox,
      href: "/dashboard/quotes",
    },
    {
      label: "Confirmed appointments",
      value: String(confirmed.length),
      icon: CalendarDays,
      href: "/dashboard/calendar",
    },
    {
      label: "Outstanding invoices",
      value: formatCurrency(outstanding),
      icon: DollarSign,
      href: "/dashboard/finances",
    },
    {
      label: "Crew hours this week",
      value: `${weekHours.toFixed(1)}h`,
      icon: Clock,
      href: "/dashboard/hours",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold">
          Morning, Ricky 👋
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s what&apos;s happening at Perdue Construction.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <s.icon size={18} />
              </span>
            </div>
            <p className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-bold">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Upcoming appointments */}
        <div className="card p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
              Upcoming appointments
            </h2>
            <Link href="/dashboard/calendar" className="text-sm font-medium text-accent hover:underline">
              View calendar →
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-raised p-4"
              >
                <div>
                  <p className="font-semibold">{a.customerName}</p>
                  <p className="mt-0.5 text-sm text-muted">{a.service}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={12} /> {a.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {new Date(a.date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted">{a.time}</p>
                  <div className="mt-1.5">
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New requests */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-5 font-[family-name:var(--font-sora)] text-lg font-bold">
            Needs your reply
          </h2>
          <div className="space-y-3">
            {requested.map((a) => (
              <div key={a.id} className="rounded-xl border border-line bg-raised p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{a.customerName}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{a.service}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                  {a.notes}
                </p>
                <a
                  href={`tel:${a.phone.replace(/\D/g, "")}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <Phone size={13} /> {a.phone}
                </a>
              </div>
            ))}
            {requested.length === 0 && (
              <p className="text-sm text-muted">All caught up. Nice.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
