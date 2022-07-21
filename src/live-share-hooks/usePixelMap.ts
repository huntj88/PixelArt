import { useEffect, useState, useCallback, MutableRefObject } from "react";
import { SharedMap } from "fluid-framework";
import { IPixelColorState } from "../components/Pixel";

export const usePixelMap = (
  pixelStateMapRef: MutableRefObject<Map<string, IPixelColorState>>,
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
      const existingColor = pixelStateMapRef.current.get(keyXY)?.color;
      if (existingColor !== sharedColor) {
        pixelStateMapRef.current.get(keyXY)?.setColor?.(sharedColor);
      }
    });
  }, [pixelSharedMap, pixelStateMapRef]);

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
