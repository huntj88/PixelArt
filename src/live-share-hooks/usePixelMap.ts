import { useEffect, useState, useCallback } from "react";
import { SharedMap } from "fluid-framework";
import { IPixelColorState } from "../components/Pixel";

export const usePixelMap = (
  pixelStateMap: Map<string, IPixelColorState>,
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
    pixelSharedMap?.forEach((sharedColor, keyXY) => {
      const existingColor = pixelStateMap.get(keyXY)?.color;
      if (existingColor !== sharedColor) {
        const setColorState = pixelStateMap.get(keyXY)?.setColor;
        setColorState?.(sharedColor);
      }
    });
  }, [pixelSharedMap, pixelStateMap]);

  useEffect(() => {
    if (pixelSharedMap && !pixelMapStarted) {
      setStarted(true);
      pixelSharedMap.on("valueChanged", refreshPixels);
      refreshPixels();
    }
  }, [pixelSharedMap, pixelMapStarted, setStarted, refreshPixels]);

  return {
    setPixelColor,
  };
};
