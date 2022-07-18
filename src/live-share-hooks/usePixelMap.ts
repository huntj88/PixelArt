import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SharedMap } from "fluid-framework";

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export const usePixelMap = (pixelMap?: SharedMap) => {
  const [pixelMapStarted, setStarted] = useState(false);
  const [pixelMapState, setPixelMapState] = useState(new Map<string, string>());

  const setPixelColor = useCallback(
    (x: number, y: number, color: string) => {
      pixelMap?.set(`${x},${y}`, color);
    },
    [pixelMap]
  );

  const refreshPixels = useCallback(() => {
    console.log("refresh pixels");

    const map = new Map<string, string>();

    pixelMap?.forEach((value, key) => {
      map.set(key, value);
    });

    // tigger a render. same instance
    setPixelMapState(map);
  }, [pixelMap, setPixelMapState]);

  useEffect(() => {
    if (pixelMap && !pixelMapStarted) {
      setStarted(true);
      pixelMap?.on("valueChanged", refreshPixels);
      refreshPixels();
    }
  }, [pixelMap, pixelMapStarted, setStarted, refreshPixels]);

  return {
    pixelMapState,
    setPixelColor,
  };
};
