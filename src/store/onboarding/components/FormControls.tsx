import { useId, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { compressImage } from "../data";

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#DDEBF2] bg-white/95 p-5 shadow-[0_14px_34px_rgba(8,36,61,0.06)] sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#EAF8FE] text-[#0E7BC1]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#08243D]">{title}</h2>
          <p className="mt-0.5 text-[13px] text-[#65758A]">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Field({
  label,
  required = false,
  hint,
  error,
  className = "",
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-[13px] font-bold text-[#08243D]">
        {label}
        {required ? <span className="text-[#F26A21]"> *</span> : <span className="font-medium text-[#94A3AD]"> (optional)</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-[12px] font-semibold text-[#C94B43]" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] text-[#65758A]">{hint}</p>
      )}
    </div>
  );
}

export function ChipGroup({
  options,
  selected,
  onToggle,
  label,
  invalid = false,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  label: string;
  invalid?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label} aria-invalid={invalid || undefined}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={`min-h-9 rounded-full border px-3.5 text-[12.5px] font-bold transition ${
              active
                ? "mf-primary border-transparent"
                : `bg-white text-[#08243D] hover:border-[#0E7BC1]/50 ${invalid ? "border-[#C94B43]/60" : "border-[#DDEBF2]"}`
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function ImageDropzone({
  label,
  hint,
  aspectClass,
  value,
  onChange,
  maxSize,
  invalid = false,
  rounded = "rounded-[18px]",
}: {
  label: string;
  hint: string;
  aspectClass: string;
  value: string;
  onChange: (value: string) => void;
  maxSize: number;
  invalid?: boolean;
  rounded?: string;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await compressImage(file, maxSize));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload this image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="block cursor-pointer">
        <span className="sr-only">{label}</span>
        <div
          className={`mf-dropzone relative flex ${aspectClass} w-full items-center justify-center overflow-hidden border border-dashed ${rounded} ${
            invalid ? "border-[#C94B43]/70 bg-[#FFF0EF]" : "border-[#10B6D9]/55 bg-[#F4FBFD] hover:bg-[#EAF8FE]"
          } transition`}
        >
          {value ? (
            <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : (
            <div className="px-3 text-center">
              {busy ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0E7BC1]" />
              ) : (
                <ImagePlus className="mx-auto h-6 w-6 text-[#0E7BC1]" strokeWidth={1.8} />
              )}
              <p className="mt-2 text-[12.5px] font-bold text-[#08243D]">{busy ? "Processing…" : `Upload ${label.toLowerCase()}`}</p>
              <p className="mt-0.5 text-[11.5px] text-[#65758A]">{hint}</p>
            </div>
          )}
        </div>
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {value && (
        <div className="mt-2 flex gap-3 text-[12px] font-bold">
          <label htmlFor={inputId} className="cursor-pointer text-[#0E7BC1] hover:underline">
            Replace
          </label>
          <button type="button" onClick={() => onChange("")} className="text-[#C94B43] hover:underline">
            Remove
          </button>
        </div>
      )}
      {error && <p className="mt-1.5 text-[12px] font-semibold text-[#C94B43]">{error}</p>}
    </div>
  );
}

export function MultiImagePicker({
  images,
  onChange,
  max,
  invalid = false,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  max: number;
  invalid?: boolean;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    const room = max - images.length;
    setBusy(true);
    setError(files.length > room ? `Only ${max} photos are allowed per fabric.` : "");
    try {
      const compressed = await Promise.all(files.slice(0, room).map((file) => compressImage(file, 900, 0.76)));
      onChange([...images, ...compressed]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload these images.");
    } finally {
      setBusy(false);
    }
  };

  const makeCover = (index: number) => {
    onChange([images[index], ...images.filter((_, imageIndex) => imageIndex !== index)]);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <div key={`${index}-${image.slice(-24)}`} className="group relative aspect-square overflow-hidden rounded-[14px] border border-[#DDEBF2] bg-[#F4FBFD]">
            <img src={image} alt={`Fabric photo ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-[#0E7BC1]">
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(index)}
                className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9.5px] font-extrabold text-[#08243D] shadow-sm"
              >
                Set cover
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#C94B43] shadow-sm"
              aria-label={`Remove photo ${index + 1}`}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <label
            htmlFor={inputId}
            className={`mf-dropzone flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed text-center transition ${
              invalid ? "border-[#C94B43]/70 bg-[#FFF0EF]" : "border-[#10B6D9]/55 bg-[#F4FBFD] hover:bg-[#EAF8FE]"
            }`}
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#0E7BC1]" />
            ) : (
              <ImagePlus className="h-5 w-5 text-[#0E7BC1]" strokeWidth={1.8} />
            )}
            <span className="mt-1.5 px-1 text-[11px] font-bold text-[#08243D]">{busy ? "Adding…" : "Add photos"}</span>
            <span className="text-[10px] text-[#65758A]">
              {images.length}/{max}
            </span>
          </label>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="sr-only"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-[12px] font-semibold text-[#C94B43]">{error}</p>}
    </div>
  );
}
