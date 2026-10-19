import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Layers,
  MapPin,
  Pencil,
  Plus,
  Store,
  Trash2,
} from "lucide-react";
import OnboardingLayout from "../components/OnboardingLayout";
import { ChipGroup, Field, MultiImagePicker } from "../components/FormControls";
import {
  createId,
  fabricBestFor,
  fabricCategories,
  fabricColorHex,
  fabricColors,
  fabricMaterials,
  fabricOccasions,
  formatPkr,
  getStoreFabrics,
  getStoreProfile,
  goToStorePath,
  OTHER_OPTION,
  resolveChoice,
  saveStoreFabrics,
  splitChoice,
  storeBasePath,
  toggleInList,
  toTitleCase,
  type FabricStatus,
  type StoreFabric,
  type StoreProfile,
} from "../data";

type FabricForm = Omit<StoreFabric, "id" | "pricePerYard" | "recommendedYards" | "stitchingFrom" | "stockYards"> & {
  pricePerYard: string;
  recommendedYards: string;
  stitchingFrom: string;
  stockYards: string;
  // Free text typed when "Other" is chosen in the matching dropdown.
  materialOther: string;
  categoryOther: string;
  colorOther: string;
  occasionOther: string;
};

type FabricErrors = Partial<Record<keyof FabricForm, string>>;

const MAX_PHOTOS = 5;

function createEmptyFabric(store: StoreProfile | null): FabricForm {
  return {
    name: "",
    material: "",
    category: "",
    color: "",
    occasion: "",
    pricePerYard: "",
    recommendedYards: "3",
    stitchingFrom: store ? String(store.stitchingFrom) : "",
    stockYards: "",
    texture: "",
    description: "",
    bestFor: [],
    care: "",
    images: [],
    status: "Active",
    materialOther: "",
    categoryOther: "",
    colorOther: "",
    occasionOther: "",
  };
}

function toFabricForm(fabric: StoreFabric): FabricForm {
  const material = splitChoice(fabric.material, fabricMaterials);
  const category = splitChoice(fabric.category, fabricCategories);
  const color = splitChoice(fabric.color, fabricColors);
  const occasion = splitChoice(fabric.occasion, fabricOccasions);

  return {
    ...fabric,
    pricePerYard: String(fabric.pricePerYard),
    recommendedYards: String(fabric.recommendedYards),
    stitchingFrom: String(fabric.stitchingFrom),
    stockYards: String(fabric.stockYards),
    material: material.selected,
    materialOther: material.other,
    category: category.selected,
    categoryOther: category.other,
    color: color.selected,
    colorOther: color.other,
    occasion: occasion.selected,
    occasionOther: occasion.other,
  };
}

function needsOtherText(selected: string, otherText: string) {
  return selected === OTHER_OPTION && otherText.trim().length < 2;
}

function validateFabric(form: FabricForm): FabricErrors {
  const errors: FabricErrors = {};
  if (!form.images.length) errors.images = "Add at least one clear photo of the fabric.";
  if (form.name.trim().length < 2) errors.name = "Enter the fabric name.";
  if (!form.material) errors.material = "Select the material.";
  if (needsOtherText(form.material, form.materialOther)) errors.materialOther = "Type the material name.";
  if (!form.category) errors.category = "Select a category.";
  if (needsOtherText(form.category, form.categoryOther)) errors.categoryOther = "Type the category name.";
  if (!form.color) errors.color = "Pick the main colour.";
  if (needsOtherText(form.color, form.colorOther)) errors.colorOther = "Type the colour name.";
  if (!form.occasion) errors.occasion = "Select an occasion.";
  if (needsOtherText(form.occasion, form.occasionOther)) errors.occasionOther = "Type the occasion.";
  if (!(Number(form.pricePerYard) > 0)) errors.pricePerYard = "Enter the price per yard.";
  if (!(Number(form.recommendedYards) > 0)) errors.recommendedYards = "Enter yards needed for one outfit.";
  if (!(Number(form.stitchingFrom) >= 0) || form.stitchingFrom === "") errors.stitchingFrom = "Enter the stitching price.";
  if (!(Number(form.stockYards) >= 0) || form.stockYards === "") errors.stockYards = "Enter how many yards you have.";
  if (form.description.trim().length < 10) errors.description = "Describe the fabric in a sentence or two.";
  if (!form.bestFor.length) errors.bestFor = "Choose at least one outfit type.";
  return errors;
}

type OtherInputProps = {
  field: keyof FabricForm;
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
};

// Text box shown under a dropdown when "Other" is picked; previews the capitalised value that will be saved.
function OtherInput({ field, label, value, error, placeholder, onChange }: OtherInputProps) {
  const id = `fabric-${field}`;
  const preview = toTitleCase(value);

  return (
    <div className="mt-2.5">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        data-field={field}
        className="mf-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        maxLength={40}
        autoComplete="off"
      />
      {error ? (
        <p className="mt-1.5 text-[12px] font-semibold text-[#C94B43]" role="alert">
          {error}
        </p>
      ) : (
        preview && (
          <p className="mt-1.5 text-[12px] text-[#65758A]">
            Will be saved as <span className="font-bold text-[#08243D]">{preview}</span>
          </p>
        )
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  error,
  field,
  onChange,
  other,
}: {
  label: string;
  value: string;
  options: string[];
  error?: string;
  field: keyof FabricForm;
  onChange: (value: string) => void;
  other: OtherInputProps;
}) {
  const id = `fabric-${field}`;
  return (
    <Field label={label} required error={error} htmlFor={id}>
      <select
        id={id}
        data-field={field}
        className="mf-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {value === OTHER_OPTION && <OtherInput {...other} />}
    </Field>
  );
}

// Shows a typed custom colour (e.g. "maroon") when the browser recognises it; otherwise a neutral swatch.
function getSwatchColor(colorName: string) {
  if (fabricColorHex[colorName]) return fabricColorHex[colorName];
  const candidate = colorName.trim().toLowerCase().replace(/\s+/g, "");
  return candidate && typeof CSS !== "undefined" && CSS.supports("color", candidate) ? candidate : "";
}

function ColorSwatch({ color, size = "h-5 w-5" }: { color: string; size?: string }) {
  const swatch = getSwatchColor(color);
  return (
    <span
      className={`${size} shrink-0 rounded-full border ${swatch ? "border-[#DDEBF2]" : "border-dashed border-[#94A3AD] bg-[#F4FBFD]"}`}
      style={swatch ? { background: swatch } : undefined}
      aria-hidden="true"
    />
  );
}

function ColorSelect({
  value,
  otherValue,
  error,
  onChange,
}: {
  value: string;
  otherValue: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const triggerId = "fabric-color";

  // Close when clicking anywhere outside the dropdown.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Move focus to the chosen (or first) option as soon as the list opens.
  useEffect(() => {
    if (!open) return;
    const options = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    const selected = containerRef.current?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]');
    (selected ?? options?.[0])?.focus();
  }, [open]);

  const choose = (color: string) => {
    onChange(color);
    setOpen(false);
    containerRef.current?.querySelector<HTMLButtonElement>(`#${triggerId}`)?.focus();
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []);
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      options[(index + step + options.length) % options.length]?.focus();
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  const displayName = value === OTHER_OPTION ? toTitleCase(otherValue) || "Other colour" : value;

  return (
    <div ref={containerRef} className="relative">
      <button
        id={triggerId}
        type="button"
        data-field="color"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="mf-input flex items-center gap-2.5 text-left"
      >
        {value ? (
          <>
            <ColorSwatch color={value === OTHER_OPTION ? otherValue : value} />
            <span className="min-w-0 flex-1 truncate">{displayName}</span>
          </>
        ) : (
          <span className="flex-1 text-[#94A3AD]">Select colour</span>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#65758A] transition ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Main colour"
          onKeyDown={handleListKeyDown}
          className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-[16px] border border-[#DDEBF2] bg-white p-1.5 shadow-[0_18px_40px_rgba(8,36,61,0.14)]"
        >
          {fabricColors.map((color) => {
            const selected = value === color;
            return (
              <button
                key={color}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => choose(color)}
                className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left text-[13.5px] font-semibold text-[#08243D] outline-none hover:bg-[#F4FBFD] focus-visible:bg-[#EAF8FE] ${
                  selected ? "bg-[#EAF8FE]" : ""
                }`}
              >
                <ColorSwatch color={color === OTHER_OPTION ? "" : color} size="h-6 w-6" />
                <span className="flex-1">{color === OTHER_OPTION ? "Other colour…" : color}</span>
                {selected && <Check className="h-4 w-4 text-[#0E7BC1]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StoreSummary({ store }: { store: StoreProfile }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#DDEBF2] bg-white shadow-[0_14px_34px_rgba(8,36,61,0.06)]">
      <div className="relative h-28 bg-[#EAF8FE] sm:h-36">
        {store.banner && <img src={store.banner} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex items-end gap-4">
          <div className="relative z-10 -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-[20px] border-4 border-white bg-white shadow-[0_10px_22px_rgba(8,36,61,0.12)]">
            {store.logo && <img src={store.logo} alt={`${store.name} logo`} className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 pb-0.5 pt-3">
            <h2 className="truncate text-[19px] font-extrabold tracking-[-0.02em] text-[#08243D]">{store.name}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-[12.5px] font-semibold text-[#65758A]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0E7BC1]" strokeWidth={2} />
              {store.area}, {store.city}
            </p>
          </div>
        </div>
        <a
          href={`${storeBasePath}/store/register`}
          className="inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-[12px] border border-[#DDEBF2] bg-white px-4 text-[12.5px] font-bold text-[#0E7BC1] hover:bg-[#F4FBFD] sm:self-auto"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
          Edit store details
        </a>
      </div>
    </div>
  );
}

function FabricListItem({
  fabric,
  editing,
  onEdit,
  onRemove,
}: {
  fabric: StoreFabric;
  editing: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <li
      className={`flex gap-3 rounded-[16px] border bg-white p-2.5 ${
        editing ? "border-[#10B6D9] shadow-[0_0_0_3px_rgba(16,182,217,0.12)]" : "border-[#DDEBF2]"
      }`}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#F4FBFD]">
        <img src={fabric.images[0]} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[13.5px] font-extrabold text-[#08243D]">{fabric.name}</p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              fabric.status === "Active" ? "bg-[#EEF9E8] text-[#5B9832]" : "bg-[#FFF5E8] text-[#F26A21]"
            }`}
          >
            {fabric.status}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-[#65758A]">
          {fabric.material} · {fabric.category} · {fabric.color}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-[12px] font-bold text-[#08243D]">{formatPkr(fabric.pricePerYard)} / yd</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#0E7BC1] hover:bg-[#EAF8FE]"
              aria-label={`Edit ${fabric.name}`}
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#C94B43] hover:bg-[#FFF0EF]"
              aria-label={`Remove ${fabric.name}`}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function StoreFabricsSetupPage() {
  const [store] = useState(getStoreProfile);
  const [fabrics, setFabrics] = useState<StoreFabric[]>(getStoreFabrics);
  const [form, setForm] = useState<FabricForm>(() => createEmptyFabric(store));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const [finishError, setFinishError] = useState("");
  const errors: FabricErrors = useMemo(() => (submitted ? validateFabric(form) : {}), [form, submitted]);

  if (!store) {
    return (
      <OnboardingLayout currentStep={1}>
        <div className="mx-auto max-w-lg rounded-[24px] border border-[#DDEBF2] bg-white px-6 py-10 text-center shadow-[0_14px_34px_rgba(8,36,61,0.06)]">
          <Store className="mx-auto h-9 w-9 text-[#0E7BC1]" strokeWidth={1.7} />
          <h1 className="mf-serif mt-4 text-[28px] text-[#14213D]">Register your store first</h1>
          <p className="mt-2 text-[14px] text-[#65758A]">Add your store details before uploading fabrics.</p>
          <button
            type="button"
            onClick={() => goToStorePath("/store/register")}
            className="mf-primary mt-6 inline-flex h-12 items-center gap-2 rounded-[14px] px-6 text-[14px] font-bold"
          >
            Add store details
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // Functional updates so async photo uploads never overwrite fields typed meanwhile.
  const update = <K extends keyof FabricForm>(key: K, value: FabricForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const persist = (nextFabrics: StoreFabric[]) => {
    const error = saveStoreFabrics(nextFabrics);
    setStorageError(error ?? "");
    if (!error) setFabrics(nextFabrics);
    return !error;
  };

  const resetForm = () => {
    setForm(createEmptyFabric(store));
    setEditingId(null);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateFabric(form);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const { materialOther, categoryOther, colorOther, occasionOther, ...fields } = form;
    const fabric: StoreFabric = {
      ...fields,
      id: editingId ?? createId("fabric"),
      material: resolveChoice(form.material, materialOther),
      category: resolveChoice(form.category, categoryOther),
      color: resolveChoice(form.color, colorOther),
      occasion: resolveChoice(form.occasion, occasionOther),
      name: form.name.trim(),
      texture: form.texture.trim(),
      description: form.description.trim(),
      care: form.care.trim(),
      pricePerYard: Number(form.pricePerYard),
      recommendedYards: Number(form.recommendedYards),
      stitchingFrom: Number(form.stitchingFrom),
      stockYards: Number(form.stockYards),
    };

    const nextFabrics = editingId
      ? fabrics.map((item) => (item.id === editingId ? fabric : item))
      : [...fabrics, fabric];

    if (persist(nextFabrics)) {
      setNotice(editingId ? `${fabric.name} updated.` : `${fabric.name} added to your store.`);
      setFinishError("");
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startEdit = (fabric: StoreFabric) => {
    setForm(toFabricForm(fabric));
    setEditingId(fabric.id);
    setSubmitted(false);
    setNotice("");
    document.getElementById("fabric-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const removeFabric = (fabric: StoreFabric) => {
    if (!window.confirm(`Remove ${fabric.name} from your store?`)) return;
    if (persist(fabrics.filter((item) => item.id !== fabric.id))) {
      if (editingId === fabric.id) resetForm();
      setNotice(`${fabric.name} removed.`);
    }
  };

  const finishSetup = () => {
    if (!fabrics.length) {
      setFinishError("Add at least one fabric before finishing setup.");
      return;
    }
    goToStorePath("/store?welcome=1");
  };

  const errorCount = Object.keys(errors).length;

  return (
    <OnboardingLayout currentStep={2}>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0E7BC1]">Step 2 of 3</p>
      <h1 className="mf-serif mt-2 text-[32px] leading-[1.1] text-[#14213D] sm:text-[42px]">Add your fabrics</h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-6 text-[#65758A]">
        Customers choose from these fabrics when designing their outfit. Clear photos and accurate prices help them order
        with confidence.
      </p>

      <div className="mt-6">
        <StoreSummary store={store} />
      </div>

      {notice && (
        <div className="mt-5 flex items-center gap-2 rounded-[14px] border border-[#78BE43]/40 bg-[#EEF9E8] px-4 py-3 text-[13px] font-semibold text-[#5B9832]" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          {notice}
        </div>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          id="fabric-form"
          onSubmit={handleSubmit}
          noValidate
          className="scroll-mt-24 rounded-[22px] border border-[#DDEBF2] bg-white/95 p-5 shadow-[0_14px_34px_rgba(8,36,61,0.06)] sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#EAF8FE] text-[#0E7BC1]">
              <Layers className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#08243D]">
                {editingId ? "Edit fabric" : "New fabric"}
              </h2>
              <p className="mt-0.5 text-[13px] text-[#65758A]">Fields marked * are required.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="Photos"
              required
              error={errors.images}
              hint={`Up to ${MAX_PHOTOS} photos. The first one is used as the cover.`}
              className="sm:col-span-2"
            >
              <div data-field="images">
                <MultiImagePicker
                  images={form.images}
                  onChange={(images) => update("images", images)}
                  max={MAX_PHOTOS}
                  invalid={Boolean(errors.images)}
                />
              </div>
            </Field>

            <Field label="Fabric name" required error={errors.name} htmlFor="fabric-name" className="sm:col-span-2">
              <input
                id="fabric-name"
                data-field="name"
                className="mf-input"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. Premium Lawn Blue Bloom"
                aria-invalid={Boolean(errors.name)}
                maxLength={60}
              />
            </Field>

            <SelectField
              label="Material"
              field="material"
              value={form.material}
              options={fabricMaterials}
              error={errors.material}
              onChange={(value) => update("material", value)}
              other={{
                field: "materialOther",
                label: "Other material",
                value: form.materialOther,
                error: errors.materialOther,
                placeholder: "Type the material, e.g. Raw silk",
                onChange: (value) => update("materialOther", value),
              }}
            />
            <SelectField
              label="Category"
              field="category"
              value={form.category}
              options={fabricCategories}
              error={errors.category}
              onChange={(value) => update("category", value)}
              other={{
                field: "categoryOther",
                label: "Other category",
                value: form.categoryOther,
                error: errors.categoryOther,
                placeholder: "Type the category, e.g. Bridal",
                onChange: (value) => update("categoryOther", value),
              }}
            />

            <Field label="Main colour" required error={errors.color} htmlFor="fabric-color">
              <ColorSelect
                value={form.color}
                otherValue={form.colorOther}
                error={errors.color}
                onChange={(value) => update("color", value)}
              />
              {form.color === OTHER_OPTION && (
                <OtherInput
                  field="colorOther"
                  label="Other colour"
                  value={form.colorOther}
                  error={errors.colorOther}
                  placeholder="Type the colour, e.g. Maroon"
                  onChange={(value) => update("colorOther", value)}
                />
              )}
            </Field>

            <SelectField
              label="Occasion"
              field="occasion"
              value={form.occasion}
              options={fabricOccasions}
              error={errors.occasion}
              onChange={(value) => update("occasion", value)}
              other={{
                field: "occasionOther",
                label: "Other occasion",
                value: form.occasionOther,
                error: errors.occasionOther,
                placeholder: "Type the occasion, e.g. Mehndi",
                onChange: (value) => update("occasionOther", value),
              }}
            />

            <Field label="Texture" hint="e.g. Soft, breathable, light sheen" htmlFor="fabric-texture">
              <input
                id="fabric-texture"
                className="mf-input"
                value={form.texture}
                onChange={(event) => update("texture", event.target.value)}
                placeholder="Soft and breathable"
                maxLength={60}
              />
            </Field>

            <Field label="Price per yard (PKR)" required error={errors.pricePerYard} htmlFor="fabric-price">
              <input
                id="fabric-price"
                data-field="pricePerYard"
                type="number"
                min={1}
                inputMode="numeric"
                className="mf-input"
                value={form.pricePerYard}
                onChange={(event) => update("pricePerYard", event.target.value)}
                placeholder="1850"
                aria-invalid={Boolean(errors.pricePerYard)}
              />
            </Field>

            <Field label="Yards per outfit" required error={errors.recommendedYards} hint="Typical yards for one suit." htmlFor="fabric-yards">
              <input
                id="fabric-yards"
                data-field="recommendedYards"
                type="number"
                min={0.5}
                step={0.5}
                inputMode="decimal"
                className="mf-input"
                value={form.recommendedYards}
                onChange={(event) => update("recommendedYards", event.target.value)}
                aria-invalid={Boolean(errors.recommendedYards)}
              />
            </Field>

            <Field label="Stitching from (PKR)" required error={errors.stitchingFrom} htmlFor="fabric-stitching">
              <input
                id="fabric-stitching"
                data-field="stitchingFrom"
                type="number"
                min={0}
                inputMode="numeric"
                className="mf-input"
                value={form.stitchingFrom}
                onChange={(event) => update("stitchingFrom", event.target.value)}
                aria-invalid={Boolean(errors.stitchingFrom)}
              />
            </Field>

            <Field label="Stock available (yards)" required error={errors.stockYards} htmlFor="fabric-stock">
              <input
                id="fabric-stock"
                data-field="stockYards"
                type="number"
                min={0}
                inputMode="numeric"
                className="mf-input"
                value={form.stockYards}
                onChange={(event) => update("stockYards", event.target.value)}
                placeholder="120"
                aria-invalid={Boolean(errors.stockYards)}
              />
            </Field>

            <Field label="Description" required error={errors.description} htmlFor="fabric-description" className="sm:col-span-2">
              <textarea
                id="fabric-description"
                data-field="description"
                className="mf-input min-h-24 resize-y"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="What it feels like, how it drapes and why customers will love it."
                aria-invalid={Boolean(errors.description)}
                maxLength={400}
              />
            </Field>

            <Field label="Best for" required error={errors.bestFor} className="sm:col-span-2">
              <div data-field="bestFor">
                <ChipGroup
                  label="Best for"
                  options={fabricBestFor}
                  selected={form.bestFor}
                  onToggle={(value) => setForm((current) => ({ ...current, bestFor: toggleInList(current.bestFor, value) }))}
                  invalid={Boolean(errors.bestFor)}
                />
              </div>
            </Field>

            <Field label="Care instructions" htmlFor="fabric-care" className="sm:col-span-2">
              <input
                id="fabric-care"
                className="mf-input"
                value={form.care}
                onChange={(event) => update("care", event.target.value)}
                placeholder="e.g. Gentle hand wash, iron on medium heat"
                maxLength={120}
              />
            </Field>

            <Field label="Visibility" required className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2 sm:max-w-sm" role="radiogroup" aria-label="Visibility">
                {(["Active", "Draft"] as FabricStatus[]).map((status) => {
                  const active = form.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => update("status", status)}
                      className={`rounded-[14px] border px-3 py-2.5 text-left transition ${
                        active ? "border-[#0E7BC1] bg-[#EAF8FE]" : "border-[#DDEBF2] bg-white hover:border-[#0E7BC1]/50"
                      }`}
                    >
                      <span className="block text-[13px] font-extrabold text-[#08243D]">{status}</span>
                      <span className="block text-[11.5px] text-[#65758A]">
                        {status === "Active" ? "Visible to customers" : "Hidden for now"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {(storageError || (submitted && errorCount > 0)) && (
            <div className="mt-5 rounded-[14px] border border-[#C94B43]/30 bg-[#FFF0EF] px-4 py-3 text-[13px] font-semibold text-[#C94B43]" role="alert">
              {storageError || `Please fix ${errorCount} ${errorCount === 1 ? "field" : "fields"} highlighted above.`}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#DDEBF2] pt-5 sm:flex-row sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="h-11 rounded-[14px] border border-[#DDEBF2] bg-white px-5 text-[13.5px] font-bold text-[#08243D] hover:bg-[#F4FBFD]"
              >
                Cancel edit
              </button>
            )}
            <button
              type="submit"
              className="mf-primary inline-flex h-11 items-center justify-center gap-2 rounded-[14px] px-6 text-[13.5px] font-bold"
            >
              {editingId ? (
                "Save changes"
              ) : (
                <>
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                  Add fabric
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="rounded-[22px] border border-[#DDEBF2] bg-white/95 p-5 shadow-[0_14px_34px_rgba(8,36,61,0.06)] lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#08243D]">Your fabrics</h2>
            <span className="rounded-full bg-[#EAF8FE] px-2.5 py-1 text-[11.5px] font-extrabold text-[#0E7BC1]">{fabrics.length}</span>
          </div>

          {fabrics.length ? (
            <ul className="mt-4 max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
              {fabrics.map((fabric) => (
                <FabricListItem
                  key={fabric.id}
                  fabric={fabric}
                  editing={editingId === fabric.id}
                  onEdit={() => startEdit(fabric)}
                  onRemove={() => removeFabric(fabric)}
                />
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-[16px] border border-dashed border-[#DDEBF2] bg-[#F4FBFD] px-4 py-8 text-center">
              <Layers className="mx-auto h-7 w-7 text-[#94A3AD]" strokeWidth={1.7} />
              <p className="mt-2 text-[13px] font-bold text-[#08243D]">No fabrics yet</p>
              <p className="mt-1 text-[12px] text-[#65758A]">Fabrics you add will appear here.</p>
            </div>
          )}

          {finishError && (
            <p className="mt-4 text-[12.5px] font-semibold text-[#C94B43]" role="alert">
              {finishError}
            </p>
          )}

          <button
            type="button"
            onClick={finishSetup}
            className="mf-primary mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-[14px] font-bold"
          >
            Finish & go to dashboard
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => goToStorePath("/store/register")}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#65758A] hover:text-[#0E7BC1]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            Back to store details
          </button>
        </aside>
      </div>
    </OnboardingLayout>
  );
}
