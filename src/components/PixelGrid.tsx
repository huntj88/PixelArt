import { FC } from "react";
import Pixel, { IPixelColorState } from "./Pixel";

export interface IPixelGridProps {
  pixelStateMap: Map<string, IPixelColorState>;
  onPixelSelected: (x: number, y: number) => void;
  changePresencePosition: (x: number, y: number) => void;
  selectedColor?: string;
}

export const PixelGrid: FC<IPixelGridProps> = ({
  pixelStateMap,
  onPixelSelected,
  changePresencePosition,
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
                    onPixelSelected={onPixelSelected}
                    selectedColor={selectedColor}
                    onMouseOverPixel={changePresencePosition}
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
