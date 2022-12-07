interface ISkin {
  fill: string;
  border: string;
  disabled: string;
  hover: string;
  active: string;
  radius: number;
}

const DefaultSkin: ISkin = {
  fill: "#ddd",
  border: "#333",
  disabled: "#888",
  hover: "#000",
  active: "rgb(255,215,0,0.8)",
  radius: 8
}

const DarkSkin: ISkin = {
  fill: "#333",
  border: "#cfcfcf",
  disabled: "#888",
  hover: "#fff",
  active: "rgb(255,215,0,0.8)",
  radius: 8
}

export { ISkin, DefaultSkin, DarkSkin }
