import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryState = { error: Error | null };

// Shows a recoverable message instead of a blank page when any screen crashes.
export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("MultiFe screen crashed:", error, info.componentStack);
  }

  private resetSavedData = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("multife_"))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Storage may be unavailable; reloading is still worth trying.
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #F8FCFF 0%, #FFFFFF 46%, #FFF8EF 100%)" }}
      >
        <div className="w-full max-w-md rounded-[22px] border border-[#DDEBF2] bg-white p-7 text-center shadow-[0_18px_44px_rgba(8,36,61,0.08)]">
          <p className="text-[28px] text-[#14213D]" style={{ fontFamily: '"DM Serif Display", Georgia, serif' }}>
            MultiFe
          </p>
          <h1 className="mt-4 text-[18px] font-extrabold text-[#08243D]">Something went wrong on this page</h1>
          <p className="mt-2 text-[13.5px] leading-6 text-[#65758A]">
            Try reloading. If it keeps happening, reset the data saved in this browser.
          </p>
          <p className="mt-4 break-words rounded-[12px] bg-[#F4FBFD] px-3 py-2 text-left font-mono text-[11.5px] text-[#C94B43]">
            {this.state.error.message}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-11 rounded-[14px] px-5 text-[13.5px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #06365A 0%, #0E7BC1 58%, #10B6D9 100%)" }}
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={this.resetSavedData}
              className="h-11 rounded-[14px] border border-[#DDEBF2] bg-white px-5 text-[13.5px] font-bold text-[#08243D]"
            >
              Reset saved data
            </button>
          </div>
        </div>
      </div>
    );
  }
}
