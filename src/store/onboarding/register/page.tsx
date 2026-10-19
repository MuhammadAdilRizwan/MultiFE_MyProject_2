import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Clock3, ImageIcon, MapPin, Phone, ShieldCheck, Store } from "lucide-react";
import OnboardingLayout from "../components/OnboardingLayout";
import { ChipGroup, Field, ImageDropzone, SectionCard } from "../components/FormControls";
import {
  createId,
  getStoreProfile,
  goToStorePath,
  isValidEmail,
  isValidPakistaniMobile,
  normalizePhone,
  pakistanCities,
  saveStoreProfile,
  storePaymentMethods,
  storeBasePath,
  storeServices,
  storeSpecialties,
  storeTypes,
  toggleInList,
  weekDays,
  type StoreProfile,
} from "../data";

type FormState = Omit<StoreProfile, "id" | "createdAt" | "turnaroundMin" | "turnaroundMax" | "stitchingFrom"> & {
  turnaroundMin: string;
  turnaroundMax: string;
  stitchingFrom: string;
  whatsappSameAsPhone: boolean;
  acceptedTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  name: "",
  tagline: "",
  description: "",
  storeType: "Boutique",
  specialties: [],
  logo: "",
  banner: "",
  city: "",
  area: "",
  address: "",
  mapLink: "",
  ownerName: "",
  phone: "",
  whatsapp: "",
  email: "",
  openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  openTime: "11:00",
  closeTime: "21:00",
  turnaroundMin: "",
  turnaroundMax: "",
  stitchingFrom: "",
  services: ["In-store pickup"],
  paymentMethods: ["Cash on delivery"],
  registrationNumber: "",
  whatsappSameAsPhone: true,
  acceptedTerms: false,
};

function toFormState(profile: StoreProfile | null): FormState {
  if (!profile) return emptyForm;
  return {
    ...profile,
    turnaroundMin: String(profile.turnaroundMin),
    turnaroundMax: String(profile.turnaroundMax),
    stitchingFrom: String(profile.stitchingFrom),
    whatsappSameAsPhone: profile.whatsapp === profile.phone,
    acceptedTerms: true,
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const min = Number(form.turnaroundMin);
  const max = Number(form.turnaroundMax);

  if (form.name.trim().length < 2) errors.name = "Enter your store name.";
  if (!form.tagline.trim()) errors.tagline = "Add a short line that describes your store.";
  if (!form.specialties.length) errors.specialties = "Choose at least one speciality.";
  if (!form.logo) errors.logo = "Upload your store logo.";
  if (!form.banner) errors.banner = "Upload a banner image.";
  if (!form.city) errors.city = "Select your city.";
  if (!form.area.trim()) errors.area = "Enter the area or market.";
  if (form.address.trim().length < 8) errors.address = "Enter the full shop address.";
  if (form.mapLink.trim() && !/^https?:\/\//i.test(form.mapLink.trim())) errors.mapLink = "Paste a full link starting with https://";
  if (form.ownerName.trim().length < 2) errors.ownerName = "Enter the owner or manager name.";
  if (!isValidPakistaniMobile(form.phone)) errors.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  if (!form.whatsappSameAsPhone && !isValidPakistaniMobile(form.whatsapp)) errors.whatsapp = "Enter a valid WhatsApp number.";
  if (!isValidEmail(form.email)) errors.email = "Enter a valid email address.";
  if (!form.openDays.length) errors.openDays = "Select the days your store is open.";
  if (!form.openTime || !form.closeTime) errors.openTime = "Set your opening and closing time.";
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 1 || max < min || !form.turnaroundMin || !form.turnaroundMax) {
    errors.turnaroundMin = "Enter a valid range, e.g. 7 to 10 days.";
  }
  if (!(Number(form.stitchingFrom) > 0)) errors.stitchingFrom = "Enter your starting stitching price.";
  if (!form.services.length) errors.services = "Select at least one service.";
  if (!form.paymentMethods.length) errors.paymentMethods = "Select at least one payment method.";
  if (!form.acceptedTerms) errors.acceptedTerms = "Please confirm before continuing.";

  return errors;
}

export default function StoreRegisterPage() {
  const [existingProfile] = useState(getStoreProfile);
  const [form, setForm] = useState<FormState>(() => toFormState(existingProfile));
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");
  const errors = useMemo(() => (submitted ? validate(form) : {}), [form, submitted]);

  // Functional updates so async image uploads never overwrite fields typed meanwhile.
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggle = (key: "specialties" | "openDays" | "services" | "paymentMethods", value: string) => {
    setForm((current) => ({ ...current, [key]: toggleInList(current[key], value) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(form);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const phone = normalizePhone(form.phone);
    const profile: StoreProfile = {
      id: existingProfile?.id ?? createId("store"),
      createdAt: existingProfile?.createdAt ?? new Date().toISOString(),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      storeType: form.storeType,
      specialties: form.specialties,
      logo: form.logo,
      banner: form.banner,
      city: form.city,
      area: form.area.trim(),
      address: form.address.trim(),
      mapLink: form.mapLink.trim(),
      ownerName: form.ownerName.trim(),
      phone,
      whatsapp: form.whatsappSameAsPhone ? phone : normalizePhone(form.whatsapp),
      email: form.email.trim().toLowerCase(),
      openDays: weekDays.filter((day) => form.openDays.includes(day)),
      openTime: form.openTime,
      closeTime: form.closeTime,
      turnaroundMin: Number(form.turnaroundMin),
      turnaroundMax: Number(form.turnaroundMax),
      stitchingFrom: Number(form.stitchingFrom),
      services: form.services,
      paymentMethods: form.paymentMethods,
      registrationNumber: form.registrationNumber.trim(),
    };

    const storageError = saveStoreProfile(profile);
    if (storageError) {
      setSaveError(storageError);
      return;
    }

    goToStorePath("/store/fabrics/setup");
  };

  const errorCount = Object.keys(errors).length;

  return (
    <OnboardingLayout currentStep={1}>
      <div className="mx-auto max-w-3xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0E7BC1]">Step 1 of 3</p>
        <h1 className="mf-serif mt-2 text-[32px] leading-[1.1] text-[#14213D] sm:text-[42px]">Tell us about your store</h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-6 text-[#65758A]">
          These details appear on your outlet page so customers can find you, trust you and order custom outfits from your
          fabrics. You can update them later.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <SectionCard icon={Store} title="Store identity" description="How customers will see your store on MultiFe.">
            <Field label="Store name" required error={errors.name} htmlFor="store-name" className="sm:col-span-2">
              <input
                id="store-name"
                data-field="name"
                className="mf-input"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. Noor Couture"
                aria-invalid={Boolean(errors.name)}
                maxLength={60}
                autoComplete="organization"
              />
            </Field>

            <Field label="Store type" required htmlFor="store-type">
              <select
                id="store-type"
                className="mf-input"
                value={form.storeType}
                onChange={(event) => update("storeType", event.target.value as FormState["storeType"])}
              >
                {storeTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>

            <Field label="Tagline" required error={errors.tagline} hint="One short line, shown under your store name." htmlFor="store-tagline">
              <input
                id="store-tagline"
                data-field="tagline"
                className="mf-input"
                value={form.tagline}
                onChange={(event) => update("tagline", event.target.value)}
                placeholder="e.g. Bridal and festive wear with hand embroidery"
                aria-invalid={Boolean(errors.tagline)}
                maxLength={80}
              />
            </Field>

            <Field label="About your store" htmlFor="store-description" className="sm:col-span-2">
              <textarea
                id="store-description"
                className="mf-input min-h-28 resize-y"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Your story, the kind of fabrics you stock and what makes your stitching special."
                maxLength={500}
              />
            </Field>

            <Field label="Specialities" required error={errors.specialties} className="sm:col-span-2">
              <div data-field="specialties">
                <ChipGroup
                  label="Store specialities"
                  options={storeSpecialties}
                  selected={form.specialties}
                  onToggle={(value) => toggle("specialties", value)}
                  invalid={Boolean(errors.specialties)}
                />
              </div>
            </Field>
          </SectionCard>

          <SectionCard icon={ImageIcon} title="Branding" description="A clear logo and banner make your store look trustworthy.">
            <Field label="Logo" required error={errors.logo}>
              <div data-field="logo" className="max-w-[180px]">
                <ImageDropzone
                  label="Logo"
                  hint="Square, at least 400×400"
                  aspectClass="aspect-square"
                  value={form.logo}
                  onChange={(value) => update("logo", value)}
                  maxSize={480}
                  invalid={Boolean(errors.logo)}
                  rounded="rounded-[22px]"
                />
              </div>
            </Field>

            <Field label="Banner" required error={errors.banner}>
              <div data-field="banner">
                <ImageDropzone
                  label="Banner"
                  hint="Wide image, at least 1200×500"
                  aspectClass="aspect-[12/5]"
                  value={form.banner}
                  onChange={(value) => update("banner", value)}
                  maxSize={1400}
                  invalid={Boolean(errors.banner)}
                />
              </div>
            </Field>
          </SectionCard>

          <SectionCard icon={MapPin} title="Location" description="Where customers can visit you for measurements.">
            <Field label="City" required error={errors.city} htmlFor="store-city">
              <select
                id="store-city"
                data-field="city"
                className="mf-input"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                aria-invalid={Boolean(errors.city)}
              >
                <option value="" disabled>
                  Select city
                </option>
                {pakistanCities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </Field>

            <Field label="Area / market" required error={errors.area} htmlFor="store-area">
              <input
                id="store-area"
                data-field="area"
                className="mf-input"
                value={form.area}
                onChange={(event) => update("area", event.target.value)}
                placeholder="e.g. Liberty Market"
                aria-invalid={Boolean(errors.area)}
              />
            </Field>

            <Field label="Full address" required error={errors.address} htmlFor="store-address" className="sm:col-span-2">
              <input
                id="store-address"
                data-field="address"
                className="mf-input"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                placeholder="Shop number, building, street"
                aria-invalid={Boolean(errors.address)}
                autoComplete="street-address"
              />
            </Field>

            <Field
              label="Google Maps link"
              error={errors.mapLink}
              hint="Helps customers get directions to your shop."
              htmlFor="store-map"
              className="sm:col-span-2"
            >
              <input
                id="store-map"
                data-field="mapLink"
                type="url"
                className="mf-input"
                value={form.mapLink}
                onChange={(event) => update("mapLink", event.target.value)}
                placeholder="https://maps.google.com/…"
                aria-invalid={Boolean(errors.mapLink)}
              />
            </Field>
          </SectionCard>

          <SectionCard icon={Phone} title="Contact details" description="We share order updates and customer requests here.">
            <Field label="Owner / manager name" required error={errors.ownerName} htmlFor="store-owner" className="sm:col-span-2">
              <input
                id="store-owner"
                data-field="ownerName"
                className="mf-input"
                value={form.ownerName}
                onChange={(event) => update("ownerName", event.target.value)}
                placeholder="Full name"
                aria-invalid={Boolean(errors.ownerName)}
                autoComplete="name"
              />
            </Field>

            <Field label="Mobile number" required error={errors.phone} htmlFor="store-phone">
              <input
                id="store-phone"
                data-field="phone"
                type="tel"
                inputMode="tel"
                className="mf-input"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="0300 1234567"
                aria-invalid={Boolean(errors.phone)}
                autoComplete="tel"
              />
            </Field>

            <Field label="Email" required error={errors.email} htmlFor="store-email">
              <input
                id="store-email"
                data-field="email"
                type="email"
                inputMode="email"
                className="mf-input"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="store@example.com"
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
              />
            </Field>

            <div className="sm:col-span-2" data-field="whatsapp">
              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-[#08243D]">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#0E7BC1]"
                  checked={form.whatsappSameAsPhone}
                  onChange={(event) => update("whatsappSameAsPhone", event.target.checked)}
                />
                WhatsApp is on the same number
              </label>
              {!form.whatsappSameAsPhone && (
                <Field label="WhatsApp number" required error={errors.whatsapp} htmlFor="store-whatsapp" className="mt-4">
                  <input
                    id="store-whatsapp"
                    type="tel"
                    inputMode="tel"
                    className="mf-input"
                    value={form.whatsapp}
                    onChange={(event) => update("whatsapp", event.target.value)}
                    placeholder="0300 1234567"
                    aria-invalid={Boolean(errors.whatsapp)}
                  />
                </Field>
              )}
            </div>
          </SectionCard>

          <SectionCard icon={Clock3} title="Timings & services" description="Sets customer expectations before they order.">
            <Field label="Open days" required error={errors.openDays} className="sm:col-span-2">
              <div data-field="openDays">
                <ChipGroup
                  label="Open days"
                  options={weekDays}
                  selected={form.openDays}
                  onToggle={(value) => toggle("openDays", value)}
                  invalid={Boolean(errors.openDays)}
                />
              </div>
            </Field>

            <Field label="Store hours" required error={errors.openTime} className="sm:col-span-2">
              <div data-field="openTime" className="grid grid-cols-2 gap-3 sm:max-w-sm">
                <input
                  type="time"
                  className="mf-input"
                  value={form.openTime}
                  onChange={(event) => update("openTime", event.target.value)}
                  aria-label="Opening time"
                />
                <input
                  type="time"
                  className="mf-input"
                  value={form.closeTime}
                  onChange={(event) => update("closeTime", event.target.value)}
                  aria-label="Closing time"
                />
              </div>
            </Field>

            <Field label="Stitching time (days)" required error={errors.turnaroundMin} hint="Shown to customers as delivery estimate.">
              <div data-field="turnaroundMin" className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  className="mf-input"
                  value={form.turnaroundMin}
                  onChange={(event) => update("turnaroundMin", event.target.value)}
                  placeholder="7"
                  aria-label="Minimum days"
                  aria-invalid={Boolean(errors.turnaroundMin)}
                />
                <span className="text-[13px] font-semibold text-[#65758A]">to</span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  className="mf-input"
                  value={form.turnaroundMax}
                  onChange={(event) => update("turnaroundMax", event.target.value)}
                  placeholder="10"
                  aria-label="Maximum days"
                  aria-invalid={Boolean(errors.turnaroundMin)}
                />
              </div>
            </Field>

            <Field label="Stitching starts from (PKR)" required error={errors.stitchingFrom} htmlFor="store-stitching">
              <input
                id="store-stitching"
                data-field="stitchingFrom"
                type="number"
                min={1}
                inputMode="numeric"
                className="mf-input"
                value={form.stitchingFrom}
                onChange={(event) => update("stitchingFrom", event.target.value)}
                placeholder="2500"
                aria-invalid={Boolean(errors.stitchingFrom)}
              />
            </Field>

            <Field label="Services offered" required error={errors.services} className="sm:col-span-2">
              <div data-field="services">
                <ChipGroup
                  label="Services offered"
                  options={storeServices}
                  selected={form.services}
                  onToggle={(value) => toggle("services", value)}
                  invalid={Boolean(errors.services)}
                />
              </div>
            </Field>

            <Field label="Payment methods accepted" required error={errors.paymentMethods} className="sm:col-span-2">
              <div data-field="paymentMethods">
                <ChipGroup
                  label="Payment methods accepted"
                  options={storePaymentMethods}
                  selected={form.paymentMethods}
                  onToggle={(value) => toggle("paymentMethods", value)}
                  invalid={Boolean(errors.paymentMethods)}
                />
              </div>
            </Field>
          </SectionCard>

          <SectionCard icon={ShieldCheck} title="Business verification" description="Helps us verify your store before it goes live.">
            <Field
              label="NTN / business registration no."
              hint="Optional now, required before payouts."
              htmlFor="store-ntn"
              className="sm:col-span-2"
            >
              <input
                id="store-ntn"
                className="mf-input sm:max-w-sm"
                value={form.registrationNumber}
                onChange={(event) => update("registrationNumber", event.target.value)}
                placeholder="e.g. 1234567-8"
              />
            </Field>

            <div className="sm:col-span-2" data-field="acceptedTerms">
              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-5 text-[#08243D]">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#0E7BC1]"
                  checked={form.acceptedTerms}
                  onChange={(event) => update("acceptedTerms", event.target.checked)}
                  aria-invalid={Boolean(errors.acceptedTerms)}
                />
                <span>
                  I confirm these details are accurate and agree to the MultiFe partner terms and order policies.
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="mt-1.5 text-[12px] font-semibold text-[#C94B43]" role="alert">
                  {errors.acceptedTerms}
                </p>
              )}
            </div>
          </SectionCard>

          {(saveError || (submitted && errorCount > 0)) && (
            <div className="rounded-[16px] border border-[#C94B43]/30 bg-[#FFF0EF] px-4 py-3 text-[13px] font-semibold text-[#C94B43]" role="alert">
              {saveError || `Please fix ${errorCount} ${errorCount === 1 ? "field" : "fields"} highlighted above.`}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#DDEBF2] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`${storeBasePath}/`}
              className="text-center text-[13.5px] font-bold text-[#65758A] hover:text-[#0E7BC1]"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="mf-primary inline-flex h-12 items-center justify-center gap-2 rounded-[14px] px-7 text-[14.5px] font-bold transition hover:brightness-105"
            >
              Save & continue to fabrics
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
