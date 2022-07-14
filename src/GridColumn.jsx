import GridPixel from "./GridPixel";

const GridColumn = ({ xIndex, columnData, setPixelColor }) => {
  return (
    <div style={{ width: 50, float: "left" }}>
      {columnData.map((pixelColor, yIndex) => {
        return (
          <GridPixel
            xIndex={xIndex}
            yIndex={yIndex}
            pixelColor={pixelColor}
            setPixelColor={setPixelColor}
          />
        );
      })}
    </div>
  );
};

export default GridColumn;
