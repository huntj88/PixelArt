import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { SharedMap } from "fluid-framework";

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export const usePixelMap = (
  pixelStateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>,
  pixelSharedMap?: SharedMap
) => {
  const [pixelMapStarted, setStarted] = useState(false);

  const setPixelColor = useCallback(
    (x: number, y: number, color: string) => {
      pixelSharedMap?.set(`${x},${y}`, color);
    },
    [pixelSharedMap]
  );

  const refreshPixels = useCallback(() => {
    console.log("refresh pixels");

    pixelSharedMap?.forEach((sharedColor, key) => {
      const existingColor = pixelStateMap.get(key)?.[0];
      if (existingColor !== sharedColor) {
        const setColorState = pixelStateMap.get(key)?.[1];
        setColorState?.(sharedColor);
      }
    });
  }, [pixelSharedMap]);

  useEffect(() => {
    if (pixelSharedMap && !pixelMapStarted) {
      setStarted(true);
      pixelSharedMap?.on("valueChanged", refreshPixels);
      refreshPixels();
    }
  }, [pixelSharedMap, pixelMapStarted, setStarted, refreshPixels]);

  return {
    setPixelColor,
  };
};
