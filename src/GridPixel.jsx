const GridPixel = ({ xIndex, yIndex, pixelColor, pixelSelected }) => {
  const styles = {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: 50,
    width: 50,
    backgroundColor: pixelColor,
    float: "left",
  };
  return <div style={styles} onClick={() => pixelSelected(xIndex, yIndex)} />;
};

export default GridPixel;
