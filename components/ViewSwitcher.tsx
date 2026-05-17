import type { LeadView } from "@/types/lead";

// Props do seletor de visão
type ViewSwitcherProps = {
  activeView: LeadView;

  onChangeView: (
    view: LeadView
  ) => void;
};

// Alterna visão SDR / Closer
export function ViewSwitcher({
  activeView,
  onChangeView,
}: ViewSwitcherProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">

      <button
        onClick={() =>
          onChangeView("closer")
        }
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeView === "closer"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Visão Closer
      </button>

      <button
        onClick={() =>
          onChangeView("sdr")
        }
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeView === "sdr"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Visão SDR
      </button>

    </div>
  );
}