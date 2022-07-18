import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SharedMap } from "fluid-framework";

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export const usePixelMap = (pixelMap?: SharedMap) => {
  // // x pos is index of outer array, y pos is index of an inner array
  const [pixelBoard, setPixelBoard] = useState<string[][]>(
    [...range(0, 40)].map(() => {
      return [...range(0, 25)].map(() => "white");
    })
  );

  const [pixelMapStarted, setStarted] = useState(false);

  const setPixelColor = useCallback(
    (x: number, y: number, color: string) => {
      pixelMap?.set(`${x},${y}`, color);
    },
    [pixelMap]
  );

  const refreshPixels = useCallback(() => {
    const mutableBoard = [...pixelBoard];

    pixelMap?.forEach((value: string, key: string) => {
      const x = Number.parseInt(key.split(",")[0]);
      const y = Number.parseInt(key.split(",")[1]);
      mutableBoard[x][y] = value;
    });

    setPixelBoard(mutableBoard);
  }, [pixelMap, pixelBoard, setPixelBoard]);

  useEffect(() => {
    if (pixelMap && !pixelMapStarted) {
      setStarted(true);
      pixelMap?.on("valueChanged", refreshPixels);
      refreshPixels();
    }
  }, [pixelMap, pixelMapStarted, setPixelBoard, setStarted, refreshPixels]);

  return {
    pixelBoard,
    setPixelColor,
  };
};
