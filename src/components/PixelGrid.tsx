import { EphemeralPresenceUser } from "@microsoft/live-share";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import Pixel from "./Pixel";
import { PresenceData } from "../live-share-hooks/usePresence";

export interface IPixelGridProps {
  pixelStateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>;
  setPixelColor: (x: number, y: number, color: string) => void;
  changePresencePosition: (x: number, y: number) => void;
  otherUsers: EphemeralPresenceUser[];
  selectedColor?: string;
}

export const PixelGrid: FC<IPixelGridProps> = ({
  pixelStateMap,
  setPixelColor,
  changePresencePosition,
  otherUsers,
  selectedColor,
}) => {
  return (
    <div>
      {[...range(0, 40)].map((xIndex) => {
        return (
          <div key={`${xIndex}`} style={{ width: 27, float: "left" }}>
            {[...range(0, 25)].map((yIndex) => {
              return (
                <div key={`${xIndex},${yIndex}`}>
                  <Pixel
                    pixelStateMap={pixelStateMap}
                    xIndex={xIndex}
                    yIndex={yIndex}
                    onPixelSelected={setPixelColor}
                    otherUsers={otherUsers}
                    selectedColor={selectedColor}
                    onMouseOverPixel={(x: number, y: number) => {
                      changePresencePosition(x, y);
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);
