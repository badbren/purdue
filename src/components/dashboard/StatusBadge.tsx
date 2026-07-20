const STYLES: Record<string, string> = {
  requested: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  confirmed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  completed: "bg-zinc-400/10 text-zinc-300 border-zinc-400/20",
  cancelled: "bg-red-400/10 text-red-300 border-red-400/20",
  draft: "bg-zinc-400/10 text-zinc-300 border-zinc-400/20",
  sent: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  paid: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  overdue: "bg-red-400/10 text-red-300 border-red-400/20",
  new: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  quoted: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  archived: "bg-zinc-400/10 text-zinc-300 border-zinc-400/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STYLES[status] ?? STYLES.draft
      }`}
    >
      {status}
    </span>
  );
}
