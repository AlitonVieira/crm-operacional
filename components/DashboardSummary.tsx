type SummaryItem = {
  label: string;

  value: number;
};

type DashboardSummaryProps = {
  title: string;

  items: SummaryItem[];
};

// Resumo operacional do topo
export function DashboardSummary({
  title,
  items,
}: DashboardSummaryProps) {
  return (
    <div className="mb-6 rounded-2xl bg-slate-50 p-4">

      <p className="text-sm font-medium text-slate-800">
        {title}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">

        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}