import GridPixel from "./GridPixel";

const GridColumn = ({
  pixelMapState,
  xIndex,
  onPixelSelected,
  otherUsers,
  selectedColor,
  onMouseOverPixel,
}) => {
  return (
    <div style={{ width: 27, float: "left" }}>
      {[...range(0, 25)].map((yIndex) => {
        return (
          <GridPixel
            pixelMapState={pixelMapState}
            xIndex={xIndex}
            yIndex={yIndex}
            onPixelSelected={onPixelSelected}
            otherUsers={otherUsers}
            selectedColor={selectedColor}
            onMouseOverPixel={onMouseOverPixel}
          />
        );
      })}
    </div>
  );
};

const range = (start, end, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default GridColumn;
