import { Dispatch, FC, SetStateAction, useState } from "react";

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
  mouseOverColor?: string;
  setMouseOverColor: Dispatch<SetStateAction<string | undefined>>;
}

const Pixel: FC<IPixelProps> = ({
  pixelStateMap,
  xIndex,
  yIndex,
  onPixelSelected,
  onMouseOverPixel,
}) => {
  const [color, setColor] = useState("white");
  const [mouseOverColor, setMouseOverColor] = useState<string | undefined>(
    undefined
  );

  pixelStateMap.set(`${xIndex},${yIndex}`, {
    color,
    setColor,
    mouseOverColor,
    setMouseOverColor,
  });

  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 25,
    width: 25,
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
