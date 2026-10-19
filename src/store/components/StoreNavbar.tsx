import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { getStoreInitials } from "../onboarding/data";

type StoreNavbarProps = {
  storeName: string;
  storeLogo?: string;
  onMenuClick: () => void;
};

export default function StoreNavbar({ storeName, storeLogo, onMenuClick }: StoreNavbarProps) {
  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
        <div className="hidden sm:block"><p className="text-sm text-slate-400">Welcome back,</p><p className="font-bold text-slate-900">{storeName}</p></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400 md:flex">
          <Search className="h-4 w-4" /><input type="search" placeholder="Search dashboard..." className="w-48 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" aria-label="Search dashboard" />
        </label>
        <button type="button" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F26A21]" /></button>
        <button type="button" className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50" aria-label="Open profile menu"><span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-[#0E7BC1]">{storeLogo ? <img src={storeLogo} alt="" className="h-full w-full object-cover" /> : getStoreInitials(storeName)}</span><ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" /></button>
      </div>
    </header>
  );
}
