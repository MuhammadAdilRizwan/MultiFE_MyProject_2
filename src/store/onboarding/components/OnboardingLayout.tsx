import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { storeBasePath } from "../data";

const steps = ["Store details", "Add fabrics", "Dashboard"];

type OnboardingLayoutProps = {
  currentStep: 1 | 2 | 3;
  children: ReactNode;
};

export default function OnboardingLayout({ currentStep, children }: OnboardingLayoutProps) {
  return (
    <div className="onboarding-theme min-h-screen text-[#08243D]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

        .onboarding-theme {
          font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          background:
            radial-gradient(circle at 8% 0%, rgba(16, 182, 217, 0.16), transparent 32%),
            radial-gradient(circle at 92% 6%, rgba(242, 106, 33, 0.09), transparent 28%),
            radial-gradient(circle at 4% 92%, rgba(120, 190, 67, 0.09), transparent 30%),
            linear-gradient(135deg, #F8FCFF 0%, #FFFFFF 46%, #FFF8EF 100%);
        }

        .onboarding-theme .mf-serif {
          font-family: "DM Serif Display", Georgia, serif;
          font-weight: 400;
        }

        .onboarding-theme .mf-input {
          width: 100%;
          min-height: 46px;
          border-radius: 14px;
          border: 1px solid #DDEBF2;
          background: #FFFFFF;
          padding: 10px 14px;
          font-size: 14px;
          color: #08243D;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .onboarding-theme .mf-input::placeholder { color: #94A3AD; }

        .onboarding-theme .mf-input:focus {
          border-color: #10B6D9;
          box-shadow: 0 0 0 3px rgba(16, 182, 217, 0.15);
        }

        .onboarding-theme .mf-input[aria-invalid="true"] {
          border-color: #C94B43;
          box-shadow: 0 0 0 3px rgba(201, 75, 67, 0.10);
        }

        .onboarding-theme .mf-primary {
          background: linear-gradient(135deg, #06365A 0%, #0E7BC1 58%, #10B6D9 100%);
          color: #FFFFFF;
          box-shadow: 0 12px 24px rgba(14, 123, 193, 0.22);
        }

        .onboarding-theme button:focus-visible,
        .onboarding-theme a:focus-visible,
        .onboarding-theme label:focus-within .mf-dropzone {
          outline: 2px solid rgba(14, 123, 193, 0.4);
          outline-offset: 2px;
        }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#DDEBF2] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a href={`${storeBasePath}/`} className="shrink-0" aria-label="MultiFe home">
            <span className="mf-serif block text-[26px] leading-none text-[#14213D] sm:text-[30px]">MultiFe</span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.22em] text-[#526172] sm:text-[9px]">
              Partner onboarding
            </span>
          </a>

          <ol className="flex items-center gap-1.5 sm:gap-3" aria-label="Setup progress">
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const done = stepNumber < currentStep;
              const active = stepNumber === currentStep;

              return (
                <li key={label} className="flex items-center gap-1.5 sm:gap-3">
                  {index > 0 && <span className={`h-px w-4 sm:w-8 ${done || active ? "bg-[#0E7BC1]" : "bg-[#DDEBF2]"}`} />}
                  <span className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
                        done || active ? "mf-primary" : "border border-[#DDEBF2] bg-white text-[#94A3AD]"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : stepNumber}
                    </span>
                    <span
                      className={`hidden text-[12.5px] font-bold md:inline ${active ? "text-[#08243D]" : "text-[#65758A]"}`}
                    >
                      {label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-8 sm:pt-10">{children}</main>
    </div>
  );
}
