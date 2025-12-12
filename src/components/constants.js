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
  SALMON: "salmon",
  RICE: "rice",
  NORI: "nori", // to test delivery, change this to 'tunasushi'
  TUNA: "tuna",
  TUNASUSHI: "tunasushi",
  SALMONSUSHI: "salmonsushi",
});
