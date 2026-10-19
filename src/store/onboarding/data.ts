import { normalizeCustomizations, type FabricCustomizations } from "../../shared/customizationCatalog";

export type StoreType = "Boutique" | "Fabric Shop" | "Tailoring Studio" | "Designer Label";

export type StoreProfile = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  storeType: StoreType;
  specialties: string[];
  logo: string;
  banner: string;
  city: string;
  area: string;
  address: string;
  mapLink: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  openDays: string[];
  openTime: string;
  closeTime: string;
  turnaroundMin: number;
  turnaroundMax: number;
  stitchingFrom: number;
  services: string[];
  paymentMethods: string[];
  registrationNumber: string;
  createdAt: string;
};

export type FabricStatus = "Active" | "Draft";

export type StoreFabric = {
  id: string;
  name: string;
  material: string;
  category: string;
  color: string;
  occasion: string;
  pricePerYard: number;
  recommendedYards: number;
  stitchingFrom: number;
  stockYards: number;
  texture: string;
  description: string;
  bestFor: string[];
  care: string;
  images: string[];
  status: FabricStatus;
  // Customization options the customer may choose for this fabric, keyed by catalog group id.
  customizations: FabricCustomizations;
};

// Option lists mirror the customer fabric library so registered fabrics can feed it later.
export const storeTypes: StoreType[] = ["Boutique", "Fabric Shop", "Tailoring Studio", "Designer Label"];

export const storeSpecialties = [
  "Lawn",
  "Cotton",
  "Silk",
  "Linen",
  "Everyday",
  "Formal",
  "Pret",
  "Festive",
  "Bridal",
  "Embroidered",
  "Winter",
];

export const pakistanCities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Other",
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const storeServices = ["In-store pickup", "Home delivery", "Alterations", "Home measurement visit"];

export const storePaymentMethods = ["Cash on delivery", "Debit / credit card", "Bank transfer", "JazzCash / Easypaisa"];

export const fabricMaterials = ["Lawn", "Cotton", "Silk", "Chiffon", "Linen", "Net", "Organza", "Velvet", "Khaddar", "Other"];

export const OTHER_OPTION = "Other";

export const fabricCategories = ["Everyday", "Lightweight", "Luxury", "Formal", "Festive", "Premium", "Sheer", OTHER_OPTION];

export const fabricColors = ["Cream", "Pink", "Gold", "Navy", "Mint", "Purple", "Beige", "White", OTHER_OPTION];

export const fabricOccasions = ["Daily Wear", "Summer", "Formal", "Wedding", "Party", "Eid / Festive", "Winter", OTHER_OPTION];

// "raw silk" -> "Raw Silk", "off-white" -> "Off-White", "eid / festive" -> "Eid / Festive".
export function toTitleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[\s\-/(])(\p{L})/gu, (_match, separator: string, letter: string) => separator + letter.toUpperCase());
}

// Turns a dropdown choice plus its "Other" text into the value that gets saved.
export function resolveChoice(selected: string, otherText: string) {
  return selected === OTHER_OPTION ? toTitleCase(otherText) : selected;
}

// Splits a saved value back into dropdown choice + "Other" text, e.g. when editing a fabric.
export function splitChoice(value: string, options: string[]) {
  if (!value) return { selected: "", other: "" };
  if (value !== OTHER_OPTION && options.includes(value)) return { selected: value, other: "" };
  return { selected: OTHER_OPTION, other: value };
}

export const fabricBestFor = ["Kurti", "Long Dress", "Frock", "Maxi", "2-Piece Suit", "3-Piece Suit", "Abaya", "Dupatta"];

export const fabricColorHex: Record<string, string> = {
  Cream: "#EFF9FB",
  Pink: "#F4B7C8",
  Gold: "#D8B15D",
  Navy: "#14213D",
  Mint: "#B7E4D0",
  Purple: "#C7B2EA",
  Beige: "#D8C7A9",
  White: "#FFFFFF",
};

const STORE_PROFILE_KEY = "multife_store_profile";
const STORE_FABRICS_KEY = "multife_store_fabrics";

export const storeBasePath = window.location.pathname.startsWith("/multife-local") ? "/multife-local" : "";

export function goToStorePath(route: string) {
  window.location.assign(`${storeBasePath}${route}`);
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Returns an error message when the browser refuses to store the data (usually a full quota).
function writeJson(key: string, value: unknown): string | null {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return null;
  } catch {
    return "Your browser storage is full. Remove a few photos or use smaller images, then try again.";
  }
}

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const asNumber = (value: unknown, fallback = 0) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
const asStringList = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);

// Saved data may be old, partial or hand-edited, so rebuild it field by field instead of trusting its shape.
export function getStoreProfile(): StoreProfile | null {
  const raw = readJson<Record<string, unknown> | null>(STORE_PROFILE_KEY, null);
  if (!raw || typeof raw !== "object" || !asString(raw.name).trim()) return null;

  const storeType = asString(raw.storeType) as StoreType;
  return {
    id: asString(raw.id, "store-local"),
    name: asString(raw.name),
    tagline: asString(raw.tagline),
    description: asString(raw.description),
    storeType: storeTypes.includes(storeType) ? storeType : "Boutique",
    specialties: asStringList(raw.specialties),
    logo: asString(raw.logo),
    banner: asString(raw.banner),
    city: asString(raw.city),
    area: asString(raw.area),
    address: asString(raw.address),
    mapLink: asString(raw.mapLink),
    ownerName: asString(raw.ownerName),
    phone: asString(raw.phone),
    whatsapp: asString(raw.whatsapp),
    email: asString(raw.email),
    openDays: asStringList(raw.openDays),
    openTime: asString(raw.openTime, "11:00"),
    closeTime: asString(raw.closeTime, "21:00"),
    turnaroundMin: asNumber(raw.turnaroundMin, 7),
    turnaroundMax: asNumber(raw.turnaroundMax, 10),
    stitchingFrom: asNumber(raw.stitchingFrom),
    services: asStringList(raw.services),
    paymentMethods: asStringList(raw.paymentMethods),
    registrationNumber: asString(raw.registrationNumber),
    createdAt: asString(raw.createdAt, new Date().toISOString()),
  };
}

export function getStoreInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function saveStoreProfile(profile: StoreProfile) {
  return writeJson(STORE_PROFILE_KEY, profile);
}

export function getStoreFabrics(): StoreFabric[] {
  const raw = readJson<unknown>(STORE_FABRICS_KEY, []);
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && Boolean(asString(item.name)))
    .map((item) => ({
      id: asString(item.id, createId("fabric")),
      name: asString(item.name),
      material: asString(item.material),
      category: asString(item.category),
      color: asString(item.color),
      occasion: asString(item.occasion),
      pricePerYard: asNumber(item.pricePerYard),
      recommendedYards: asNumber(item.recommendedYards, 3),
      stitchingFrom: asNumber(item.stitchingFrom),
      stockYards: asNumber(item.stockYards),
      texture: asString(item.texture),
      description: asString(item.description),
      bestFor: asStringList(item.bestFor),
      care: asString(item.care),
      images: asStringList(item.images),
      status: item.status === "Draft" ? "Draft" : "Active",
      customizations: normalizeCustomizations(item.customizations),
    }));
}

export function saveStoreFabrics(fabrics: StoreFabric[]) {
  return writeJson(STORE_FABRICS_KEY, fabrics);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// Shrinks an uploaded photo to a JPEG data URL so it fits in browser storage until a backend exists.
export function compressImage(file: File, maxSize: number, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This file is not a supported image."));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Could not process this image."));
          return;
        }
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function toggleInList(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function isValidPakistaniMobile(value: string) {
  return /^(\+92|0)3\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function formatPkr(value: number) {
  return `PKR ${value.toLocaleString("en-PK")}`;
}
