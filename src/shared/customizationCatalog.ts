// Every customization step the customer walks through, in app order.
// Group ids match the keys the customer flow saves selections under, so a fabric's
// allowed options can be applied directly to each customization screen.
// Keep option labels identical to the customer screens in src/customer/App.tsx.

export type CustomizationGroup = {
  id: string;
  title: string;
  options: readonly string[];
};

export type CustomizationSection = {
  id: string;
  title: string;
  groups: CustomizationGroup[];
};

// Allowed options per group id. A missing group means every option is allowed.
export type FabricCustomizations = Record<string, string[]>;

export const customizationCatalog: CustomizationSection[] = [
  {
    id: "neck",
    title: "Neck",
    groups: [
      { id: "neckType", title: "Neck type", options: ["Round Neck", "V-Neck", "Boat Neck", "Square Neck", "Mandarin Collar", "Jewel Neck", "Keyhole", "Scoop Neck"] },
      { id: "neckDepth", title: "Neck depth", options: ["Shallow", "Standard", "Deep"] },
      { id: "neckFinish", title: "Front / back finish", options: ["Plain Front", "Embroidered Front", "Closed Back", "Keyhole Back"] },
    ],
  },
  {
    id: "shoulder",
    title: "Shoulder & armhole",
    groups: [
      { id: "shoulderStyle", title: "Shoulder style", options: ["Standard Shoulder", "Relaxed Shoulder", "Structured Shoulder", "Dropped Shoulder"] },
      { id: "shoulderWidth", title: "Shoulder width", options: ["Narrow", "Standard", "Broad"] },
      { id: "armholeShape", title: "Armhole shape", options: ["Standard", "Comfort Fit", "Tailored", "Deep Armhole"] },
    ],
  },
  {
    id: "upperArm",
    title: "Upper arm & sleeve volume",
    groups: [
      { id: "upperArmFit", title: "Upper arm fit", options: ["Slim Fit", "Regular Fit", "Comfort Fit", "Relaxed Fit", "Gathered Upper Arm", "Pleated Upper Arm"] },
      { id: "sleeveVolume", title: "Sleeve volume", options: ["Minimal", "Moderate", "Full"] },
      { id: "decorativeStyle", title: "Decorative style", options: ["Plain", "Piping", "Embroidered", "Panel Detail"] },
    ],
  },
  {
    id: "forearm",
    title: "Forearm",
    groups: [
      { id: "forearmShape", title: "Forearm shape", options: ["Narrow Forearm", "Straight Forearm", "Regular Forearm", "Tapered Forearm", "Loose Forearm", "Gathered Forearm"] },
      { id: "forearmDetail", title: "Forearm detail", options: ["Plain", "Button Tab", "Slit Opening", "Embroidered Panel"] },
    ],
  },
  {
    id: "cuff",
    title: "Sleeve end / cuff",
    groups: [
      { id: "cuffStyle", title: "Cuff style", options: ["Plain Hem", "Narrow Cuff", "Button Cuff", "Embroidered Cuff", "Lace Trim Cuff", "Scallop Edge", "Frill Cuff", "Loop Button Cuff"] },
      { id: "edgeFinish", title: "Edge finish", options: ["Clean Fold", "Piping", "Contrast Border", "Beaded Finish"] },
    ],
  },
  {
    id: "fullSleeve",
    title: "Full sleeve style",
    groups: [
      { id: "fullSleeveStyle", title: "Full sleeve style", options: ["Straight Sleeve", "Bell Sleeve", "Bishop Sleeve", "Puff Sleeve", "Panel Sleeve", "Flared Sleeve", "Slit Sleeve", "Umbrella Sleeve"] },
      { id: "sleeveFinish", title: "Sleeve finish", options: ["Simple", "Embroidered", "Contrast Border", "Lace Detail"] },
    ],
  },
  {
    id: "silhouette",
    title: "Body / silhouette",
    groups: [
      { id: "bodyShape", title: "Body shape", options: ["Straight Cut", "A-Line", "Semi-Fitted", "Loose Fit", "Angrakha", "Anarkali", "Kalidar", "Peplum", "Kaftan", "Frock Style"] },
      { id: "fitPreference", title: "Fit preference", options: ["Structured", "Relaxed", "Flowing"] },
      { id: "flareLevel", title: "Flare level", options: ["Minimal", "Moderate", "Full"] },
    ],
  },
  {
    id: "length",
    title: "Kameez length",
    groups: [
      { id: "dressLength", title: "Dress length", options: ["Short", "Hip Length", "Knee Length", "Mid-Calf", "Ankle Length", "Floor Length"] },
      { id: "frontBackLength", title: "Front / back length", options: ["Same Length", "Slight High-Low", "Extended Back"] },
    ],
  },
  {
    id: "hem",
    title: "Daman / chaak / hem",
    groups: [
      { id: "hemStyle", title: "Hem style", options: ["Straight Daman", "Rounded Hem", "High-Low Hem", "Side Chaak", "Double Chaak", "Front Slit", "Scalloped Hem", "Asymmetric Hem"] },
      { id: "hemWidth", title: "Hem width", options: ["Slim", "Standard", "Wide"] },
    ],
  },
  {
    id: "lace",
    title: "Lace / embroidery / border",
    groups: [
      { id: "finishingDetail", title: "Finishing detail", options: ["Neck Border", "Sleeve Border", "Daman Border", "Front Patti", "Side Lace", "Minimal Embroidery", "Festive Embroidery", "Full Border Set"] },
      { id: "placement", title: "Placement", options: ["Neckline", "Sleeves", "Hem"] },
      { id: "styleLevel", title: "Style level", options: ["Minimal", "Elegant", "Festive"] },
    ],
  },
  {
    id: "bottomWear",
    title: "Bottom wear type",
    groups: [
      { id: "bottomWearType", title: "Bottom wear type", options: ["Shalwar", "Straight Pant", "Cigarette Pant", "Trouser", "Palazzo", "Tulip Pant", "Gharara", "Sharara", "Lehenga Skirt"] },
      { id: "styleFamily", title: "Style family", options: ["Casual", "Festive", "Formal"] },
    ],
  },
  {
    id: "bodyFit",
    title: "Body fit",
    groups: [
      { id: "torsoFit", title: "Torso fit", options: ["Slim Fit", "Regular Fit", "Comfort Fit", "Relaxed Fit", "Loose Fit", "Structured Fit"] },
      { id: "waistShape", title: "Waist shape", options: ["Straight Waist", "Natural Waist", "Empire Waist"] },
      { id: "easePreference", title: "Ease preference", options: ["Close Ease", "Standard Ease", "Extra Ease"] },
    ],
  },
  {
    id: "thighKnee",
    title: "Thigh / knee",
    groups: [
      { id: "thighFit", title: "Thigh fit", options: ["Slim Thigh", "Regular Thigh", "Relaxed Thigh", "Pleated Thigh"] },
      { id: "kneeShaping", title: "Knee shaping", options: ["Straight Knee", "Tapered Knee", "Flared Knee", "Structured Knee"] },
      { id: "functionalDetails", title: "Functional details", options: ["Side Pleat", "Panel Seam", "Extra Ease"] },
    ],
  },
  {
    id: "paincha",
    title: "Paincha / lower leg",
    groups: [
      { id: "painchaStyle", title: "Paincha style", options: ["Narrow Paincha", "Straight Paincha", "Wide Paincha", "Tapered Paincha", "Cuffed Paincha", "Flared Paincha"] },
      { id: "lowerEdgeFinish", title: "Lower edge finish", options: ["Plain Edge", "Lace Edge", "Embroidered Edge", "Button Detail", "Slit Opening", "Scalloped Edge"] },
      { id: "ankleOpening", title: "Ankle opening width", options: ["Narrow", "Standard", "Wide"] },
    ],
  },
  {
    id: "dupatta",
    title: "Dupatta",
    groups: [
      { id: "dupattaStyle", title: "Dupatta style", options: ["Standard Dupatta", "Chiffon Dupatta", "Organza Dupatta", "Net Dupatta", "Banarsi Dupatta", "Embroidered Dupatta"] },
      { id: "dupattaLength", title: "Dupatta length", options: ["Short", "Standard", "Long"] },
      { id: "dupattaBorder", title: "Dupatta border / finishing", options: ["Plain Border", "Lace Border", "Embroidered Border", "Tassels", "Gota Detail"] },
    ],
  },
];

export const customizationGroups = customizationCatalog.flatMap((section) => section.groups);

export function createEmptyCustomizations(): FabricCustomizations {
  return Object.fromEntries(customizationGroups.map((group) => [group.id, []]));
}

export function createAllCustomizations(): FabricCustomizations {
  return Object.fromEntries(customizationGroups.map((group) => [group.id, [...group.options]]));
}

// Keeps only known groups/options (in catalog order); groups missing from saved data default to all options.
export function normalizeCustomizations(value: unknown): FabricCustomizations {
  const saved = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return Object.fromEntries(
    customizationGroups.map((group) => {
      const stored = saved[group.id];
      if (!Array.isArray(stored)) return [group.id, [...group.options]];
      return [group.id, group.options.filter((option) => stored.includes(option))];
    })
  );
}

// Options a customer may pick for one group; without restrictions every option stays available.
export function filterAllowedOptions<T extends string>(
  groupId: string,
  options: readonly T[],
  allowed?: FabricCustomizations
): T[] {
  const allowedForGroup = allowed?.[groupId];
  if (!allowedForGroup) return [...options];
  const filtered = options.filter((option) => allowedForGroup.includes(option));
  // Never leave a customer with nothing to choose; fall back to the full list.
  return filtered.length ? filtered : [...options];
}

export function pickAllowedValue<T extends string>(available: readonly T[], ...preferred: Array<string | undefined>): T {
  const match = preferred.find((value): value is T => Boolean(value) && available.includes(value as T));
  return match ?? available[0];
}
