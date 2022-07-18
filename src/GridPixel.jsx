const GridPixel = ({
  pixelMapState,
  xIndex,
  yIndex,
  pixelSelected,
  users,
  onMouseOverPixel,
}) => {
  let bgColor = "white";
  if (pixelMapState) {
    bgColor = pixelMapState.get(`${xIndex},${yIndex}`);
  }

  users.forEach((user) => {
    if (user.data.xIndex && user.data.yIndex) {
      if (user.data.xIndex === xIndex && user.data.yIndex === yIndex) {
        bgColor = "green";
      }
    }
  });

  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 25,
    width: 25,
    backgroundColor: bgColor,
    float: "left",
  };
  return (
    <div
      style={styles}
      onClick={() => pixelSelected(xIndex, yIndex)}
      onMouseOver={() => onMouseOverPixel(xIndex, yIndex)}
    />
  );
};

export default GridPixel;
