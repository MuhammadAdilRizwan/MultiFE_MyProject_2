import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Palette,
  Settings,
  Shirt,
  Store,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getStoreInitials } from "../onboarding/data";

type StorePage = "Dashboard" | "Products" | "Dress Templates" | "Customizations" | "Orders" | "Store Profile" | "Settings";

type StoreSidebarProps = {
  activePage: StorePage;
  open: boolean;
  onClose: () => void;
  onNavigate?: (page: StorePage) => void;
  storeName: string;
  storeLogo?: string;
};

const items: { label: StorePage; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Boxes },
  { label: "Dress Templates", icon: Shirt },
  { label: "Customizations", icon: Palette },
  { label: "Orders", icon: ClipboardList },
  { label: "Store Profile", icon: Store },
  { label: "Settings", icon: Settings },
];

export default function StoreSidebar({ activePage, open, onClose, onNavigate, storeName, storeLogo }: StoreSidebarProps) {
  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E7BC1] text-white"><Store className="h-5 w-5" /></span>
            <div>
              <p className="text-lg font-bold text-slate-900">MultiFe</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Store portal</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" aria-label="Close sidebar"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
          {items.map(({ label, icon: Icon }) => {
            const active = label === activePage;
            return (
              <button key={label} type="button" onClick={() => { onNavigate?.(label); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${active ? "bg-blue-50 text-[#0E7BC1]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Icon className="h-[18px] w-[18px]" />
                {label}              </button>
            );
          })}
        </nav>
        <div className="m-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0E7BC1] text-sm font-bold text-white">{storeLogo ? <img src={storeLogo} alt="" className="h-full w-full object-cover" /> : getStoreInitials(storeName)}</div>
            <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{storeName}</p><p className="text-xs text-slate-400">Store admin</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}

export type { StorePage };
