import { useState } from "react";

const GridPixel = ({
  stateMap,
  xIndex,
  yIndex,
  onPixelSelected,
  otherUsers,
  selectedColor,
  onMouseOverPixel,
}) => {
  const [color, setColor] = useState("white");
  stateMap.set(`${xIndex},${yIndex}`, [color, setColor]);

  let otherUserColor = undefined;
  otherUsers.forEach((user) => {
    if (user.data.xIndex && user.data.yIndex) {
      if (user.data.xIndex === xIndex && user.data.yIndex === yIndex) {
        otherUserColor = user.data.selectedColor;
      }
    }
  });

  const [mouseOverColor, setMouseOverColor] = useState(undefined);

  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 25,
    width: 25,
    backgroundColor: mouseOverColor ?? otherUserColor ?? color,
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
