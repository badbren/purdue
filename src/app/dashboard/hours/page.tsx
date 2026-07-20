"use client";

import { useState } from "react";
import { Clock, HardHat, LogIn, LogOut } from "lucide-react";
import { EMPLOYEES, TIME_ENTRIES, formatCurrency } from "@/lib/data";

export default function HoursPage() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  const crew = EMPLOYEES.filter((e) => e.hourlyRate > 0);
  const totalHours = TIME_ENTRIES.reduce((s, t) => s + (t.hours ?? 0), 0);
  const payroll = TIME_ENTRIES.reduce((s, t) => {
    const emp = EMPLOYEES.find((e) => e.id === t.employeeId);
    return s + (t.hours ?? 0) * (emp?.hourlyRate ?? 0);
  }, 0);

  function toggleClock() {
    if (clockedIn) {
      setClockedIn(false);
      setClockInTime(null);
    } else {
      setClockedIn(true);
      setClockInTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    // TODO: write to Supabase `time_entries` when wired up
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold">
          Employee hours
        </h1>
        <p className="mt-1 text-sm text-muted">
          Crew clock-ins and weekly timesheets.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Clock size={18} />
          </span>
          <p className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-bold">
            {totalHours.toFixed(1)}h
          </p>
          <p className="mt-1 text-sm text-muted">Logged this week</p>
        </div>
        <div className="card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <HardHat size={18} />
          </span>
          <p className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-bold">
            {crew.length}
          </p>
          <p className="mt-1 text-sm text-muted">Crew on payroll</p>
        </div>
        <div className="card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Clock size={18} />
          </span>
          <p className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-bold">
            {formatCurrency(payroll)}
          </p>
          <p className="mt-1 text-sm text-muted">Payroll this week</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Clock in/out */}
        <div className="card h-fit p-6 xl:col-span-2">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
            Time clock
          </h2>
          <p className="mt-1 text-sm text-muted">
            Employees will see this on their own login. Demo below.
          </p>
          <div className="mt-6 rounded-xl border border-line bg-raised p-6 text-center">
            <p className="text-sm text-muted">
              {clockedIn ? "Clocked in at" : "Not clocked in"}
            </p>
            {clockedIn && (
              <p className="mt-1 font-[family-name:var(--font-sora)] text-3xl font-bold text-accent">
                {clockInTime}
              </p>
            )}
            <button
              onClick={toggleClock}
              className={`mt-5 w-full justify-center ${
                clockedIn ? "btn-ghost" : "btn-primary"
              }`}
            >
              {clockedIn ? <LogOut size={18} /> : <LogIn size={18} />}
              {clockedIn ? "Clock out" : "Clock in"}
            </button>
          </div>
        </div>

        {/* Timesheet */}
        <div className="card overflow-hidden xl:col-span-3">
          <div className="border-b border-line px-6 py-5">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
              This week&apos;s entries
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3 font-semibold">Employee</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">In / Out</th>
                  <th className="px-6 py-3 font-semibold">Job site</th>
                  <th className="px-6 py-3 font-semibold">Hours</th>
                </tr>
              </thead>
              <tbody>
                {TIME_ENTRIES.map((t) => {
                  const emp = EMPLOYEES.find((e) => e.id === t.employeeId);
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-line/50 transition-colors last:border-0 hover:bg-raised/50"
                    >
                      <td className="px-6 py-4 font-semibold">{emp?.name}</td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(t.date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {t.clockIn} – {t.clockOut ?? "…"}
                      </td>
                      <td className="px-6 py-4">{t.jobSite}</td>
                      <td className="px-6 py-4 font-semibold text-accent">
                        {t.hours?.toFixed(1) ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
