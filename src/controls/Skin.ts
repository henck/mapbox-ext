/**
 * This interface defines the properties that a skin must have.
 */
interface ISkin {
  /** Fill color */
  fill: string;
  /** Border color */
  border: string;
  /** Disabled color */
  disabled: string;
  /** Hover color */
  hover: string;
  /** Active color */
  active: string;
  /** Border radius */
  radius: number;
}

/**
 * The default skin is light.
 */
const DefaultSkin: ISkin = {
  fill: "#ddd",
  border: "#333",
  disabled: "#888",
  hover: "#000",
  active: "rgb(255,215,0,0.8)",
  radius: 8
}

/**
 * The dark skin works best on dark maps.
 */
const DarkSkin: ISkin = {
  fill: "#333",
  border: "#cfcfcf",
  disabled: "#888",
  hover: "#fff",
  active: "rgb(255,215,0,0.8)",
  radius: 8
}

export { ISkin, DefaultSkin, DarkSkin }
