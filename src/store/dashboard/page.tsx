import { useState } from "react";
import { Boxes, CheckCircle2, Clock3, DollarSign, Eye, Layers, MapPin, Pencil, Plus, ShoppingBag, X } from "lucide-react";
import Button from "../components/Button";
import DataTable, { type Column } from "../components/DataTable";
import StatCard from "../components/StatCard";
import { type Status } from "../components/StatusBadge";
import StoreLayout from "../layout/StoreLayout";
import {
  formatPkr,
  getStoreFabrics,
  getStoreInitials,
  getStoreProfile,
  goToStorePath,
  storeBasePath,
  type StoreFabric,
} from "../onboarding/data";

type Order = {
  id: string;
  customer: string;
  date: string;
  status: Status;
  amount: string;
};

const orderColumns: Column<Order>[] = [
  { key: "id", label: "Order ID", render: (order) => <span className="font-bold text-slate-800">{order.id}</span> },
  { key: "customer", label: "Customer Name", render: (order) => order.customer },
  { key: "date", label: "Date", render: (order) => <span className="whitespace-nowrap">{order.date}</span> },
  { key: "status", label: "Status", render: (order) => order.status },
  { key: "amount", label: "Amount", render: (order) => <span className="font-semibold text-slate-800">{order.amount}</span> },
];

// Orders arrive once customers can order from this store; until a backend exists there are none.
const orders: Order[] = [];

function FabricRow({ fabric }: { fabric: StoreFabric }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
        {fabric.images[0] ? <img src={fabric.images[0]} alt="" className="h-full w-full object-cover" /> : <Layers className="h-5 w-5 text-slate-400" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{fabric.name}</p>
        <p className="mt-0.5 text-xs text-slate-400">
          {fabric.material || fabric.category} · {fabric.status}
        </p>
      </div>
      <p className="whitespace-nowrap text-sm font-semibold text-slate-700">{formatPkr(fabric.pricePerYard)} / yd</p>
    </div>
  );
}

export default function StoreDashboardPage() {
  const [store] = useState(getStoreProfile);
  const [fabrics] = useState(getStoreFabrics);
  const [showWelcome, setShowWelcome] = useState(() => new URLSearchParams(window.location.search).has("welcome"));

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const activeFabrics = fabrics.filter((fabric) => fabric.status === "Active").length;
  const goToFabrics = () => goToStorePath("/store/fabrics/setup");

  const dismissWelcome = () => {
    setShowWelcome(false);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <StoreLayout>
      {store && (
        <div className="mx-auto max-w-[1500px] space-y-8 p-4 sm:p-8">
          {showWelcome && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:items-center" role="status">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Welcome to MultiFe, {store.name}!</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Your store and {fabrics.length} {fabrics.length === 1 ? "fabric" : "fabrics"} are saved. Our team will review your store before it appears to customers.
                </p>
              </div>
              <button type="button" onClick={dismissWelcome} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Dismiss message">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#0E7BC1]">{today}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Store overview</h1>
              <p className="mt-2 text-sm text-slate-500">Manage your fabrics, orders, and custom clothing experience.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button icon={<Plus className="h-4 w-4" />} onClick={goToFabrics}>Add Fabric</Button>
              <Button variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => goToStorePath("/")}>View MultiFe</Button>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-blue-50 sm:h-36">
              {store.banner && <img src={store.banner} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div className="flex items-end gap-4">
                <div className="relative z-10 -mt-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white text-xl font-bold text-[#0E7BC1] shadow-md">
                  {store.logo ? <img src={store.logo} alt={`${store.name} logo`} className="h-full w-full object-cover" /> : getStoreInitials(store.name)}
                </div>
                <div className="min-w-0 pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-bold text-slate-900">{store.name}</h2>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">Under review</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0E7BC1]" />
                    {store.area}, {store.city}
                  </p>
                </div>
              </div>
              <a
                href={`${storeBasePath}/store/register`}
                className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:self-auto"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit store details
              </a>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total Fabrics" value={String(fabrics.length)} note={`${activeFabrics} visible to customers`} icon={Boxes} iconClassName="bg-blue-50 text-[#0E7BC1]" />
            <StatCard label="Total Orders" value="0" note="No orders yet" icon={ShoppingBag} iconClassName="bg-violet-50 text-violet-600" />
            <StatCard label="Pending Orders" value="0" note="Nothing waiting" icon={Clock3} iconClassName="bg-amber-50 text-amber-600" />
            <StatCard label="Completed Orders" value="0" note="Shows once orders arrive" icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-600" />
            <StatCard label="Total Revenue" value={formatPkr(0)} note="From completed orders" icon={DollarSign} iconClassName="bg-orange-50 text-orange-600" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold text-slate-900">Recent orders</h2>
                <p className="mt-1 text-xs text-slate-400">Latest customer activity</p>
              </div>
              {orders.length ? (
                <DataTable columns={orderColumns} rows={orders} />
              ) : (
                <div className="px-5 py-10 text-center">
                  <ShoppingBag className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No orders yet</p>
                  <p className="mt-1 text-sm text-slate-400">Customer orders will appear here once your store is live.</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">Your fabrics</h2>
                  <p className="mt-1 text-xs text-slate-400">What customers can choose from</p>
                </div>
                <Button variant="ghost" onClick={goToFabrics} className="px-2 text-xs">Manage <Pencil className="h-3.5 w-3.5" /></Button>
              </div>
              {fabrics.length ? (
                <div className="mt-4 space-y-2">{fabrics.slice(-5).reverse().map((fabric) => <FabricRow key={fabric.id} fabric={fabric} />)}</div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <Layers className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No fabrics yet</p>
                  <Button className="mt-4" icon={<Plus className="h-4 w-4" />} onClick={goToFabrics}>Add your first fabric</Button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </StoreLayout>
  );
}
