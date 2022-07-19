import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { SharedMap } from "fluid-framework";

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export const usePixelMap = (
  stateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>,
  pixelMap?: SharedMap
) => {
  // const map = new Map<string, [string, Dispatch<SetStateAction<string>>]>();

  // const initState = () => {
  //   [...range(0, 40)].forEach((x) => {
  //     [...range(0, 25)].forEach((y) => {
  //       map.current.set(`${x},${y}`, useState("white"));
  //     });
  //   });
  // };

  const [pixelMapStarted, setStarted] = useState(false);

  // const [pixelMapState, setPixelMapState] = useState(new Map<string, string>());

  const setPixelColor = useCallback(
    (x: number, y: number, color: string) => {
      pixelMap?.set(`${x},${y}`, color);
    },
    [pixelMap]
  );

  const refreshPixels = useCallback(() => {
    console.log("refresh pixels");

    // const map = new Map<string, string>();

    pixelMap?.forEach((value, key) => {
      if (stateMap.get(key)?.[0] != value) {
        console.log(stateMap.get(key));
        stateMap.get(key)?.[1](value);
      }
    });

    // tigger a render. same instance
    // setPixelMapState(map);
  }, [pixelMap]);

  useEffect(() => {
    if (pixelMap && !pixelMapStarted) {
      setStarted(true);
      pixelMap?.on("valueChanged", refreshPixels);
      refreshPixels();
    }
  }, [pixelMap, pixelMapStarted, setStarted, refreshPixels]);

  return {
    setPixelColor,
  };
};
