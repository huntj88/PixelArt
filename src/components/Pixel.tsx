import { Dispatch, FC, SetStateAction, useState } from "react";

export interface IPixelProps {
  pixelStateMap: Map<string, IPixelColorState>;
  xIndex: number;
  yIndex: number;
  onPixelSelected: (x: number, y: number) => void;
  selectedColor?: string;
  onMouseOverPixel: (x: number, y: number) => void;
}

export interface IPixelColorState {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  otherUserMouseOverColor?: string;
  setOtherUserMouseOverColor: Dispatch<SetStateAction<string | undefined>>;
}

const Pixel: FC<IPixelProps> = ({
  pixelStateMap,
  xIndex,
  yIndex,
  onPixelSelected,
  selectedColor,
  onMouseOverPixel,
}) => {
  console.log(`rendering pixel: ${xIndex},${yIndex}`);
  const [color, setColor] = useState("white");
  const [mouseOverColor, setMouseOverColor] = useState<string | undefined>(
    undefined
  );

  const [otherUserMouseOverColor, setOtherUserMouseOverColor] = useState<
    string | undefined
  >(undefined);

  pixelStateMap.set(`${xIndex},${yIndex}`, {
    color,
    setColor,
    otherUserMouseOverColor,
    setOtherUserMouseOverColor,
  });

  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 25,
    width: 25,
    backgroundColor: mouseOverColor ?? otherUserMouseOverColor ?? color,
    float: "left",
  } as React.CSSProperties;
  return (
    <div
      style={styles}
      onClick={() => onPixelSelected(xIndex, yIndex)}
      onMouseOver={() => {
        setMouseOverColor(selectedColor);
        onMouseOverPixel(xIndex, yIndex);
      }}
      onMouseOut={() => {
        setMouseOverColor(undefined);
      }}
    />
  );
};

export default Pixel;
