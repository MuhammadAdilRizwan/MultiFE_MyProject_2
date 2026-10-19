import { useEffect, useState, type ReactNode } from "react";
import StoreNavbar from "../components/StoreNavbar";
import StoreSidebar, { type StorePage } from "../components/StoreSidebar";
import { getStoreProfile, goToStorePath } from "../onboarding/data";

type StoreLayoutProps = {
  children: ReactNode;
  activePage?: StorePage;
  onNavigate?: (page: StorePage) => void;
};

export default function StoreLayout({ children, activePage = "Dashboard", onNavigate }: StoreLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [store] = useState(getStoreProfile);

  // The portal is only for registered partners; everyone else starts at registration.
  useEffect(() => {
    if (!store) goToStorePath("/store/register");
  }, [store]);

  const navigate = (page: StorePage) => {
    if (onNavigate) {
      onNavigate(page);
      return;
    }

    const basePath = window.location.pathname.startsWith("/multife-local")
      ? "/multife-local"
      : "";
    const route = page === "Products" ? "/store/products" : "/store";
    window.location.assign(`${basePath}${route}`);
  };

  if (!store) return null;

  return (
    <div className="store-theme flex min-h-screen bg-[#F8FCFF] text-[#08243D]">
      <style>{`
        .store-theme {
          --store-ink: #08243D;
          --store-ink-soft: #1B3654;
          --store-muted: #65758A;
          --store-blue: #0E7BC1;
          --store-blue-deep: #06365A;
          --store-cyan: #10B6D9;
          --store-orange: #F26A21;
          --store-green: #78BE43;
          --store-line: rgba(8, 36, 61, 0.11);
          background:
            radial-gradient(circle at 8% 0%, rgba(16, 182, 217, 0.12), transparent 30%),
            radial-gradient(circle at 96% 6%, rgba(242, 106, 33, 0.08), transparent 25%),
            linear-gradient(135deg, #F8FCFF 0%, #FFFFFF 48%, #FFF8EF 100%);
        }
        .store-theme [class*="text-slate-900"],
        .store-theme [class*="text-slate-800"] { color: var(--store-ink) !important; }
        .store-theme [class*="text-slate-700"],
        .store-theme [class*="text-slate-600"],
        .store-theme [class*="text-slate-500"],
        .store-theme [class*="text-slate-400"] { color: var(--store-muted) !important; }
        .store-theme [class*="border-slate-200"],
        .store-theme [class*="border-slate-100"] { border-color: var(--store-line) !important; }
        .store-theme [class*="bg-white"] { background-color: rgba(255, 255, 255, 0.92) !important; }
        .store-theme [class*="bg-slate-50"] { background-color: #F4FBFD !important; }
        .store-theme [class*="hover\\:bg-slate-50"]:hover,
        .store-theme [class*="hover\\:bg-slate-100"]:hover { background-color: #F4FBFD !important; }
        .store-theme [class*="bg-blue-50"] { background-color: #E7F8FF !important; }
        .store-theme [class*="text-\\[#0E7BC1\\]"] { color: var(--store-blue) !important; }
        .store-theme [class*="bg-\\[#0E7BC1\\]"] { background: linear-gradient(135deg, var(--store-blue-deep), var(--store-blue), var(--store-cyan)) !important; }
        .store-theme [class*="bg-violet-50"] { background-color: #F1F4FF !important; }
        .store-theme [class*="text-violet-600"] { color: #6D55A8 !important; }
        .store-theme [class*="bg-amber-50"] { background-color: #FFF5E8 !important; }
        .store-theme [class*="text-amber-600"],
        .store-theme [class*="text-amber-700"] { color: var(--store-orange) !important; }
        .store-theme [class*="bg-emerald-50"] { background-color: #EEF9E8 !important; }
        .store-theme [class*="text-emerald-600"],
        .store-theme [class*="text-emerald-700"] { color: #5B9832 !important; }
        .store-theme [class*="bg-orange-50"] { background-color: #FFF0E7 !important; }
        .store-theme [class*="text-orange-600"] { color: var(--store-orange) !important; }
        .store-theme [class*="text-red-600"],
        .store-theme [class*="text-red-700"] { color: #C94B43 !important; }
        .store-theme [class*="bg-red-50"] { background-color: #FFF0EF !important; }
        .store-theme input::placeholder { color: var(--store-muted); }
      `}</style>
      <StoreSidebar activePage={activePage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={navigate} storeName={store.name} storeLogo={store.logo} />
      <div className="flex min-w-0 flex-1 flex-col">
        <StoreNavbar storeName={store.name} storeLogo={store.logo} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
