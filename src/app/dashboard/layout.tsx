import Link from "next/link";
import { Hammer } from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface md:flex">
        <Link href="/" className="flex items-center gap-2.5 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Hammer size={18} />
          </span>
          <span className="font-[family-name:var(--font-sora)] font-bold">
            Perdue <span className="text-accent">HQ</span>
          </span>
        </Link>
        <DashboardNav />
        <div className="border-t border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-sora)] text-sm font-bold text-black">
              RP
            </span>
            <div>
              <p className="text-sm font-semibold">Ricky Perdue</p>
              <p className="text-xs text-muted">Owner</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <div className="md:hidden">
          <DashboardNav mobile />
        </div>
        <main className="p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}
