import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  TrendingUp,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EXPENSES, INVOICES, formatCurrency } from "@/lib/data";

export default function FinancesPage() {
  const collected = INVOICES.filter((i) => i.status === "paid").reduce(
    (s, i) => s + i.amount,
    0
  );
  const outstanding = INVOICES.filter(
    (i) => i.status === "sent" || i.status === "overdue"
  ).reduce((s, i) => s + i.amount, 0);
  const spent = EXPENSES.reduce((s, e) => s + e.amount, 0);

  const stats = [
    {
      label: "Collected (30 days)",
      value: formatCurrency(collected),
      icon: ArrowUpRight,
      tone: "text-emerald-300",
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstanding),
      icon: DollarSign,
      tone: "text-accent",
    },
    {
      label: "Expenses (30 days)",
      value: formatCurrency(spent),
      icon: ArrowDownRight,
      tone: "text-red-300",
    },
    {
      label: "Net",
      value: formatCurrency(collected - spent),
      icon: TrendingUp,
      tone: "text-emerald-300",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold">
          Finances
        </h1>
        <p className="mt-1 text-sm text-muted">
          Invoices and expenses at a glance. QuickBooks sync is on the roadmap —
          for now this is sample data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-raised ${s.tone}`}>
              <s.icon size={18} />
            </span>
            <p className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-bold">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Invoices */}
        <div className="card overflow-hidden xl:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
              Invoices
            </h2>
            <button className="btn-primary !px-4 !py-2 text-sm">
              <Receipt size={15} /> New invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3 font-semibold">Invoice</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Due</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-line/50 transition-colors last:border-0 hover:bg-raised/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold">{inv.number}</p>
                      <p className="mt-0.5 text-xs text-muted">{inv.jobDescription}</p>
                    </td>
                    <td className="px-6 py-4">{inv.customerName}</td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(inv.dueDate + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses */}
        <div className="card h-fit overflow-hidden xl:col-span-2">
          <div className="border-b border-line px-6 py-5">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
              Recent expenses
            </h2>
          </div>
          <div className="divide-y divide-line/50">
            {EXPENSES.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold">{e.vendor}</p>
                  <p className="mt-0.5 text-xs text-muted">{e.description}</p>
                  <span className="mt-1.5 inline-flex rounded-full border border-line bg-raised px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {e.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-red-300">
                  -{formatCurrency(e.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
