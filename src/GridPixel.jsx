import { useState } from "react";

const GridPixel = ({
  pixelMapState,
  xIndex,
  yIndex,
  onPixelSelected,
  otherUsers,
  selectedColor,
  onMouseOverPixel,
}) => {
  let bgColor = "white";
  if (pixelMapState) {
    bgColor = pixelMapState.get(`${xIndex},${yIndex}`);
  }

  otherUsers.forEach((user) => {
    if (user.data.xIndex && user.data.yIndex) {
      if (user.data.xIndex === xIndex && user.data.yIndex === yIndex) {
        bgColor = user.data.selectedColor;
      }
    }
  });

  const [mouseOverColor, setMouseOverColor] = useState(undefined);

  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 25,
    width: 25,
    backgroundColor: mouseOverColor ?? bgColor,
    float: "left",
  };
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

export default GridPixel;
