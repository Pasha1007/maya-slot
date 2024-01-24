export type ByttonKey = "min" | "max" | "prev" | "next";

export type ButtonConfigType = {
  text: string;
  key: ByttonKey;
};

export const buttonsConfig: ButtonConfigType[] = [
  { key: "min", text: "MIN" },
  { key: "prev", text: "" },
  { key: "next", text: "" },
  { key: "max", text: "MAX" },
];
