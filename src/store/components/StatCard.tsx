import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  note?: string;
  positive?: boolean;
  icon: LucideIcon;
  iconClassName: string;
};

export default function StatCard({
  label,
  value,
  change,
  note,
  positive = true,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {change ? (
        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
          <ChangeIcon className="h-3.5 w-3.5" />
          {change}
          <span className="font-normal text-slate-400">vs last month</span>
        </div>
      ) : (
        note && <p className="mt-4 text-xs text-slate-400">{note}</p>
      )}
    </article>
  );
}
