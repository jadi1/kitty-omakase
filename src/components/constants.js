export const numRows = 6;
export const numCols = 8;
export const tileSize = 1;

export const facings = Object.freeze({
  LEFT: 3,
  RIGHT: 1,
  UP: 2,
  DOWN: 0,
});

export const food = Object.freeze({
  RICE: "rice",
  RICEPOT: "ricepot",
  NORI: "nori",
  SALMON: "salmon",
  TUNA: "tuna",
  CHOPPEDSALMON: "choppedsalmon",
  CHOPPEDTUNA: "choppedtuna",
  RICENORI: "ricenori",
  TUNARICE: "tunarice",
  TUNANORI: "tunanori",
  TUNASUSHI: "tunasushi",
  SALMONNORI: "salmonnori",
  SALMONRICE: "salmonrice",
  SALMONSUSHI: "salmonsushi"
});

export const pointsPerOrder = 50;
export const pointsPerWrongOrder = 30;
export const PLATEGENERATOR = "plategenerator";