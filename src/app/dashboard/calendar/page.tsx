"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { APPOINTMENTS, type Appointment } from "@/lib/data";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Appointment | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of APPOINTMENTS) {
      if (a.status === "cancelled") continue;
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    }
    return map;
  }, []);

  const cells = useMemo(() => {
    const firstDow = cursor.getDay();
    const daysInMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0
    ).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < firstDow; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    return out;
  }, [cursor]);

  const todayKey = toKey(new Date());
  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-muted">
            Quote appointments and scheduled jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface transition-colors hover:border-accent/40"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-40 text-center font-[family-name:var(--font-sora)] font-semibold">
            {monthLabel}
          </span>
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface transition-colors hover:border-accent/40"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="grid grid-cols-7 border-b border-line">
            {DAYS.map((d) => (
              <div
                key={d}
                className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date)
                return <div key={`empty-${i}`} className="min-h-24 border-b border-r border-line/50" />;
              const key = toKey(date);
              const appts = byDate.get(key) ?? [];
              const isToday = key === todayKey;
              return (
                <div
                  key={key}
                  className={`min-h-24 border-b border-r border-line/50 p-1.5 ${
                    isToday ? "bg-accent/5" : ""
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday ? "bg-accent text-black" : "text-muted"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {appts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[11px] font-medium transition-colors ${
                          a.status === "requested"
                            ? "bg-sky-400/15 text-sky-300 hover:bg-sky-400/25"
                            : "bg-accent/15 text-accent hover:bg-accent/25"
                        }`}
                      >
                        {a.time} · {a.customerName}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card h-fit p-6">
          <h2 className="mb-4 font-[family-name:var(--font-sora)] text-lg font-bold">
            {selected ? "Appointment details" : "Select an appointment"}
          </h2>
          {selected ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-[family-name:var(--font-sora)] text-lg font-bold">
                  {selected.customerName}
                </p>
                <StatusBadge status={selected.status} />
              </div>
              <p className="text-muted">{selected.service}</p>
              <div className="space-y-2 rounded-xl border border-line bg-raised p-4">
                <p className="font-semibold">
                  {new Date(selected.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {selected.time}
                </p>
                <p className="flex items-center gap-2 text-muted">
                  <MapPin size={14} /> {selected.address}
                </p>
                <a
                  href={`tel:${selected.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <Phone size={14} /> {selected.phone}
                </a>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  Notes
                </p>
                <p className="leading-relaxed text-foreground/90">{selected.notes}</p>
              </div>
              {selected.status === "requested" && (
                <button className="btn-primary w-full justify-center !py-2.5 text-sm">
                  Confirm appointment
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Click any appointment on the calendar to see the customer&apos;s
              details, job notes, and contact info.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
