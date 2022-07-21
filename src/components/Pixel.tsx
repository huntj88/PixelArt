import { Dispatch, FC, SetStateAction, useState } from "react";

export const pixelSize = 25;
export const pixelBorderSize = 1;

export interface IPixelProps {
  pixelStateMap: Map<string, IPixelColorState>;
  xIndex: number;
  yIndex: number;
  onPixelSelected: (x: number, y: number) => void;
  onMouseOverPixel: (x: number, y: number) => void;
}

export interface IPixelColorState {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  mouseOverColor: string | null;
  setMouseOverColor: Dispatch<SetStateAction<string | null>>;
}

const Pixel: FC<IPixelProps> = ({
  pixelStateMap,
  xIndex,
  yIndex,
  onPixelSelected,
  onMouseOverPixel,
}) => {
  console.log(`${xIndex},${yIndex}`);
  const [color, setColor] = useState("white");
  const [mouseOverColor, setMouseOverColor] = useState<string | null>(null);

  pixelStateMap.set(`${xIndex},${yIndex}`, {
    color,
    setColor,
    mouseOverColor,
    setMouseOverColor,
  });

  const styles = {
    border: `${pixelBorderSize}px solid rgba(0, 0, 0, 0.05)`,
    height: pixelSize,
    width: pixelSize,
    backgroundColor: mouseOverColor ?? color,
    float: "left",
  } as React.CSSProperties;
  return (
    <div
      style={styles}
      onClick={() => onPixelSelected(xIndex, yIndex)}
      onMouseOver={() => {
        onMouseOverPixel(xIndex, yIndex);
      }}
    />
  );
};

export default Pixel;
