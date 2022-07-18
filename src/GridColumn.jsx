import GridPixel from "./GridPixel";

const GridColumn = ({ xIndex, columnData, pixelSelected }) => {
  return (
    <div style={{ width: 27, float: "left" }}>
      {columnData.map((pixelColor, yIndex) => {
        return (
          <GridPixel
            xIndex={xIndex}
            yIndex={yIndex}
            pixelColor={pixelColor}
            pixelSelected={pixelSelected}
          />
        );
      })}
    </div>
  );
};

export default GridColumn;
